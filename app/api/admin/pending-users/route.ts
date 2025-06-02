import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    const pendingUsers = await User.find({
      role: "rmvAdmin",
      isApproved: false,
    }).select("_id rmbname email rmbdistrict rmbprovince role createdAt");

    return NextResponse.json({ pendingUsers });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
