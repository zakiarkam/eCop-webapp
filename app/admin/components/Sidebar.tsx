"use client";
import { FaHome, FaUser, FaCog, FaFileAlt, FaBell } from "react-icons/fa";
import { MdRuleFolder } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import SideBarButton from "./SideBarButton";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  return (
    <div className="bg-white text-black shadow-md h-full flex flex-col transition-all duration-300 w-12 md:w-64">
      <nav className="mt-4 flex-grow">
        <ul className="space-y-1">
          {session?.user?.role === "admin" && (
            <SideBarButton
              isActive={status === "notifications"}
              text="Notifications"
              icon={<FaBell />}
              onClick={handleNotifications}
            />
          )}
          <SideBarButton
            isActive={status === "dashboard"}
            text="Dashboard"
            icon={<FaHome />}
            onClick={handleDashboard}
          />
          <SideBarButton
            isActive={status === "licenceholder"}
            text="Licence Holder"
            icon={<FaUser />}
            onClick={handleLicenceHolder}
          />
          <SideBarButton
            isActive={status === "policeofficer"}
            text="Police Officer"
            icon={<GiPoliceOfficerHead />}
            onClick={handlePoliceOfficer}
          />

          {session?.user?.role === "admin" && (
            <SideBarButton
              isActive={status === "rules"}
              text="Rules"
              icon={<MdRuleFolder />}
              onClick={handleRules}
            />
          )}
          <SideBarButton
            isActive={status === "violations"}
            text="Violations"
            icon={<FaFileAlt />}
            onClick={handleViolations}
          />
          {session?.user?.role === "admin" && (
            <SideBarButton
              isActive={status === "administration"}
              text="Administration"
              icon={<RiAdminFill />}
              onClick={handleAdministration}
            />
          )}
          <SideBarButton
            isActive={status === "settings"}
            text="Settings"
            icon={<FaCog />}
            onClick={handleSettings}
          />
        </ul>
      </nav>
    </div>
  );
}
