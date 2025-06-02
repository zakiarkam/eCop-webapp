"use client";
import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

type ViolationRecord = {
  username: string;
  licenseNumber: string;
  vehicleNumber: string;
  mobileNumber: string;
  sectionOfAct: string;
  provision: string;
  fineAmount: number;
  policeNumber: string;
  policeStation: string;
  violationArea: string;
  violationDate: string;
  status: "Pending" | "Paid" | "Overdue";
};

interface ViolationRecordsTableProps {
  searchTerm: string;
  selectedStation: string;
}

export default function ViolationRecordsTable({
  searchTerm,
  selectedStation,
}: ViolationRecordsTableProps) {
  const [data] = useState<ViolationRecord[]>([
    {
      username: "John Doe",
      licenseNumber: "B1234567",
      vehicleNumber: "CAR-1234",
      mobileNumber: "+94771234567",
      sectionOfAct: "Section 151",
      provision: "Exceeding Speed Limit",
      fineAmount: 2500,
      policeNumber: "POL123",
      policeStation: "Colombo Central",
      violationArea: "Galle Road, Colombo 03",
      violationDate: "2024-02-22",
      status: "Pending",
    },
    {
      username: "Jane Smith",
      licenseNumber: "B7654321",
      vehicleNumber: "CAB-5678",
      mobileNumber: "+94777654321",
      sectionOfAct: "Section 140",
      provision: "Signal Violation",
      fineAmount: 3000,
      policeNumber: "POL456",
      policeStation: "Kandy Central",
      violationArea: "Peradeniya Road, Kandy",
      violationDate: "2024-02-21",
      status: "Paid",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter data based on search term and selected station
  const filteredData = data.filter((record) => {
    const matchesSearch =
      searchTerm === "" ||
      record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.policeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStation =
      selectedStation === "" || record.policeStation === selectedStation;

    return matchesSearch && matchesStation;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (index: number) => {
    console.log("Edit violation record:", filteredData[index]);
  };

  const handleDelete = (index: number) => {
    console.log("Delete violation record:", filteredData[index]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="font-sans">
      <div className="mb-4">
        <div className="max-w-full mx-auto bg-white rounded-sm shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 border font-semibold">No</th>
                  <th className="px-6 py-3 border font-semibold">Date</th>
                  <th className="px-6 py-3 border font-semibold">
                    User Details
                  </th>
                  <th className="px-6 py-3 border font-semibold">
                    Vehicle Info
                  </th>
                  <th className="px-6 py-3 border font-semibold">
                    Violation Details
                  </th>
                  <th className="px-6 py-3 border font-semibold">
                    Police Details
                  </th>
                  <th className="px-6 py-3 border font-semibold">Location</th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Fine Status
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm || selectedStation
                        ? "No violation records found matching your search."
                        : "No violation records found."}
                    </td>
                  </tr>
                ) : (
                  currentData.map((record, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 border font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 border">
                        {formatDate(record.violationDate)}
                      </td>
                      <td className="px-6 py-4 border">
                        <div>
                          <div className="font-medium">{record.username}</div>
                          <div className="text-gray-600">
                            {record.licenseNumber}
                          </div>
                          <div className="text-gray-600">
                            {record.mobileNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border font-medium">
                        {record.vehicleNumber}
                      </td>
                      <td className="px-6 py-4 border">
                        <div>
                          <div className="text-gray-600">
                            Act: {record.sectionOfAct}
                          </div>
                          <div className="text-gray-600">
                            Violation: {record.provision}
                          </div>
                          <div className="font-medium text-red-600">
                            Fine: Rs. {record.fineAmount.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border">
                        <div>
                          <div className="font-medium">
                            {record.policeNumber}
                          </div>
                          <div className="text-gray-600">
                            {record.policeStation}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border">
                        {record.violationArea}
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="text-[#6DB6FE] hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Violation Record"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete Violation Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {filteredData.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-100">
                    <td colSpan={9} className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, filteredData.length)} of{" "}
                          {filteredData.length} violation records
                          {(searchTerm || selectedStation) &&
                            ` (filtered from ${data.length} total)`}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
