"use client";

import Card from "./Card";

export default function Dashboard() {
  return (
    <div className="h-full flex flex-col">
      <main className="p-6 space-y-6 flex-1 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Total Administrators" value="1,245" />
          <Card title="Total Licence Holder" value="34,550" />
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            This is a placeholder for recent activities.
          </div>
        </section>
      </main>
    </div>
  );
}
