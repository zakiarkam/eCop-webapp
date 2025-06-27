import { NextResponse } from "next/server";
import PaymentRecord from "@/models/payment";
import connectDB from "@/lib/mongo/mongodb";

export async function GET(request: Request, context: any) {
  try {
    await connectDB();

    const { paymentId } = await context.params;

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment ID is required",
        },
        { status: 400 }
      );
    }

    const paymentRecord = await PaymentRecord.findById(paymentId).populate(
      "violationId",
      "licenceNumber vehicleNumber fine ruleSection"
    );

    if (!paymentRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment record not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment record retrieved successfully",
        data: paymentRecord,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching payment record:", error);
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
