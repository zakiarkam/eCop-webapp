import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";

await connectToDatabase();

export async function POST(request: Request) {
  try {
    const {
      rmbname,
      rmbdistrict,
      rmbprovince,
      email,
      mobilenumber,
      password,
      idnumber,
    } = await request.json();

    // if (!rmbname || !rmbdistrict || !email || !password || !mobilenumber) {
    //   return NextResponse.json(
    //     { message: "All fields are required" },
    //     { status: 400 }
    //   );
    // }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   return NextResponse.json(
    //     { message: "Invalid Email Format" },
    //     { status: 400 }
    //   );
    // }

    // if (password.length < 8) {
    //   return NextResponse.json(
    //     { message: "Password must be at least 8 characters" },
    //     { status: 400 }
    //   );
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      rmbname,
      rmbdistrict,
      rmbprovince,
      email,
      mobilenumber,
      idnumber,
      password: hashedPassword,
      role: "rmvAdmin",
      isApproved: false,
    });

    await newUser.save();
    return NextResponse.json(
      {
        message:
          "User created successfully, Your account requires approval before you can login.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error during user signup:", error.message, error.stack);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Duplicate entry: Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
