import React, { useState } from "react";
import ViolationRecordTable from "./ViolationRecordTable";

const policeStations = [
  "Colombo Central",
  "Kandy Central",
  "Galle Central",
  "Jaffna Central",
  "Batticaloa Central",
  // Add more police stations as needed
];

export default function ViolationRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStation, setSelectedStation] = useState("");

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
  };

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStation(e.target.value);
  };

  return (
    <div className="w-full p-4 bg-gray-100">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#15134A]">
          Violation Record Details
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, police number, or vehicle number..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE]"
        />

        <select
          value={selectedStation}
          onChange={handleStationChange}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE]"
        >
          <option value="">All Police Stations</option>
          {policeStations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>

      <div className="py-4">
        <ViolationRecordTable
          searchTerm={searchTerm}
          selectedStation={selectedStation}
        />
      </div>
    </div>
  );
}
