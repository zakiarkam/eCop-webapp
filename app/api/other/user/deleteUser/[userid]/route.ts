import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";

export async function DELETE(
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

    const deletedUser = await User.findByIdAndDelete(userid);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        data: {
          id: deletedUser._id,
          rmbname: deletedUser.rmbname,
          email: deletedUser.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting user:", error.message, error.stack);

    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
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
