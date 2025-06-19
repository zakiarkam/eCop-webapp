import { NextRequest, NextResponse } from "next/server";
import Licence from "@/models/licenceHolder";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";
import bcrypt from "bcryptjs";

interface SetNewPasswordRequest {
  identificationNo: string;
  newPassword: string;
  confirmPassword: string;
}

interface SetNewPasswordResponse {
  success: boolean;
  message: string;
}

async function findUserByIdentificationNo(identificationNo: string) {
  try {
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
    console.log("=== SET NEW PASSWORD API CALLED ===");

    // Parse request body
    let body: SetNewPasswordRequest;
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

    console.log("Request body parsed:", {
      ...body,
      newPassword: "***",
      confirmPassword: "***",
    });

    await connectToDatabase();
    console.log("Database connected successfully");

    const { identificationNo, newPassword, confirmPassword } = body;

    if (!identificationNo || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        },
        { status: 400 }
      );
    }

    // Find user by identification number
    console.log("Searching for user:", identificationNo);
    const userResult = await findUserByIdentificationNo(identificationNo);

    if (!userResult) {
      console.log("User not found:", identificationNo);
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const { user, userType, model } = userResult;
    console.log("User found:", user._id, "userType:", userType);

    console.log("Hashing new password...");
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    console.log("Updating user with new password...");
    await model.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      temporaryPassword: null,
      temporaryPasswordExpiry: null,
      isFirstTimeLogin: false,
      hasLoggedIn: true,
      lastLoginDate: new Date(),
    });

    console.log("Password updated successfully");
    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Set new password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
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
