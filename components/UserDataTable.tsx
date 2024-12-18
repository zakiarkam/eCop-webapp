"use client";
import React, { useState } from "react";

type UserData = {
  rmbname: string;
  rmbdistrict: string;
  rmbprovince: string;
  email: string;
  mobilenumber: string;
  idnumber: string;
};

export default function UserDataTable() {
  const [data, setData] = useState<UserData[]>([
    {
      rmbname: "John Doe",
      rmbdistrict: "Colombo",
      rmbprovince: "Western Province",
      email: "john.doe@example.com",
      mobilenumber: "0712345678",
      idnumber: "123456789V",
    },
    {
      rmbname: "Jane Smith",
      rmbdistrict: "Kandy",
      rmbprovince: "Central Province",
      email: "jane.smith@example.com",
      mobilenumber: "0777654321",
      idnumber: "987654321X",
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

  return (
    <div className="font-[sans-serif] p-4">
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 border border-gray-300">#</th>
              <th className="px-6 py-3 border border-gray-300">RMB Name</th>
              <th className="px-6 py-3 border border-gray-300">Email</th>
              <th className="px-6 py-3 border border-gray-300">District</th>
              <th className="px-6 py-3 border border-gray-300">Province</th>
              <th className="px-6 py-3 border border-gray-300">Mobile</th>
              <th className="px-6 py-3 border border-gray-300">ID Number</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((entry, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 odd:bg-white even:bg-gray-50"
              >
                <td className="px-6 py-3 border border-gray-300">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-3 border border-gray-300">
                  {entry.rmbname}
                </td>
                <td className="px-6 py-3 border border-gray-300">
                  {entry.email}
                </td>
                <td className="px-6 py-3 border border-gray-300">
                  {entry.rmbdistrict}
                </td>
                <td className="px-6 py-3 border border-gray-300">
                  {entry.rmbprovince}
                </td>
                <td className="px-6 py-3 border border-gray-300">
                  {entry.mobilenumber}
                </td>
                <td className="px-6 py-3 border border-gray-300">
                  {entry.idnumber}
                </td>
              </tr>
            ))}

            {/* Pagination Row */}
            <tr className="bg-gray-100">
              <td colSpan={7} className="px-6 py-3 text-center">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
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
