import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Rule from "@/models/rule";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

interface RuleRequestBody {
  section: string;
  provision: string;
  fine: string;
  points: number;
}

interface RuleResponse {
  message: string;
  rule?: {
    id: string;
    section: string;
    provision: string;
    fine: string;
    points: number;
  };
  errors?: string[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<RuleResponse>> {
  try {
    const session = await getServerSession();

    await connectToDatabase();

    const body: RuleRequestBody = await request.json();

    const { section, provision, fine, points } = body;

    if (!section || !provision || !fine || points === undefined) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (points < 0 || points > 10) {
      return NextResponse.json(
        { message: "Points must be between 0 and 10" },
        { status: 400 }
      );
    }

    // Check if rule with same section already exists
    const existingRule = await Rule.findOne({ section });

    if (existingRule) {
      return NextResponse.json(
        { message: "A rule with this section already exists" },
        { status: 409 }
      );
    }

    const newRule = new Rule({
      section,
      provision,
      fine,
      points,
      createdBy: session?.user?.id || null,
    });

    const savedRule = await newRule.save();

    return NextResponse.json(
      {
        message: "Rule created successfully",
        rule: {
          id: savedRule._id,
          section: savedRule.section,
          provision: savedRule.provision,
          fine: savedRule.fine,
          points: savedRule.points,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating rule:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A rule with this section already exists" },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { message: "Validation error", errors: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
