import { NextResponse } from "next/server";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

interface PoliceOfficerDetailResponse {
  message: string;
  officer?: {
    id: string;
    fullName: string;
    nameWithInitials: string;
    dob: string;
    age: number;
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
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ policeNumber: string }> }
): Promise<NextResponse<PoliceOfficerDetailResponse>> {
  try {
    // Optional: Add authentication check if needed
    // if (!session) {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    await connectToDatabase();

    const { policeNumber } = await params;

    if (!policeNumber) {
      return NextResponse.json(
        { message: "Police number is required" },
        { status: 400 }
      );
    }

    const officer = await PoliceOfficer.findOne({ policeNumber });

    if (!officer) {
      return NextResponse.json(
        { message: "Police officer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Police officer found successfully",
        officer: {
          id: officer._id.toString(),
          fullName: officer.fullName,
          nameWithInitials: officer.nameWithInitials,
          dob: officer.dob.toISOString().split("T")[0],
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
          joiningDate: officer.joiningDate.toISOString().split("T")[0],
          bloodGroup: officer.bloodGroup,
          role: officer.role,
          createdAt: officer.createdAt?.toISOString() || "",
          updatedAt: officer.updatedAt?.toISOString() || "",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error retrieving police officer:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
