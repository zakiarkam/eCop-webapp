import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    return NextResponse.json({
      exists: !!user,
      user: user
        ? {
            id: user._id,
            email: user.email,
            name: user.name,
            isApproved: user.isApproved,
            needsApproval: user.needsApproval,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking user status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
