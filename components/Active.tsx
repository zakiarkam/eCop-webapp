"use client";
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";

export default function Active() {
  const [status, setStatus] = useState<
    "dashboard" | "licenceholder" | "rules" | "administration" | "settings"
  >("dashboard");

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar
          status={status}
          handleDashboard={() => setStatus("dashboard")}
          handleLicenceHolder={() => setStatus("licenceholder")}
          handleRules={() => setStatus("rules")}
          handleAdministration={() => setStatus("administration")}
          handleSettings={() => setStatus("settings")}
        />

        <main className="p-6 space-y-6 flex-1 bg-gray-100">
          <Content status={status} />
        </main>
      </div>
    </div>
  );
}
