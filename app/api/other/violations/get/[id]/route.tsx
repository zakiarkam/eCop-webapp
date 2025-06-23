import ViolationRecord from "@/models/ViolationRecord";
import connectDB from "@/lib/mongo/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

interface SuccessResponse {
  success: true;
  data: any;
}

type ResponseData = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { id } = req.query as { id: string };

    const violation = await ViolationRecord.findById(id)
      .populate("licenceHolderId", "fullName nameWithInitials licenceNumber")
      .populate(
        "policeOfficerId",
        "fullName nameWithInitials rank policeNumber"
      )
      .populate("ruleId", "section provision fine points");

    if (!violation) {
      return res.status(404).json({
        success: false,
        message: "Violation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: violation,
    });
  } catch (error: any) {
    console.error("Error fetching violation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
