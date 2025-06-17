import { NextResponse } from "next/server";
import Licence from "@/models/licenceHolder";
import connectToDatabase from "@/lib/mongo/mongodb";

interface LicenceData {
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

interface LicenceResponse {
  success: boolean;
  data?: LicenceData[];
  message?: string;
  total?: number;
}

export async function GET(): Promise<NextResponse<LicenceResponse>> {
  try {
    await connectToDatabase();

    const licences = await Licence.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    const transformedLicences: LicenceData[] = licences.map((licence: any) => ({
      _id: licence._id.toString(),
      fullName: licence.fullName,
      nameWithInitials: licence.nameWithInitials,
      dob: licence.dob.toISOString().split("T")[0],
      age: licence.age,
      issueDate: licence.issueDate.toISOString().split("T")[0],
      expiryDate: licence.expiryDate.toISOString().split("T")[0],
      idNumber: licence.idNumber,
      licenceNumber: licence.licenceNumber,
      permanentAddress: licence.permanentAddress,
      currentAddress: licence.currentAddress,
      bloodGroup: licence.bloodGroup,
      vehicleCategories: licence.vehicleCategories.map((vc: any) => ({
        category: vc.category,
        issueDate: vc.issueDate.toISOString().split("T")[0],
        expiryDate: vc.expiryDate.toISOString().split("T")[0],
      })),
      createdBy: licence.createdBy,
      createdAt: licence.createdAt.toISOString(),
      updatedAt: licence.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedLicences,
        total: transformedLicences.length,
        message: "Licences fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching licences:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch licences",
      },
      { status: 500 }
    );
  }
}
