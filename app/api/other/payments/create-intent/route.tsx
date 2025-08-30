import { NextRequest, NextResponse } from "next/server";
import PaymentRecord from "@/models/payment";
import ViolationRecord from "@/models/ViolationRecord";
import connectDB from "@/lib/mongo/mongodb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreatePaymentIntentBody {
  violationId: string;
  amount: number;
  currency: string;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
    console.log(
      "STRIPE_SECRET_KEY prefix:",
      process.env.STRIPE_SECRET_KEY?.substring(0, 10)
    );

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        {
          success: false,
          message: "Payment service configuration error",
        },
        { status: 500 }
      );
    }

    let body: CreatePaymentIntentBody;
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

    const { violationId, amount, currency, description } = body;

    if (!violationId || !amount || !currency) {
      return NextResponse.json(
        {
          success: false,
          message: "violationId, amount, and currency are required",
        },
        { status: 400 }
      );
    }

    const violation = await ViolationRecord.findById(violationId);
    if (!violation) {
      return NextResponse.json(
        {
          success: false,
          message: "Violation record not found",
        },
        { status: 404 }
      );
    }

    if (violation.status === "paid") {
      return NextResponse.json(
        {
          success: false,
          message: "Violation already paid",
        },
        { status: 400 }
      );
    }

    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: currency.toLowerCase(),
        description: description || `Payment for violation ${violationId}`,
        metadata: {
          violationId: violationId,
        },
      });
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create payment intent",
          errors: [stripeError.message],
        },
        { status: 400 }
      );
    }

    const paymentRecord = new PaymentRecord({
      violationId,
      amount: amount / 100,
      currency: currency.toUpperCase(),
      status: "pending",
      paymentMethod: "card",
      stripePaymentIntentId: paymentIntent.id,
    });

    await paymentRecord.save();

    return NextResponse.json(
      {
        success: true,
        message: "Payment intent created successfully",
        data: paymentRecord,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
