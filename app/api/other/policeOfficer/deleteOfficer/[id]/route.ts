import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import PoliceOfficer from "@/models/policeOfficer";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

interface ApiResponse {
  success: boolean;
  message: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getServerSession();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Officer ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const officer = await PoliceOfficer.findById(id);

    if (!officer) {
      return NextResponse.json(
        { success: false, message: "Police officer not found" },
        { status: 404 }
      );
    }

    // Delete the officer
    await PoliceOfficer.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: `Police officer ${officer.fullName} deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting police officer:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid officer ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete police officer",
      },
      { status: 500 }
    );
  }
}
