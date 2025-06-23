import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Licence from "@/models/licenceHolder";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

interface LicenceDetailResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    fullName: string;
    nameWithInitials: string;
    dob: string;
    age: number;
    issueDate: string;
    expiryDate: string;
    idNumber: string;
    licenceNumber: string;
    phoneNumber: string;
    licencePoints: number;
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
  { params }: { params: Promise<{ licenceNumber: string }> }
): Promise<NextResponse<LicenceDetailResponse>> {
  try {
    const session = await getServerSession();

    // Optional: Add authentication check if needed
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    await connectToDatabase();

    // Await the params before accessing properties
    const { licenceNumber } = await params;

    console.log("Searching for licence number:", licenceNumber);

    if (!licenceNumber) {
      return NextResponse.json(
        { success: false, message: "Licence number is required" },
        { status: 400 }
      );
    }

    // Try both exact match and case-insensitive search
    const licence = await Licence.findOne({
      licenceNumber: { $regex: new RegExp(`^${licenceNumber}$`, "i") },
    });

    console.log("Found licence:", licence ? "Yes" : "No");

    if (!licence) {
      return NextResponse.json(
        {
          success: false,
          message: "Licence holder not found with this number",
        },
        { status: 404 }
      );
    }

    // Transform vehicle categories for response
    const transformedCategories = licence.vehicleCategories.map((cat: any) => ({
      category: cat.category,
      issueDate: cat.issueDate.toISOString().split("T")[0],
      expiryDate: cat.expiryDate.toISOString().split("T")[0],
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Licence holder found successfully",
        data: {
          id: licence._id.toString(),
          fullName: licence.fullName,
          nameWithInitials: licence.nameWithInitials,
          dob: licence.dob.toISOString().split("T")[0],
          age: licence.age,
          issueDate: licence.issueDate.toISOString().split("T")[0],
          expiryDate: licence.expiryDate.toISOString().split("T")[0],
          idNumber: licence.idNumber,
          licenceNumber: licence.licenceNumber,
          phoneNumber: licence.phoneNumber,
          licencePoints: licence.licencePoints,
          permanentAddress: licence.permanentAddress,
          currentAddress: licence.currentAddress,
          bloodGroup: licence.bloodGroup,
          vehicleCategories: transformedCategories,
          role: licence.role,
          createdAt: licence.createdAt?.toISOString() || "",
          updatedAt: licence.updatedAt?.toISOString() || "",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error retrieving licence:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
