import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Licence from "@/models/licenceHolder";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

interface LicenceRequestBody {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: string | number;
  issueDate: string;
  expiryDate: string;
  idNumber: string;
  licenceNumber: string;
  permanentAddress: string;
  currentAddress: string;
  bloodGroup: string;
  vehicleCategories: string[];
  issueDatePerCategory: Record<string, string>;
  expiryDatePerCategory: Record<string, string>;
}

interface LicenceResponse {
  message: string;
  licence?: {
    id: string;
    fullName: string;
    licenceNumber: string;
    idNumber: string;
  };
  errors?: string[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LicenceResponse>> {
  try {
    const session = await getServerSession();

    await connectToDatabase();

    const body: LicenceRequestBody = await request.json();

    const {
      fullName,
      nameWithInitials,
      dob,
      age,
      issueDate,
      expiryDate,
      idNumber,
      licenceNumber,
      permanentAddress,
      currentAddress,
      bloodGroup,
      vehicleCategories,
      issueDatePerCategory,
      expiryDatePerCategory,
    } = body;

    if (
      !fullName ||
      !nameWithInitials ||
      !dob ||
      !age ||
      !issueDate ||
      !expiryDate ||
      !idNumber ||
      !licenceNumber ||
      !permanentAddress ||
      !currentAddress ||
      !bloodGroup ||
      !vehicleCategories ||
      vehicleCategories.length === 0
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

    const existingLicence = await Licence.findOne({
      $or: [{ idNumber }, { licenceNumber }],
    });

    if (existingLicence) {
      return NextResponse.json(
        {
          message:
            existingLicence.idNumber === idNumber
              ? "A licence with this ID number already exists"
              : "A licence with this licence number already exists",
        },
        { status: 409 }
      );
    }

    const transformedVehicleCategories = vehicleCategories.map(
      (category: string) => ({
        category,
        issueDate: new Date(issueDatePerCategory[category]),
        expiryDate: new Date(expiryDatePerCategory[category]),
      })
    );

    // Validate that all categories have dates
    for (const category of vehicleCategories) {
      if (!issueDatePerCategory[category] || !expiryDatePerCategory[category]) {
        return NextResponse.json(
          { message: `Missing dates for vehicle category: ${category}` },
          { status: 400 }
        );
      }
    }

    const newLicence = new Licence({
      fullName,
      nameWithInitials,
      dob: new Date(dob),
      age: parseInt(age as string, 10),
      issueDate: new Date(issueDate),
      expiryDate: new Date(expiryDate),
      idNumber,
      licenceNumber,
      permanentAddress,
      currentAddress,
      bloodGroup,
      vehicleCategories: transformedVehicleCategories,
      createdBy: session?.user?.id || null,
    });

    const savedLicence = await newLicence.save();

    return NextResponse.json(
      {
        message: "Licence created successfully",
        licence: {
          id: savedLicence._id,
          fullName: savedLicence.fullName,
          licenceNumber: savedLicence.licenceNumber,
          idNumber: savedLicence.idNumber,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating licence:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `A licence with this ${field} already exists` },
        { status: 409 }
      );
    }

    // Handle validation errors
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
