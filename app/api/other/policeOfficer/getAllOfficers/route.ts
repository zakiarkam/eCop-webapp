import { NextResponse } from "next/server";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";

interface ApiResponse {
  success: boolean;
  data?: any[];
  message?: string;
  total?: number;
}

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    await connectToDatabase();

    // Get all police officers
    const officers = await PoliceOfficer.find({})
      .sort({ createdAt: -1 })
      .lean();

    const transformedOfficers = officers.map((officer) => ({
      _id: (officer._id as { toString: () => string }).toString(),
      fullName: officer.fullName,
      nameWithInitials: officer.nameWithInitials,
      dob: officer.dob,
      age: officer.age,
      policeNumber: officer.policeNumber,
      idNumber: officer.idNumber,
      permanentAddress: officer.permanentAddress,
      district: officer.district,
      province: officer.province,
      policeStation: officer.policeStation,
      badgeNo: officer.badgeNo,
      phoneNumber: officer.phoneNumber,
      rank: officer.rank,
      policePoints: officer.policePoints,
      joiningDate: officer.joiningDate,
      bloodGroup: officer.bloodGroup,
      createdAt: officer.createdAt,
      updatedAt: officer.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedOfficers,
        total: transformedOfficers.length,
        message: "Police officers retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching police officers:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch police officers",
      },
      { status: 500 }
    );
  }
}
