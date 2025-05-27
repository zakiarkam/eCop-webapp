"use client";
import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "./Sidebar";
import Content from "./Content";

export default function Active() {
  const [status, setStatus] = useState<
    | "dashboard"
    | "licenceholder"
    | "policeofficer"
    | "rules"
    | "administration"
    | "violations"
    | "settings"
    | "notifications"
  >("dashboard");

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          status={status}
          handleDashboard={() => setStatus("dashboard")}
          handleLicenceHolder={() => setStatus("licenceholder")}
          handlePoliceOfficer={() => setStatus("policeofficer")}
          handleRules={() => setStatus("rules")}
          handleViolations={() => setStatus("violations")}
          handleAdministration={() => setStatus("administration")}
          handleSettings={() => setStatus("settings")}
          handleNotifications={() => setStatus("notifications")}
        />

        <main className="p-6 space-y-6 flex-1 bg-gray-100 overflow-auto">
          <Content status={status} />
        </main>
      </div>
    </div>
  );
}
