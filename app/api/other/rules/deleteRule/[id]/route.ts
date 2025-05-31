import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Rule from "@/models/rule";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const { id } = params;

    const deletedRule = await Rule.findByIdAndDelete(id);

    if (!deletedRule) {
      return NextResponse.json({ message: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Rule deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting rule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
