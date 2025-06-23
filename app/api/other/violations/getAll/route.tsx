import { NextRequest, NextResponse } from "next/server";
import ViolationRecord from "@/models/ViolationRecord";
import licence from "@/models/licenceHolder";
import PoliceOfficer from "@/models/policeOfficer";
import Rule from "@/models/rule";
import connectDB from "@/lib/mongo/mongodb";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    console.log("Database connected successfully");

    // Get all violations without any filtering - let frontend handle filtering
    const violations = await ViolationRecord.find({})
      .populate({
        path: "licenceHolderId",
        model: licence,
        select: "firstName lastName mobileNumber",
      })
      .populate({
        path: "policeOfficerId",
        model: PoliceOfficer,
        select: "firstName lastName policeStation",
      })
      .populate({
        path: "ruleId",
        model: Rule,
        select: "section provision fine points",
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    console.log(`Found ${violations.length} violation records`);

    // Transform data to match frontend expectations
    const transformedViolations = violations.map((violation: any) => ({
      _id: violation._id,
      username: violation.licenceHolderId
        ? `${violation.licenceHolderId.firstName} ${violation.licenceHolderId.lastName}`
        : "N/A",
      licenceNumber: violation.licenceNumber,
      vehicleNumber: violation.vehicleNumber,
      mobileNumber:
        violation.licenceHolderId?.mobileNumber || violation.phoneNumber,
      sectionOfAct: violation.ruleSection,
      provision: violation.ruleProvision,
      fineAmount: parseInt(violation.fine) || 0,
      policeNumber: violation.policeNumber,
      policeStation: violation.policeOfficerId?.policeStation || "N/A",
      violationArea: violation.placeOfViolation,
      violationDate: violation.violationDate,
      status: violation.status === "active" ? "Pending" : "Cancelled",
      points: violation.points,
      notes: violation.notes,
      createdAt: violation.createdAt,
      updatedAt: violation.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Violations retrieved successfully",
        data: transformedViolations,
        total: transformedViolations.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching violations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
