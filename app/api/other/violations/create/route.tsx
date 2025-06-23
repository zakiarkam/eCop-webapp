// import { NextRequest, NextResponse } from "next/server";
// import ViolationRecord from "@/models/ViolationRecord";
// import licence from "@/models/licenceHolder";
// import PoliceOfficer from "@/models/policeOfficer";
// import Rule from "@/models/rule";
// import connectDB from "@/lib/mongo/mongodb";

// interface CreateViolationRequestBody {
//   licenceNumber: string;
//   policeNumber: string;
//   phoneNumber: string;
//   vehicleNumber: string;
//   placeOfViolation: string;
//   ruleId: string;
//   notes?: string;
// }

// interface ApiResponse<T = any> {
//   success: boolean;
//   message: string;
//   data?: T;
//   error?: string;
// }

// export async function POST(request: NextRequest) {
//   try {
//     let body: CreateViolationRequestBody;
//     try {
//       body = await request.json();
//     } catch (error) {
//       console.error("Error parsing request body:", error);
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid request body format",
//         },
//         { status: 400 }
//       );
//     }

//     console.log("Request body parsed:", body);

//     await connectDB();
//     console.log("Database connected successfully");

//     const {
//       licenceNumber,
//       policeNumber,
//       phoneNumber,
//       vehicleNumber,
//       placeOfViolation,
//       ruleId,
//       notes,
//     } = body;

//     if (
//       !licenceNumber ||
//       !policeNumber ||
//       !phoneNumber ||
//       !vehicleNumber ||
//       !placeOfViolation ||
//       !ruleId
//     ) {
//       console.log("Missing required fields");
//       return NextResponse.json(
//         {
//           success: false,
//           message: "All required fields must be provided",
//         },
//         { status: 400 }
//       );
//     }

//     // Find licence holder
//     console.log("Finding licence holder:", licenceNumber);
//     const licenceHolder = await licence.findOne({ licenceNumber });
//     if (!licenceHolder) {
//       console.log("Licence holder not found:", licenceNumber);
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Licence holder not found",
//         },
//         { status: 404 }
//       );
//     }

//     console.log("Finding police officer:", policeNumber);
//     const policeOfficer = await PoliceOfficer.findOne({ policeNumber });
//     if (!policeOfficer) {
//       console.log("Police officer not found:", policeNumber);
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Police officer not found",
//         },
//         { status: 404 }
//       );
//     }

//     console.log("Finding rule:", ruleId);
//     const rule = await Rule.findById(ruleId);
//     if (!rule) {
//       console.log("Rule not found:", ruleId);
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Rule not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Create violation record
//     console.log("Creating violation record...");
//     const violationRecord = new ViolationRecord({
//       licenceNumber,
//       licenceHolderId: licenceHolder._id,
//       policeNumber,
//       policeOfficerId: policeOfficer._id,
//       phoneNumber,
//       vehicleNumber: vehicleNumber.toUpperCase(),
//       placeOfViolation,
//       ruleId,
//       ruleSection: rule.section,
//       ruleProvision: rule.provision,
//       fine: rule.fine.toString(),
//       points: rule.points,
//       notes,
//       violationDate: new Date().toISOString(),
//       status: "active",
//     });

//     await violationRecord.save();
//     console.log("Violation record saved:", violationRecord._id);

//     console.log("Updating licence holder points...");
//     licenceHolder.licencePoints -= rule.points;
//     await licenceHolder.save();

//     console.log("Updating police officer points...");
//     policeOfficer.policePoints += rule.points;
//     await policeOfficer.save();

//     console.log("Violation created successfully");
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Violation recorded successfully",
//         data: violationRecord,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Error creating violation:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function OPTIONS(request: NextRequest) {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type",
//     },
//   });
// }

import { NextRequest, NextResponse } from "next/server";
import ViolationRecord from "@/models/ViolationRecord";
import licence from "@/models/licenceHolder";
import PoliceOfficer from "@/models/policeOfficer";
import Rule from "@/models/rule";
import connectDB from "@/lib/mongo/mongodb";
import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";

const vonage = new Vonage(
  new Auth({
    apiKey: process.env.VONAGE_API_KEY as string,
    apiSecret: process.env.VONAGE_API_SECRET as string,
  })
);

const verificationCodes = new Map();

