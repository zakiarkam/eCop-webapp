// app/api/users/[userid]/route.js
import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";

await connectToDatabase();

export async function GET(
  request: Request,
  { params }: { params: { userid: string } }
) {
  try {
    const { userid } = params;

    if (!userid) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userid).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          rmbname: user.rmbname,
          rmbdistrict: user.rmbdistrict,
          rmbprovince: user.rmbprovince,
          email: user.email,
          mobilenumber: user.mobilenumber,
          idnumber: user.idnumber,
          role: user.role,
          isApproved: user.isApproved,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user details:", error.message, error.stack);

    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
