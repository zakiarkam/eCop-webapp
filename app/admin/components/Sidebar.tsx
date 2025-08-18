"use client";

import { FaHome, FaUser, FaCog, FaFileAlt, FaBell } from "react-icons/fa";
import { MdRuleFolder } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import SideBarButton from "./SideBarButton";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { useUser } from "../.../../../../lib/context/UserContext";
import { useState, useEffect, useCallback } from "react";
import { PendingUsersApiService } from "@/services/apiServices/adminApi";

type SideBarProps = {
  status:
    | "dashboard"
    | "licenceholder"
    | "policeofficer"
    | "rules"
    | "violations"
    | "administration"
    | "settings"
    | "notifications";
  handleDashboard: () => void;
  handleLicenceHolder: () => void;
  handlePoliceOfficer: () => void;
  handleRules: () => void;
  handleViolations: () => void;
  handleAdministration: () => void;
  handleSettings: () => void;
  handleNotifications: () => void;
};

export default function Sidebar({
  status,
  handleDashboard,
  handleLicenceHolder,
  handlePoliceOfficer,
  handleRules,
  handleAdministration,
  handleViolations,
  handleSettings,
  handleNotifications,
}: SideBarProps) {
  const { user, isAuthenticated, isLoading } = useUser();
  const [pendingUsersCount, setPendingUsersCount] = useState<number>(0);

  const fetchPendingUsersCount = useCallback(async () => {
    if (user?.role === "admin") {
      try {
        const data = await PendingUsersApiService.fetchPendingUsers();
        setPendingUsersCount(data.length);
      } catch (error) {
        console.error("Failed to fetch pending users count:", error);
        setPendingUsersCount(0);
      }
    }
  }, [user?.role]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchPendingUsersCount();
    }
  }, [isAuthenticated, user?.role, fetchPendingUsersCount]);

  if (isLoading) {
    return (
      <div className="bg-white text-black shadow-md h-full flex flex-col transition-all duration-300 w-12 md:w-64">
        <nav className="mt-4 flex-grow">
          <ul className="space-y-1">
            {[...Array(6)].map((_, index) => (
              <li key={index} className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="hidden md:block w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const isAdmin = user.role === "admin";
  const isApproved = user.isApproved;

  return (
    <div className="bg-white text-black shadow-md h-full flex flex-col transition-all duration-300 w-12 md:w-64">
      <nav className="mt-16 flex-grow">
        <ul className="space-y-1">
          {isAdmin && (
            <SideBarButton
              isActive={status === "notifications"}
              text="Notifications"
              icon={<FaBell />}
              onClick={handleNotifications}
              notificationCount={pendingUsersCount}
            />
          )}
          <SideBarButton
            isActive={status === "dashboard"}
            text="Dashboard"
            icon={<FaHome />}
            onClick={handleDashboard}
          />
          {isApproved && (
            <SideBarButton
              isActive={status === "licenceholder"}
              text="Licence Holder"
              icon={<FaUser />}
              onClick={handleLicenceHolder}
            />
          )}
          {isApproved && (
            <SideBarButton
              isActive={status === "policeofficer"}
              text="Police Officer"
              icon={<GiPoliceOfficerHead />}
              onClick={handlePoliceOfficer}
            />
          )}
          {isAdmin && (
            <SideBarButton
              isActive={status === "rules"}
              text="Rules"
              icon={<MdRuleFolder />}
              onClick={handleRules}
            />
          )}
          {isApproved && (
            <SideBarButton
              isActive={status === "violations"}
              text="Violations"
              icon={<FaFileAlt />}
              onClick={handleViolations}
            />
          )}
          {isAdmin && (
            <SideBarButton
              isActive={status === "administration"}
              text="Administration"
              icon={<RiAdminFill />}
              onClick={handleAdministration}
            />
          )}{" "}
          <SideBarButton
            isActive={status === "settings"}
            text="Settings"
            icon={<FaCog />}
            onClick={handleSettings}
          />
        </ul>
      </nav>

      {user.role === "rmvAdmin" && !user.isApproved && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 text-center">
              Account Pending Approval
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
