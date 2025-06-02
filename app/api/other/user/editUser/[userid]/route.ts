import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";

// PUT method for updating user
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userid: string }> }
) {
  try {
    await connectToDatabase();

    const { userid } = await params;

    if (!userid) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      rmbname,
      rmbdistrict,
      email,
      mobilenumber,
      idnumber,
      role,
      isApproved,
    } = body;

    if (!rmbname || !email || !rmbdistrict) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Check if email already exists for other users
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userid },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      {
        rmbname,
        rmbdistrict,
        email,
        mobilenumber,
        idnumber,
        role,
        isApproved,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: {
          id: updatedUser._id,
          rmbname: updatedUser.rmbname,
          rmbdistrict: updatedUser.rmbdistrict,
          rmbprovince: updatedUser.rmbprovince,
          email: updatedUser.email,
          mobilenumber: updatedUser.mobilenumber,
          idnumber: updatedUser.idnumber,
          role: updatedUser.role,
          isApproved: updatedUser.isApproved,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user:", error.message, error.stack);

    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