interface CreateViolationRequestBody {
  licenceNumber: string;
  policeNumber: string;
  phoneNumber: string;
  vehicleNumber: string;
  placeOfViolation: string;
  ruleId: string;
  notes?: string;
  verificationCode?: string;
  isVerificationStep?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  requiresVerification?: boolean;
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function formatPhoneNumber(phoneNumber: string): string {
  let cleaned = phoneNumber.replace(/\s/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "94" + cleaned.substring(1);
  } else if (!cleaned.startsWith("94")) {
    cleaned = "94" + cleaned;
  }

  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    let body: CreateViolationRequestBody;
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

    await connectDB();
    console.log("Database connected successfully");

    const {
      licenceNumber,
      policeNumber,
      phoneNumber,
      vehicleNumber,
      placeOfViolation,
      ruleId,
      notes,
      verificationCode,
      isVerificationStep,
    } = body;

    // Basic validation
    if (
      !licenceNumber ||
      !policeNumber ||
      !phoneNumber ||
      !vehicleNumber ||
      !placeOfViolation ||
      !ruleId
    ) {
      console.log("Missing required fields");
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided",
        },
        { status: 400 }
      );
    }

    if (!isVerificationStep) {
      console.log("Finding licence holder:", licenceNumber);
      const licenceHolder = await licence.findOne({ licenceNumber });
      if (!licenceHolder) {
        console.log("Licence holder not found:", licenceNumber);
        return NextResponse.json(
          {
            success: false,
            message: "Licence holder not found",
          },
          { status: 404 }
        );
      }

      const code = generateVerificationCode();
      const codeKey = `${licenceNumber}_${phoneNumber}`;
      verificationCodes.set(codeKey, {
        code,
        timestamp: Date.now(),
        licenceNumber,
        phoneNumber,
      });

      try {
        const formattedPhone = formatPhoneNumber(phoneNumber);

        await vonage.sms.send({
          to: formattedPhone,
          from: "eCop",
          text: `Your verification code for traffic violation is: ${code}. Valid for 5 minutes.`,
        });

        console.log(`SMS sent successfully to ${formattedPhone}`);

        return NextResponse.json(
          {
            success: true,
            message: "Verification code sent to phone number",
            requiresVerification: true,
          },
          { status: 200 }
        );
      } catch (smsError) {
        console.error("SMS sending failed:", smsError);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to send verification code",
          },
          { status: 500 }
        );
      }
    }

    if (isVerificationStep) {
      if (!verificationCode) {
        return NextResponse.json(
          {
            success: false,
            message: "Verification code is required",
          },
          { status: 400 }
        );
      }

      const codeKey = `${licenceNumber}_${phoneNumber}`;
      const storedData = verificationCodes.get(codeKey);

      if (!storedData) {
        return NextResponse.json(
          {
            success: false,
            message: "Verification code expired or invalid",
          },
          { status: 400 }
        );
      }

      if (storedData.code !== verificationCode) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid verification code",
          },
          { status: 400 }
        );
      }

      const isExpired = Date.now() - storedData.timestamp > 5 * 60 * 1000;
      if (isExpired) {
        verificationCodes.delete(codeKey);
        return NextResponse.json(
          {
            success: false,
            message: "Verification code expired",
          },
          { status: 400 }
        );
      }

      verificationCodes.delete(codeKey);

      console.log("Finding licence holder:", licenceNumber);
      const licenceHolder = await licence.findOne({ licenceNumber });
      if (!licenceHolder) {
        console.log("Licence holder not found:", licenceNumber);
        return NextResponse.json(
          {
            success: false,
            message: "Licence holder not found",
          },
          { status: 404 }
        );
      }

      console.log("Finding police officer:", policeNumber);
      const policeOfficer = await PoliceOfficer.findOne({ policeNumber });
      if (!policeOfficer) {
        console.log("Police officer not found:", policeNumber);
        return NextResponse.json(
          {
            success: false,
            message: "Police officer not found",
          },
          { status: 404 }
        );
      }

      console.log("Finding rule:", ruleId);
      const rule = await Rule.findById(ruleId);
      if (!rule) {
        console.log("Rule not found:", ruleId);
        return NextResponse.json(
          {
            success: false,
            message: "Rule not found",
          },
          { status: 404 }
        );
      }

      // Create violation record
      console.log("Creating violation record...");
      const violationRecord = new ViolationRecord({
        licenceNumber,
        licenceHolderId: licenceHolder._id,
        policeNumber,
        policeOfficerId: policeOfficer._id,
        phoneNumber,
        vehicleNumber: vehicleNumber.toUpperCase(),
        placeOfViolation,
        ruleId,
        ruleSection: rule.section,
        ruleProvision: rule.provision,
        fine: rule.fine.toString(),
        points: rule.points,
        notes,
        violationDate: new Date().toISOString(),
        status: "active",
      });

      await violationRecord.save();
      console.log("Violation record saved:", violationRecord._id);

      console.log("Updating licence holder points...");
      licenceHolder.licencePoints -= rule.points;
      await licenceHolder.save();

      console.log("Updating police officer points...");
      policeOfficer.policePoints += rule.points;
      await policeOfficer.save();

      console.log("Violation created successfully");
      return NextResponse.json(
        {
          success: true,
          message: "Violation recorded successfully",
          data: violationRecord,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error creating violation:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
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
