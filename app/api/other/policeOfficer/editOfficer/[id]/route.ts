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
  success: boolean;
  message: string;
  data?: any;
  officer?: {
    id: string;
    fullName: string;
    policeNumber: string;
    idNumber: string;
  };
  errors?: string[];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PoliceOfficerResponse>> {
  try {
    const session = await getServerSession();

    await connectToDatabase();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Officer ID is required",
        },
        { status: 400 }
      );
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid officer ID format",
        },
        { status: 400 }
      );
    }

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
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    if (idNumber.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "ID number must be at least 10 characters",
        },
        { status: 400 }
      );
    }

    // Validate phone number (basic validation)
    if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ""))) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number must be 10 digits",
        },
        { status: 400 }
      );
    }

    const numericAge = parseInt(age as string, 10);
    if (numericAge < 18 || numericAge > 65) {
      return NextResponse.json(
        {
          success: false,
          message: "Age must be between 18 and 65",
        },
        { status: 400 }
      );
    }

    const existingOfficer = await PoliceOfficer.findById(id);
    if (!existingOfficer) {
      return NextResponse.json(
        {
          success: false,
          message: "Officer not found",
        },
        { status: 404 }
      );
    }

    const duplicateOfficer = await PoliceOfficer.findOne({
      _id: { $ne: id },
      $or: [{ idNumber }, { policeNumber }],
    });

    if (duplicateOfficer) {
      let message = "A police officer with this ";
      if (duplicateOfficer.idNumber === idNumber) {
        message += "ID number already exists";
      } else if (duplicateOfficer.policeNumber === policeNumber) {
        message += "police number already exists";
      }

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 409 }
      );
    }

    const updatedOfficer = await PoliceOfficer.findByIdAndUpdate(
      id,
      {
        fullName,
        nameWithInitials,
        dob: new Date(dob),
        age: numericAge,
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
        updatedBy: session?.user?.id || null,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedOfficer) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update police officer",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Police officer updated successfully",
        data: updatedOfficer,
        officer: {
          id: updatedOfficer._id.toString(),
          fullName: updatedOfficer.fullName,
          policeNumber: updatedOfficer.policeNumber,
          idNumber: updatedOfficer.idNumber,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating police officer:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const fieldName =
        field === "policeNumber"
          ? "police number"
          : field === "idNumber"
          ? "ID number"
          : field;
      return NextResponse.json(
        {
          success: false,
          message: `A police officer with this ${fieldName} already exists`,
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid officer ID",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
