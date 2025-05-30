import { NextResponse } from "next/server";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Officer ID is required" },
        { status: 400 }
      );
    }

    const officer = await PoliceOfficer.findById(id);

    if (!officer) {
      return NextResponse.json(
        { success: false, message: "Police officer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: officer,
        message: "Police officer retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching police officer:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid officer ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
