import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";

export async function POST(request: Request) {
  try {
    const { userId, approved } = await request.json();

    if (!userId || typeof approved !== "boolean") {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (approved) {
      await User.findByIdAndUpdate(userId, {
        isApproved: true,
        approvedAt: new Date(),
      });
    } else {
      // Reject/Delete the user
      await User.findByIdAndDelete(userId);
    }

    return NextResponse.json({
      message: approved
        ? "User approved successfully"
        : "User rejected successfully",
    });
  } catch (error) {
    console.error("Error processing user approval:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
