import { NextRequest, NextResponse } from "next/server";
import PaymentRecord from "@/models/payment";
import ViolationRecord from "@/models/ViolationRecord";
import connectDB from "@/lib/mongo/mongodb";
import { sendPaymentSuccessEmail } from "@/lib/email/emailUtils";

interface UpdateViolationStatusBody {
  violationId: string;
  status: "paid" | "active";
  paymentDate?: string;
  stripePaymentIntentId?: string;
  paymentStatus?: "paid" | "unpaid" | "partially_paid";
}

export async function POST(request: NextRequest) {
  try {
    let body: UpdateViolationStatusBody;
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

    await connectDB();

    const {
      violationId,
      status,
      paymentDate,
      paymentStatus,
      stripePaymentIntentId,
    } = body;

    if (!violationId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "violationId and status are required",
        },
        { status: 400 }
      );
    }

    const violation = await ViolationRecord.findById(violationId).populate(
      "licenceHolderId",
      "fullName email"
    );
    if (!violation) {
      return NextResponse.json(
        {
          success: false,
          message: "Violation record not found",
        },
        { status: 404 }
      );
    }

    violation.status = status;
    if (status === "paid" && paymentDate) {
      violation.paymentDate = new Date(paymentDate);
    }

    if (paymentStatus) {
      violation.paymentStatus = paymentStatus;
    }
    await violation.save();

    if (stripePaymentIntentId) {
      const paymentRecord = await PaymentRecord.findOne({
        stripePaymentIntentId,
      });

      if (paymentRecord) {
        paymentRecord.status = status === "paid" ? "completed" : "pending";
        if (status === "paid") {
          paymentRecord.paymentDate = paymentDate
            ? new Date(paymentDate)
            : new Date();
        }
        await paymentRecord.save();
      }
    }

    if (status === "paid" && violation.licenceHolderId?.email) {
      try {
        const emailSent = await sendPaymentSuccessEmail(
          violation.licenceHolderId.email,
          violation.licenceHolderId.fullName || "User",
          {
            violationId: violation._id.toString(),
            amount: violation.fine,
            currency: "LKR",
            paymentDate: paymentDate || new Date().toISOString(),
            vehicleNumber: violation.vehicleNumber,
            ruleProvision: violation.ruleProvision,
            placeOfViolation: violation.placeOfViolation,
            violationDate: violation.violationDate,
          }
        );

        if (!emailSent) {
          console.warn(
            "Failed to send payment success email, but payment was processed"
          );
        }
      } catch (emailError) {
        console.error("Error sending payment success email:", emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Violation status updated to ${status}`,
        data: violation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating violation status:", error);
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
