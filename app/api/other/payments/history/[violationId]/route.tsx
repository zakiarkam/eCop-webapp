import { NextRequest, NextResponse } from "next/server";
import PaymentRecord from "@/models/payment";
import connectDB from "@/lib/mongo/mongodb";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ violationId: string }> }
) {
  try {
    await connectDB();

    const { violationId } = await context.params;

    if (!violationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Violation ID is required",
        },
        { status: 400 }
      );
    }

    const paymentHistory = await PaymentRecord.find({ violationId })
      .sort({ createdAt: -1 })
      .populate("violationId", "licenceNumber vehicleNumber fine");

    return NextResponse.json(
      {
        success: true,
        message: "Payment history retrieved successfully",
        data: paymentHistory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: [error.message],
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
