"use client";
import React, { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

type LicenceHolder = {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: string;
  issueDate: string;
  expiryDate: string;
  idNumber: string;
  licenceNumber: string;
  permanentAddress: string;
  vehicleCategories: string[];
  issueDatePerCategory: { [key: string]: string };
  expiryDatePerCategory: { [key: string]: string };
};

export default function LicenceDetailsTable() {
  const [data, setData] = useState<LicenceHolder[]>([
    {
      fullName: "Kamal Vimal",
      nameWithInitials: "K. Vimal",
      dob: "1990-01-01",
      age: "33",
      issueDate: "2023-01-01",
      expiryDate: "2028-01-01",
      idNumber: "1234567890",
      licenceNumber: "LIC12345",
      permanentAddress: "123 Main St, Colombo",
      vehicleCategories: ["A", "B"],
      issueDatePerCategory: { A: "2023-01-01", B: "2023-02-01" },
      expiryDatePerCategory: { A: "2028-01-01", B: "2028-02-01" },
    },
  ]);

  const handleEdit = (index: number) => {
    console.log("Edit entry:", data[index]);
  };

  const handleDelete = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  return (
    <div className="">
      <div className="w-full bg-white overflow-x-scroll">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                #
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Full Name
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Name with Initials
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                DOB
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Age
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Permanent Address
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                ID Number
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Licence Number
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Date of Issue
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Date of Expiry
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Vehicle Categories
              </th>
              <th className="p-2 text-left text-sm font-bold text-gray-700 border border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {index + 1}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.fullName}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.nameWithInitials}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.dob}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.age}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.permanentAddress}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.idNumber}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.licenceNumber}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.issueDate}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.expiryDate}
                </td>
                <td className="p-2 text-sm text-gray-700 border border-gray-300">
                  {entry.vehicleCategories.map((category) => (
                    <div key={category}>
                      {category} <br />({entry.issueDatePerCategory[category]} -{" "}
                      {entry.expiryDatePerCategory[category]})
                    </div>
                  ))}
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
                colSpan={12}
                className="p-2 text-center text-sm text-gray-700 border border-gray-300"
              >
                <div className="flex justify-between items-center">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={false}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">Page 1 of 1</span>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={false}
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
