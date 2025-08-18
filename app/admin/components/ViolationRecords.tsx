"use client";
import React, { useState, useEffect } from "react";
import ViolationRecordTable from "./ViolationRecordTable";
import { violationService } from "@/services/apiServices/violationApi";

type ViolationRecord = {
  _id: string;
  licenceNumber: string;
  licenceHolderId: string;
  policeNumber: string;
  policeOfficerId: string;
  phoneNumber: string;
  vehicleNumber: string;
  placeOfViolation: string;
  ruleId: string;
  ruleSection: string;
  ruleProvision: string;
  fine: string;
  points: number;
  violationDate: string;
  status: "active" | "paid" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "partially_paid";
  paymentDate: Date;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  policeStation: string;
  username: string;
  mobileNumber: string;
  sectionOfAct: string;
  provision: string;
  fineAmount: number;
  violationArea: string;
};

export default function ViolationRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await violationService.getAllViolations();

      if (response.success && response.data) {
        setViolations(response.data);
      } else {
        setError(response.message || "Failed to fetch violations");
      }
    } catch (err: any) {
      console.error("Error fetching violations:", err);
      setError(err.message || "An error occurred while fetching violations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    fetchViolations();
  };

  const uniqueStations = [...new Set(violations.map((v) => v.policeStation))];

  return (
    <div className="w-full p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-[#15134A]">
            Violation Record Details
          </h4>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-[#6DB6FE] text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, police number, vehicle number, or location..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE]"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error: {error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {loading && (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6DB6FE]"></div>
            <p className="mt-2 text-gray-600">Loading violation records...</p>
          </div>
        )}

        {/* Violation Records Table */}
        {!loading && (
          <div className="py-4">
            <ViolationRecordTable
              searchTerm={searchTerm}
              violations={violations}
              onRefresh={handleRefresh}
            />
          </div>
        )}
      </div>
    </div>
  );
}
