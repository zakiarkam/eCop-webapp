// app/api/auth/first-time-login/route.ts
import { NextRequest, NextResponse } from "next/server";
import License from "@/models/licenceHolder";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";
import {
  generateTemporaryPassword,
  sendTemporaryPasswordEmail,
} from "@/lib/email/emailUtils";
import bcrypt from "bcryptjs";

interface FirstTimeLoginRequest {
  identificationNo: string; // This will be either licenceNumber or policeNumber
  email: string;
}

interface FirstTimeLoginResponse {
  success: boolean;
  message: string;
  data?: {
    fullName: string;
    userType: string;
  };
}

// Helper function to find user by identification number
async function findUserByIdentificationNo(identificationNo: string) {
  try {
    // First try to find in License collection
    const license = await License.findOne({
      licenceNumber: identificationNo,
    });

    if (license) {
      return {
        user: license,
        userType: "license",
        model: License,
      };
    }

    // If not found in License, try Police collection
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
    console.log("First time login POST request received");

    // Parse request body
    let body: FirstTimeLoginRequest;
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

    console.log("Request body parsed:", body);

    await connectToDatabase();
    console.log("Database connected successfully");

    const { identificationNo, email } = body;
    console.log(
      "Processing request for ID:",
      identificationNo,
      "email:",
      email
    );

    // Validate input
    if (!identificationNo || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Identification number and email are required",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
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
          message: "Identification number not found in our database",
        },
        { status: 404 }
      );
    }

    const { user, userType, model } = userResult;
    console.log(
      "User found:",
      user._id,
      "userType:",
      userType,
      "hasLoggedIn:",
      user.hasLoggedIn
    );

    // Check if user has already logged in before
    if (user.hasLoggedIn) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account has already been activated. Please use regular login.",
        },
        { status: 400 }
      );
    }

    // Check if user is active (for license holders, check status; for police officers, check status)
    if (user.status !== "active") {
      const statusMessage =
        userType === "license"
          ? "This license is not active. Please contact support."
          : "This police officer account is not active. Please contact support.";

      return NextResponse.json(
        {
          success: false,
          message: statusMessage,
        },
        { status: 400 }
      );
    }

    // Generate temporary password
    console.log("Generating temporary password");
    const temporaryPassword = generateTemporaryPassword();
    const hashedTempPassword = await bcrypt.hash(temporaryPassword, 12);

    // Set temporary password expiry (15 minutes)
    const tempPasswordExpiry = new Date();
    tempPasswordExpiry.setMinutes(tempPasswordExpiry.getMinutes() + 15);

    // Update user with email and temporary password
    console.log("Updating user with temporary password");
    await model.findByIdAndUpdate(user._id, {
      email: email.toLowerCase(),
      temporaryPassword: hashedTempPassword,
      temporaryPasswordExpiry: tempPasswordExpiry,
    });

    // Send email with temporary password
    console.log("Sending temporary password email to:", email);
    const emailSent = await sendTemporaryPasswordEmail(
      email,
      user.fullName,
      temporaryPassword
    );

    if (!emailSent) {
      console.error("Failed to send email");
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email. Please try again.",
        },
        { status: 500 }
      );
    }

    console.log("Temporary password sent successfully");
    return NextResponse.json(
      {
        success: true,
        message: "Temporary password sent to your email successfully",
        data: {
          fullName: user.fullName,
          userType: userType,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("First time login error:", error);

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

// Handle OPTIONS for CORS
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
