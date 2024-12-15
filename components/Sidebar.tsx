"use client";

import { FaHome, FaUser, FaCog } from "react-icons/fa";
import { MdRuleFolder } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import SideBarButton from "./SideBarButton";

type SideBarProps = {
  status:
    | "dashboard"
    | "licenceholder"
    | "rules"
    | "administration"
    | "settings";
  handleDashboard: () => void;
  handleLicenceHolder: () => void;
  handleRules: () => void;
  handleAdministration: () => void;
  handleSettings: () => void;
};

export default function Sidebar({
  status,
  handleDashboard,
  handleLicenceHolder,
  handleRules,
  handleAdministration,
  handleSettings,
}: SideBarProps) {
  return (
    <div className="bg-white text-black shadow-md h-full flex flex-col transition-all duration-300 w-12 md:w-64">
      <nav className="mt-4 flex-grow">
        <ul className="space-y-4">
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
            isActive={status === "rules"}
            text="Rules"
            icon={<MdRuleFolder />}
            onClick={handleRules}
          />
          <SideBarButton
            isActive={status === "administration"}
            text="Administration"
            icon={<RiAdminFill />}
            onClick={handleAdministration}
          />
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
