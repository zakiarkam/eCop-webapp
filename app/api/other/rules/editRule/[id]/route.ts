import { NextResponse } from "next/server";
import Rule from "@/models/rule";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

type RuleRequestBody = {
  section: string;
  provision: string;
  fine: number;
  points: number;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const { id } = await params;
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

    // Check if another rule with same section exists (excluding current rule)
    const existingRule = await Rule.findOne({
      section,
      _id: { $ne: id },
    });

    if (existingRule) {
      return NextResponse.json(
        { message: "A rule with this section already exists" },
        { status: 409 }
      );
    }

    const updatedRule = await Rule.findByIdAndUpdate(
      id,
      { section, provision, fine, points },
      { new: true, runValidators: true }
    );

    if (!updatedRule) {
      return NextResponse.json({ message: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Rule updated successfully",
        rule: {
          id: updatedRule._id,
          section: updatedRule.section,
          provision: updatedRule.provision,
          fine: updatedRule.fine,
          points: updatedRule.points,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating rule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
