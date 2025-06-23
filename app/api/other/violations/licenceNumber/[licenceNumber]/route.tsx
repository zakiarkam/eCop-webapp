import ViolationRecord from "@/models/ViolationRecord";
import connectDB from "@/lib/mongo/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface ViolationRecordType {
  _id: string;
  licenceNumber: string;
  violationDate: Date;
  licenceHolderId: {
    fullName: string;
    nameWithInitials: string;
  };
  policeOfficerId: {
    fullName: string;
    nameWithInitials: string;
    rank: string;
    policeNumber: string;
  };
  ruleId: {
    section: string;
    provision: string;
    fine: number;
    points: number;
  };
}

interface SuccessResponse {
  success: true;
  data: ViolationRecordType[];
  total: number;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();

    // Get search params from the URL
    const { searchParams } = new URL(request.url);
    const licenceNumber = searchParams.get("licenceNumber");

    if (!licenceNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Licence number is required",
        },
        { status: 400 }
      );
    }

    const violations = await ViolationRecord.find({ licenceNumber })
      .populate("licenceHolderId", "fullName nameWithInitials")
      .populate(
        "policeOfficerId",
        "fullName nameWithInitials rank policeNumber"
      )
      .populate("ruleId", "section provision fine points")
      .sort({ violationDate: -1 });

    return NextResponse.json(
      {
        success: true,
        data: violations,
        total: violations.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching violations by licence number:", error);
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
