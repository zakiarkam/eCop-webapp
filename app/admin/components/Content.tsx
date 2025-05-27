"use client";

import React from "react";
import Dashboard from "./Dashboard";
import LicenceHolder from "./LicenceHolder";
import Rules from "./Rules";
import Administration from "./Administration";
import Settings from "./Settings";
import PoliceOfficer from "./PoliceOfficer";
import ViolationRecords from "./ViolationRecords";
import PendingUsersManagement from "./PendingUserMangement";

type ContentProps = {
  status:
    | "notifications"
    | "dashboard"
    | "licenceholder"
    | "policeofficer"
    | "rules"
    | "violations"
    | "administration"
    | "settings";
};

export default function Content({ status }: ContentProps) {
  return (
    <div className="w-full pt-12">
      {status === "notifications" && <PendingUsersManagement />}
      {status === "dashboard" && <Dashboard />}
      {status === "licenceholder" && <LicenceHolder />}
      {status === "policeofficer" && <PoliceOfficer />}
      {status === "rules" && <Rules />}
      {status === "violations" && <ViolationRecords />}
      {status === "administration" && <Administration />}
      {status === "settings" && <Settings />}
    </div>
  );
}
