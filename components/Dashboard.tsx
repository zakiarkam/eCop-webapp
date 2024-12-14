"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Card from "./Card";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1">
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total Users" value="1,245" />
            <Card title="Revenue" value="$34,550" />
            <Card title="New Orders" value="123" />
          </div>

          <section>
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              This is a placeholder for recent activities.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
