import React from "react";
import FinesTable from "./CaseSection";

export default function Rules() {
  return (
    <div className="w-full p-4 bg-gray-100">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#15134A]">
          Fine Details
        </h2>
      </div>
      <div className="py-2">
        <FinesTable />
      </div>
    </div>
  );
}
