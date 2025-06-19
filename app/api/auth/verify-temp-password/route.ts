// app/api/auth/verify-temp-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import Licence from "@/models/licenceHolder";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";
import bcrypt from "bcryptjs";

interface VerifyTempPasswordRequest {
  identificationNo: string;
  temporaryPassword: string;
}

interface VerifyTempPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    fullName: string;
    userId: string;
    userType: string;
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
    console.log("=== VERIFY TEMP PASSWORD API CALLED ===");

    let body: VerifyTempPasswordRequest;
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

    console.log("Request body parsed:", { ...body, temporaryPassword: "***" });

    await connectToDatabase();
    console.log("Database connected successfully");

    const { identificationNo, temporaryPassword } = body;

    if (!identificationNo || !temporaryPassword) {
      console.log("Missing required fields");
      return NextResponse.json(
        {
          success: false,
          message: "Identification number and temporary password are required",
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
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const { user, userType } = userResult;
    console.log("User found:", user._id, "userType:", userType);

    // Check if temporary password exists
    if (!user.temporaryPassword) {
      console.log("No temporary password found");
      return NextResponse.json(
        {
          success: false,
          message: "No temporary password found. Please request a new one.",
        },
        { status: 400 }
      );
    }

    if (
      user.temporaryPasswordExpiry &&
      new Date() > new Date(user.temporaryPasswordExpiry)
    ) {
      console.log("Temporary password expired");
      return NextResponse.json(
        {
          success: false,
          message: "Temporary password has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    console.log("Verifying temporary password...");
    const isValidTempPassword = await bcrypt.compare(
      temporaryPassword,
      user.temporaryPassword
    );

    if (!isValidTempPassword) {
      console.log("Invalid temporary password");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid temporary password",
        },
        { status: 400 }
      );
    }

    console.log("Temporary password verified successfully");
    return NextResponse.json(
      {
        success: true,
        message: "Temporary password verified successfully",
        data: {
          fullName: user.fullName,
          userId: user._id.toString(),
          userType: userType,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verify temporary password error:", error);
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
