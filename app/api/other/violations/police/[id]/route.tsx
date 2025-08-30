import { NextRequest, NextResponse } from "next/server";
import ViolationRecord from "@/models/ViolationRecord";
import connectDB from "@/lib/mongo/mongodb";

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

interface SuccessResponse {
  success: true;
  data: any[];
  total: number;
}

type HandlerResponse = SuccessResponse | ErrorResponse;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<HandlerResponse>> {
  try {
    await connectDB();

    const { id } = await params;

    const violations = await ViolationRecord.find({ policeOfficerId: id })
      .populate("licenceHolderId", "fullName nameWithInitials licenceNumber")
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
    console.error("Error fetching police officer violations:", error);
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
