"use client";

import React from "react";
import Dashboard from "./Dashboard";
import LicenceHolder from "./LicenceHolder";
import Rules from "./Rules";
import Administration from "./Administration";
import Settings from "./Settings";
import PoliceOfficer from "./PoliceOfficer";
import ViolationRecords from "./ViolationRecords";

type ContentProps = {
  status:
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
    <div className="w-full">
      {status === "dashboard" && <Dashboard />}
      {status === "licenceholder" && <LicenceHolder />}
      {status === "policeofficer" && <PoliceOfficer />}
      {status === "rules" && <Rules />}
      {status === "violations" && <ViolationRecords/>}
      {status === "administration" && <Administration />}
      {status === "settings" && <Settings />}

    </div>
  );
}
