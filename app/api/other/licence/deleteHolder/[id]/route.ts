import { NextResponse } from "next/server";
import Licence from "@/models/licenceHolder";
import connectToDatabase from "@/lib/mongo/mongodb";
import type { NextRequest } from "next/server";

interface DeleteResponse {
  success: boolean;
  message: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Licence ID is required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find and delete the licence
    const deletedLicence = await Licence.findByIdAndDelete(id);

    if (!deletedLicence) {
      return NextResponse.json(
        {
          success: false,
          message: "Licence not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Licence deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting licence:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid licence ID format",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
