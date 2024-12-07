import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";
import { error } from "console";

export async function POST(request: Request) {
  const { fname, lname, email, Mnumber, password, cpassword } =
    await request.json();

  const isValidEmail = (email: string) => {
    const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

    return emailRegex.test(email);
  };

  if (!fname || !email || !lname || !password || !cpassword || !lname) {
    return NextResponse.json(
      { message: "All fieds are required" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Invalid Email Format" },
      { status: 400 }
    );
  }
  if (cpassword !== password) {
    return NextResponse.json(
      { message: "Password doesn't match" },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be atleast 6 Characters" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ Mnumber });
    if (existingUser) {
      return NextResponse.json(
        { message: " User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      email,
      Mnumber,
      password: hashedPassword,
    });
    await newUser.save();
    return NextResponse.json(
      { message: "User Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}
