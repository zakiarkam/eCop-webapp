import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

interface PoliceOfficerRequestBody {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: string | number;
  policeNumber: string;
  idNumber: string;
  permanentAddress: string;
  district: string;
  province: string;
  policeStation: string;
  badgeNo: string;
  phoneNumber: string;
  rank: string;
  joiningDate: string;
  bloodGroup: string;
}

interface PoliceOfficerResponse {
  message: string;
  officer?: {
    id: string;
    fullName: string;
    policeNumber: string;
    badgeNo: string;
    role: string;
  };
  errors?: string[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PoliceOfficerResponse>> {
  try {
    const session = await getServerSession();

    await connectToDatabase();

    const body: PoliceOfficerRequestBody = await request.json();

    const {
      fullName,
      nameWithInitials,
      dob,
      age,
      policeNumber,
      idNumber,
      permanentAddress,
      district,
      province,
      policeStation,
      badgeNo,
      phoneNumber,
      rank,
      joiningDate,
      bloodGroup,
    } = body;

    if (
      !fullName ||
      !nameWithInitials ||
      !dob ||
      !age ||
      !policeNumber ||
      !idNumber ||
      !permanentAddress ||
      !district ||
      !province ||
      !policeStation ||
      !badgeNo ||
      !phoneNumber ||
      !rank ||
      !joiningDate ||
      !bloodGroup
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (idNumber.length < 10) {
      return NextResponse.json(
        { message: "ID number must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Phone number validation (Sri Lankan format)
    const phoneRegex = /^(?:\+94|0)?[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      return NextResponse.json(
        { message: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    const existingOfficer = await PoliceOfficer.findOne({
      $or: [{ idNumber }, { policeNumber }],
    });

    if (existingOfficer) {
      let message = "";
      if (existingOfficer.idNumber === idNumber) {
        message = "A police officer with this ID number already exists";
      } else if (existingOfficer.policeNumber === policeNumber) {
        message = "A police officer with this police number already exists";
      }

      return NextResponse.json({ message }, { status: 409 });
    }

    const newOfficer = new PoliceOfficer({
      fullName,
      nameWithInitials,
      dob: new Date(dob),
      age: parseInt(age as string, 10),
      policeNumber,
      idNumber,
      permanentAddress,
      district,
      province,
      policeStation,
      badgeNo,
      phoneNumber,
      rank,
      joiningDate: new Date(joiningDate),
      bloodGroup,
      role: "police",
      createdBy: session?.user?.id || null,
    });

    const savedOfficer = await newOfficer.save();

    return NextResponse.json(
      {
        message: "Police Officer created successfully",
        officer: {
          id: savedOfficer._id.toString(),
          fullName: savedOfficer.fullName,
          policeNumber: savedOfficer.policeNumber,
          badgeNo: savedOfficer.badgeNo,
          role: savedOfficer.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating police officer:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `A police officer with this ${field} already exists` },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { message: "Validation error", errors: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
