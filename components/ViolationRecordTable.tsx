"use client";
import React, { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

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

export default function ViolationRecordsTable({ searchTerm, selectedStation }: ViolationRecordsTableProps) {
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
      status: "Pending"
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
      status: "Paid"
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter data based on search term and selected station
  const filteredData = data.filter(record => {
    const matchesSearch = searchTerm === "" || 
      record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.policeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStation = selectedStation === "" || 
      record.policeStation === selectedStation;

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

  return (
    <div className="">
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="w-full text-sm text-left text-gray-700 border-collapse border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">#</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Date</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">User Details</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Vehicle Info</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Violation Details</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Police Details</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Location</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Fine Status</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {startIndex + index + 1}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {new Date(record.violationDate).toLocaleDateString()}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  <div>
                    <div className="font-medium">{record.username}</div>
                    <div>{record.licenseNumber}</div>
                    <div>{record.mobileNumber}</div>
                  </div>
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {record.vehicleNumber}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  <div>
                    <div>Act: {record.sectionOfAct}</div>
                    <div>Violation: {record.provision}</div>
                    <div className="font-medium">Fine: Rs. {record.fineAmount.toLocaleString()}</div>
                  </div>
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  <div>
                    <div>{record.policeNumber}</div>
                    <div>{record.policeStation}</div>
                  </div>
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {record.violationArea}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(index)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td
                colSpan={9}
                className="p-2 text-center text-sm text-gray-700 border border-gray-300"
              >
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}