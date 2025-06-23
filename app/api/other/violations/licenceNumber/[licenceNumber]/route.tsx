import ViolationRecord from "@/models/ViolationRecord";
import connectDB from "@/lib/mongo/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface LicenceNumberQuery {
  licenceNumber?: string;
}

interface ViolationRecordType {
  _id: string;
  licenceNumber: string;
  violationDate: Date;
  licenceHolderId: {
    fullName: string;
    nameWithInitials: string;
  };
  policeOfficerId: {
    fullName: string;
    nameWithInitials: string;
    rank: string;
    policeNumber: string;
  };
  ruleId: {
    section: string;
    provision: string;
    fine: number;
    points: number;
  };
}

interface SuccessResponse {
  success: true;
  data: ViolationRecordType[];
  total: number;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest & { query: LicenceNumberQuery },
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { licenceNumber } = req.query;

    const violations = await ViolationRecord.find({ licenceNumber })
      .populate("licenceHolderId", "fullName nameWithInitials")
      .populate(
        "policeOfficerId",
        "fullName nameWithInitials rank policeNumber"
      )
      .populate("ruleId", "section provision fine points")
      .sort({ violationDate: -1 });

    res.status(200).json({
      success: true,
      data: violations,
      total: violations.length,
    });
  } catch (error: any) {
    console.error("Error fetching violations by licence number:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
