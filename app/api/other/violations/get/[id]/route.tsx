import ViolationRecord from "@/models/ViolationRecord";
import connectDB from "@/lib/mongo/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

interface SuccessResponse {
  success: true;
  data: any;
}

type ResponseData = SuccessResponse | ErrorResponse;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData>> {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID parameter is required",
        },
        { status: 400 }
      );
    }

    const violation = await ViolationRecord.findById(id)
      .populate("licenceHolderId", "fullName nameWithInitials licenceNumber")
      .populate(
        "policeOfficerId",
        "fullName nameWithInitials rank policeNumber"
      )
      .populate("ruleId", "section provision fine points");

    if (!violation) {
      return NextResponse.json(
        {
          success: false,
          message: "Violation not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: violation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching violation:", error);
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
