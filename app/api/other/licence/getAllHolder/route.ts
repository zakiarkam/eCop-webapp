import { NextResponse } from "next/server";
import License from "@/models/licenceHolder";
import connectToDatabase from "@/lib/mongo/mongodb";

interface LicenseData {
  _id: string;
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
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface LicenseResponse {
  success: boolean;
  data?: LicenseData[];
  message?: string;
  total?: number;
}

export async function GET(): Promise<NextResponse<LicenseResponse>> {
  try {
    await connectToDatabase();

    const licenses = await License.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    const transformedLicenses: LicenseData[] = licenses.map((license: any) => ({
      _id: license._id.toString(),
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
      vehicleCategories: license.vehicleCategories.map((vc: any) => ({
        category: vc.category,
        issueDate: vc.issueDate.toISOString().split("T")[0],
        expiryDate: vc.expiryDate.toISOString().split("T")[0],
      })),
      createdBy: license.createdBy,
      createdAt: license.createdAt.toISOString(),
      updatedAt: license.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedLicenses,
        total: transformedLicenses.length,
        message: "Licenses fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching licenses:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch licenses",
      },
      { status: 500 }
    );
  }
}
