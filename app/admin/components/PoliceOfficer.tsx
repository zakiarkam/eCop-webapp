"use client";
import React, { useState } from "react";
import PoliceOfficerTable from "./PoliceOfficerTable";
import { useUser } from "@/lib/context/UserContext";
import { useRouter } from "next/navigation";

export default function PoliceOfficer() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h4 className="text-xl  font-semibold text-[#15134A]">
            Police Officer Details
          </h4>
          <button
            className="bg-[#6DB6FE] hover:opacity-35 text-white px-4 py-2 rounded shadow"
            onClick={() => {
              router.push(`/admin/${user?.id}/createPoliceOfficer`);
            }}
          >
            Add Police Officer
          </button>
        </div>

        <div className="mb-2">
          <input
            type="text"
            placeholder="Search Police Officer..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-3/4 md:w-2/5 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE]"
          />
        </div>

        <div className="py-4">
          <PoliceOfficerTable searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}
