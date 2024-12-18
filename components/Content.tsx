"use client";

import React from "react";
import Dashboard from "./Dashboard";
import LicenceHolder from "./LicenceHolder";
import Rules from "./Rules";
import Administration from "./Administration";
import Settings from "./Settings";

type ContentProps = {
  status:
    | "dashboard"
    | "licenceholder"
    | "rules"
    | "administration"
    | "settings";
};

export default function Content({ status }: ContentProps) {
  return (
    <div className="w-full">
      {status === "dashboard" && <Dashboard />}
      {status === "licenceholder" && <LicenceHolder />}
      {status === "rules" && <Rules />}
      {status === "administration" && <Administration />}
      {status === "settings" && <Settings />}
    </div>
  );
}
