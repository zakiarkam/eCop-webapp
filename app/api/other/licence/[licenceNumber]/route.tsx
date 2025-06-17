import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import License from "@/models/licenceHolder";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

interface LicenseDetailResponse {
  message: string;
  license?: {
    id: string;
    fullName: string;
    nameWithInitials: string;
    dob: string;
    age: number;
    issueDate: string;
    expiryDate: string;
    idNumber: string;
    licenceNumber: string;
    permanentAddress: string;
    currentAddress: string;
    bloodGroup: string;
    vehicleCategories: Array<{
      category: string;
      issueDate: string;
      expiryDate: string;
    }>;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { licenceNumber: string } }
): Promise<NextResponse<LicenseDetailResponse>> {
  try {
    const session = await getServerSession();

    // Optional: Add authentication check if needed
    // if (!session) {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    await connectToDatabase();

    const { licenceNumber } = params;

    if (!licenceNumber) {
      return NextResponse.json(
        { message: "Licence number is required" },
        { status: 400 }
      );
    }

    const license = await License.findOne({ licenceNumber });

    if (!license) {
      return NextResponse.json(
        { message: "License not found" },
        { status: 404 }
      );
    }

    // Transform vehicle categories for response
    const transformedCategories = license.vehicleCategories.map((cat: any) => ({
      category: cat.category,
      issueDate: cat.issueDate.toISOString().split("T")[0],
      expiryDate: cat.expiryDate.toISOString().split("T")[0],
    }));

    return NextResponse.json(
      {
        message: "License found successfully",
        license: {
          id: license._id.toString(),
          fullName: license.fullName,
          nameWithInitials: license.nameWithInitials,
          dob: license.dob.toISOString().split("T")[0],
          age: license.age,
          issueDate: license.issueDate.toISOString().split("T")[0],
          expiryDate: license.expiryDate.toISOString().split("T")[0],
          idNumber: license.idNumber,
          licenceNumber: license.licenceNumber,
          permanentAddress: license.permanentAddress,
          currentAddress: license.currentAddress,
          bloodGroup: license.bloodGroup,
          vehicleCategories: transformedCategories,
          role: license.role,
          createdAt: license.createdAt?.toISOString() || "",
          updatedAt: license.updatedAt?.toISOString() || "",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error retrieving license:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
