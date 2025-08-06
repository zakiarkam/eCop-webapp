import { NextResponse } from "next/server";
import PaymentRecord from "@/models/payment";
import connectDB from "@/lib/mongo/mongodb";

export async function GET(request: Request, context: any) {
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

    const paymentRecord = await PaymentRecord.findOne({
      violationId: violationId,
      status: "completed",
    }).sort({ paymentDate: -1 });

    if (!paymentRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "No completed payment found for this violation",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment details retrieved successfully",
        data: {
          _id: paymentRecord._id,
          violationId: paymentRecord.violationId,
          amount: paymentRecord.amount,
          currency: paymentRecord.currency,
          status: paymentRecord.status,
          paymentMethod: paymentRecord.paymentMethod,
          stripePaymentIntentId: paymentRecord.stripePaymentIntentId,
          paymentDate: paymentRecord.paymentDate,
          createdAt: paymentRecord.createdAt,
          updatedAt: paymentRecord.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching payment details:", error);
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
