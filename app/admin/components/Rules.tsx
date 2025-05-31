import React from "react";
import FinesTable from "./CaseSection";

export default function Rules() {
  return (
    <div className="w-full p-4 bg-gray-100">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="text-xl  font-semibold text-[#15134A]">
          Traffic Rules Details
        </h4>
      </div>
      <div className="py-2">
        <FinesTable />
      </div>
    </div>
  );
}
