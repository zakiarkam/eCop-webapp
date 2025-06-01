import { NextResponse } from "next/server";
import Rule from "@/models/rule";
import connectToDatabase from "@/lib/mongo/mongodb";

export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const rules = await Rule.find({ status: "active" })
      .sort({ createdAt: -1 })
      .select("section provision fine points createdAt");

    return NextResponse.json(
      {
        message: "Rules fetched successfully",
        rules: rules,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching rules:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
