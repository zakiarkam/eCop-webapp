import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo/mongodb";
import License from "@/models/licenceHolder";
import PoliceOfficer from "@/models/policeOfficer";
import Rule from "@/models/rule";
import User from "@/models/users";
import type { NextRequest } from "next/server";

interface StatsResponse {
  success: boolean;
  data?: {
    totalLicenses: number;
    totalPoliceOfficers: number;
    totalRules: number;
    totalUsers: number;
    pendingApprovals: number;
    activeRules: number;
    expiringSoonLicenses: number;
    recentActivity: {
      newLicensesThisMonth: number;
      newOfficersThisMonth: number;
      newUsersThisMonth: number;
    };
  };
  message?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<StatsResponse>> {
  try {
    const session = await getServerSession();

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
      totalLicenses,
      totalPoliceOfficers,
      totalRules,
      totalUsers,
      pendingApprovals,
      activeRules,
      expiringSoonLicenses,
      newLicensesThisMonth,
      newOfficersThisMonth,
      newUsersThisMonth,
    ] = await Promise.all([
      License.countDocuments(),
      PoliceOfficer.countDocuments(),
      Rule.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ isApproved: false }),
      Rule.countDocuments({ status: "active" }),
      License.countDocuments({
        expiryDate: { $lte: thirtyDaysFromNow, $gte: currentDate },
      }),
      License.countDocuments({
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
          totalLicenses,
          totalPoliceOfficers,
          totalRules,
          totalUsers,
          pendingApprovals,
          activeRules,
          expiringSoonLicenses,
          recentActivity: {
            newLicensesThisMonth,
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
