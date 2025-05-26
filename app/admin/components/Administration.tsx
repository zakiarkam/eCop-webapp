import React, { useState } from "react";
import UserDataTable from "./UserDataTable";

export default function Administration() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className="w-full p-4 bg-gray-100">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#15134A]">
          User Details
        </h2>
      </div>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Search License Holder..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-3/4 md:w-2/5 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE]"
        />
      </div>

      <div className="py-4">
        <UserDataTable />
      </div>
    </div>
  );
}
