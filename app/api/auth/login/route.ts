import { NextRequest, NextResponse } from "next/server";
import Licence from "@/models/licenceHolder";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";
import bcrypt from "bcryptjs";

interface LoginRequest {
  identificationNo: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    fullName: string;
    userId: string;
    userType: string;
    token?: string;
    user: {
      fullName: string;
      nameWithInitials: string;
      identificationNo: string;
      email: string;
      role: string;
      userType: string;
      status: string;
      licenceNumber?: string;
      vehicleCategories?: Array<{
        category: string;
        issueDate: string;
        expiryDate: string;
      }>;
      policeNumber?: string;
      rank?: string;
      policeStation?: string;
      badgeNo?: string;
    };
  };
}

async function findUserByIdentificationNo(identificationNo: string) {
  try {
    // First try to find in Licence collection
    const licence = await Licence.findOne({
      licenceNumber: identificationNo,
    });

    if (licence) {
      return {
        user: licence,
        userType: "licence",
        model: Licence,
      };
    }

    // If not found in Licence, try Police collection
    const policeOfficer = await PoliceOfficer.findOne({
      policeNumber: identificationNo,
    });

    if (policeOfficer) {
      return {
        user: policeOfficer,
        userType: "police",
        model: PoliceOfficer,
      };
    }

    return null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== LOGIN API CALLED ===");

    let body: LoginRequest;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body format",
        },
        { status: 400 }
      );
    }

    console.log("Request body parsed:", { ...body, password: "***" });

    await connectToDatabase();
    console.log("Database connected successfully");

    const { identificationNo, password } = body;

    if (!identificationNo || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Identification number and password are required",
        },
        { status: 400 }
      );
    }

    console.log("Searching for user:", identificationNo);
    const userResult = await findUserByIdentificationNo(identificationNo);

    if (!userResult) {
      console.log("User not found:", identificationNo);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const { user, userType, model } = userResult;
    console.log("User found:", user._id, "userType:", userType);

    if (!user.hasLoggedIn || !user.password) {
      console.log("Account not activated - first time login required");
      return NextResponse.json(
        {
          success: false,
          message:
            "Account not activated. Please complete first-time login setup.",
        },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      console.log("User account not active:", user.status);
      return NextResponse.json(
        {
          success: false,
          message: `Account ${user.status}. Please contact support.`,
        },
        { status: 401 }
      );
    }

    // Additional checks for licence holders (check expiry)
    if (userType === "licence" && user.expiryDate) {
      if (new Date() > user.expiryDate) {
        console.log("Licence expired");
        return NextResponse.json(
          {
            success: false,
            message: "Your licence has expired. Please renew your licence.",
          },
          { status: 401 }
        );
      }
    }

    console.log("Verifying password...");
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log("Invalid password");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Update last login date
    console.log("Updating last login date...");
    await model.findByIdAndUpdate(user._id, {
      lastLoginDate: new Date(),
    });

    let userData: any = {
      fullName: user.fullName,
      nameWithInitials: user.nameWithInitials,
      identificationNo:
        userType === "licence" ? user.licenceNumber : user.policeNumber,
      email: user.email,
      role: user.role || userType,
      userType: userType,
      status: user.status,
    };

    if (userType === "licence") {
      userData.licenceNumber = user.licenceNumber;
      userData.vehicleCategories =
        user.vehicleCategories?.map((vc: any) => ({
          category: vc.category,
          issueDate: vc.issueDate,
          expiryDate: vc.expiryDate,
        })) || [];
    } else if (userType === "police") {
      userData.policeNumber = user.policeNumber;
      userData.rank = user.rank;
      userData.policeStation = user.policeStation;
      userData.badgeNo = user.badgeNo;
    }

    console.log("Login successful");
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          fullName: user.fullName,
          userId: user._id.toString(),
          userType: userType,
          user: userData,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);

    // More specific error handling
    if (error.name === "MongoNetworkError") {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection error. Please try again later.",
        },
        { status: 500 }
      );
    } else if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data format. Please check your input.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error. Please try again later.",
        },
        { status: 500 }
      );
    }
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
