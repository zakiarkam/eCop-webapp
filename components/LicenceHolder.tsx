import React, { useState } from "react";
import Table from "./LicenceDetailsTable";
import LicenceDetailsForm from "./LicenceDetailsForm";

export default function LicenceHolder() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
  };

  const navigateToForm = () => {
    <LicenceDetailsForm />;
  };

  return (
    <div className="w-full p-4 bg-gray-100">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#15134A]">
          Licence Holder Details
        </h2>
        <button
          onClick={navigateToForm}
          className="bg-[#6DB6FE] hover:opacity-35 text-white px-4 py-2 rounded shadow"
        >
          Add Licence Holder
        </button>
      </div>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Search Licence Holder..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-3/4 md:w-2/5 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE]"
        />
      </div>

      <div className="py-4">
        <Table />
      </div>
    </div>
  );
}
