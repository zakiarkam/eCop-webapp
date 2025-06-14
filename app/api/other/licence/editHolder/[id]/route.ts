import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import License from "@/models/licenceHolder";
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
  license?: {
    id: string;
    fullName: string;
    licenceNumber: string;
    idNumber: string;
  };
  errors?: string[];
}

// GET single licence by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Licence ID is required" },
        { status: 400 }
      );
    }

    const license = await License.findById(id);

    if (!license) {
      return NextResponse.json(
        { message: "Licence not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: license,
        message: "Licence retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching licence:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<LicenceResponse>> {
  try {
    const session = await getServerSession();

    await connectToDatabase();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Licence ID is required" },
        { status: 400 }
      );
    }

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

    // Check if licence exists
    const existingLicense = await License.findById(id);
    if (!existingLicense) {
      return NextResponse.json(
        { message: "Licence not found" },
        { status: 404 }
      );
    }

    // Check for duplicate ID number or licence number (excluding current record)
    const duplicateLicense = await License.findOne({
      _id: { $ne: id },
      $or: [{ idNumber }, { licenceNumber }],
    });

    if (duplicateLicense) {
      return NextResponse.json(
        {
          message:
            duplicateLicense.idNumber === idNumber
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

    for (const category of vehicleCategories) {
      if (!issueDatePerCategory[category] || !expiryDatePerCategory[category]) {
        return NextResponse.json(
          { message: `Missing dates for vehicle category: ${category}` },
          { status: 400 }
        );
      }
    }

    const updatedLicense = await License.findByIdAndUpdate(
      id,
      {
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
        updatedBy: session?.user?.id || null,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: "Licence updated successfully",
        license: {
          id: updatedLicense._id,
          fullName: updatedLicense.fullName,
          licenceNumber: updatedLicense.licenceNumber,
          idNumber: updatedLicense.idNumber,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating licence:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `A licence with this ${field} already exists` },
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
