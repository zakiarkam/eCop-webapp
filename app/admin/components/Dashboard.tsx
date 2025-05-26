"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Card from "./Card";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="h-full flex flex-col p-4 bg-gray-100">
      <main className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#15134A]">Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Total Administrators" value="1,245" />
          <Card title="Total License Holder" value="34,550" />
          <Card title="Total Police Officer" value="14,550" />
        </div>

        <section className="py-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            The recent activities.
          </div>
        </section>
      </main>
    </div>
  );
}
