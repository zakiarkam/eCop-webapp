import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "";
    const isApproved = searchParams.get("isApproved");

    const query: any = {};

    if (role) {
      query.role = role;
    }

    if (isApproved !== null && isApproved !== "") {
      query.isApproved = isApproved === "true";
    }

    const users = await User.find(query)
      .select("-password") // Exclude password field
      .sort({ approvedAt: -1 }); // Sort by newest first

    return NextResponse.json(
      {
        success: true,
        data: users.map((user) => ({
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
          approvedAt: user.approvedAt,
        })),
        total: users.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching users:", error.message, error.stack);

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
