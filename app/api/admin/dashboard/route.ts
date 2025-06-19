import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo/mongodb";
import Licence from "@/models/licenceHolder";
import PoliceOfficer from "@/models/policeOfficer";
import Rule from "@/models/rule";
import User from "@/models/users";

interface StatsResponse {
  success: boolean;
  data?: {
    totalLicences: number;
    totalPoliceOfficers: number;
    totalRules: number;
    totalUsers: number;
    pendingApprovals: number;
    activeRules: number;
    expiringSoonLicences: number;
    recentActivity: {
      newLicencesThisMonth: number;
      newOfficersThisMonth: number;
      newUsersThisMonth: number;
    };
  };
  message?: string;
}

export async function GET(): Promise<NextResponse<StatsResponse>> {
  try {
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    await connectToDatabase();

    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    const [
      totalLicences,
      totalPoliceOfficers,
      totalRules,
      totalUsers,
      pendingApprovals,
      activeRules,
      expiringSoonLicences,
      newLicencesThisMonth,
      newOfficersThisMonth,
      newUsersThisMonth,
    ] = await Promise.all([
      Licence.countDocuments(),
      PoliceOfficer.countDocuments(),
      Rule.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ isApproved: false }),
      Rule.countDocuments({ status: "active" }),
      Licence.countDocuments({
        expiryDate: { $lte: thirtyDaysFromNow, $gte: currentDate },
      }),
      Licence.countDocuments({
        createdAt: { $gte: firstDayOfMonth },
      }),
      PoliceOfficer.countDocuments({
        createdAt: { $gte: firstDayOfMonth },
      }),
      User.countDocuments({
        approvedAt: { $gte: firstDayOfMonth },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalLicences,
          totalPoliceOfficers,
          totalRules,
          totalUsers,
          pendingApprovals,
          activeRules,
          expiringSoonLicences,
          recentActivity: {
            newLicencesThisMonth,
            newOfficersThisMonth,
            newUsersThisMonth,
          },
        },
        message: "Stats fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admin statistics",
      },
      { status: 500 }
    );
  }
}
