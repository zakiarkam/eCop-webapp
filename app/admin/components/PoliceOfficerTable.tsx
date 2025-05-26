"use client";
import React, { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

type PoliceOfficer = {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: string;
  policeNumber: string;
  idNumber: string;
  permanentAddress: string;
  district: string;
  province: string;
  policeStation: string;
  badgeNo: string;
  phoneNumber: string;
  email: string;
};

export default function PoliceOfficerTable() {
  const [data, setData] = useState<PoliceOfficer[]>([
    {
      fullName: "John Smith",
      nameWithInitials: "J. Smith",
      dob: "1985-05-15",
      age: "38",
      policeNumber: "POL123456",
      idNumber: "198515123456",
      permanentAddress: "45 Police Avenue, Colombo",
      district: "Colombo",
      province: "Western Province",
      policeStation: "Colombo Central",
      badgeNo: "B12345",
      phoneNumber: "+94771234567",
      email: "john.smith@police.gov.lk"
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (index: number) => {
    console.log("Edit officer:", data[index]);
  };

  const handleDelete = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  return (
    <div className="">
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="w-full text-sm text-left text-gray-700 border-collapse border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">#</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Full Name</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Name with Initials</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Police Number</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Badge Number</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Police Station</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">District</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Province</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Phone Number</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Email</th>
              <th className="p-2 text-left text-sm font-bold border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((officer, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {startIndex + index + 1}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.fullName}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.nameWithInitials}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.policeNumber}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.badgeNo}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.policeStation}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.district}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.province}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.phoneNumber}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {officer.email}
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
                colSpan={11}
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