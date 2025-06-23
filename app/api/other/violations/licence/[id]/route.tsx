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

type ResponseData = SuccessResponse | ErrorResponse;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ResponseData>> {
  try {
    await connectDB();

    const { id } = await params;

    const violations = await ViolationRecord.find({ licenceHolderId: id })
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
    console.error("Error fetching licence holder violations:", error);
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
