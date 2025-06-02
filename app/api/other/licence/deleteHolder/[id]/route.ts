import { NextResponse } from "next/server";
import License from "@/models/licenceHolder";
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
          message: "License ID is required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find and delete the license
    const deletedLicense = await License.findByIdAndDelete(id);

    if (!deletedLicense) {
      return NextResponse.json(
        {
          success: false,
          message: "License not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "License deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting license:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid license ID format",
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
