"use client";
import React, { useState, useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";

type ViolationRecord = {
  _id: string;
  username: string;
  licenceNumber: string;
  vehicleNumber: string;
  mobileNumber: string;
  sectionOfAct: string;
  provision: string;
  fineAmount: number;
  policeNumber: string;
  policeStation: string;
  violationArea: string;
  violationDate: string;
  status: "active" | "paid" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "partially_paid";
  paymentDate: Date;
  notes?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
};

interface ViolationRecordsTableProps {
  searchTerm: string;
  violations: ViolationRecord[];
  onRefresh: () => void;
}

export default function ViolationRecordsTable({
  searchTerm,
  violations,
}: ViolationRecordsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    return violations.filter((record) => {
      const matchesSearch =
        searchTerm === "" ||
        record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.policeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.licenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.violationArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.mobileNumber.includes(searchTerm);

      return matchesSearch;
    });
  }, [violations, searchTerm]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (record: ViolationRecord) => {
    console.log("Edit violation record:", record);
  };

  const handleDelete = async (record: ViolationRecord) => {
    console.log("delete violation record:", record);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "partially_paid":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
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
                  <th className="px-6 py-3 border truncate font-semibold">
                    Vehicle Info
                  </th>
                  <th className="px-6 py-3 border font-semibold truncate">
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
                    Payment Status
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    payment Date
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
                      {searchTerm
                        ? "No violation records found matching your search."
                        : "No violation records found."}
                    </td>
                  </tr>
                ) : (
                  currentData.map((record, index) => (
                    <tr
                      key={record._id}
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
                          <div className="text-gray-600">
                            Licence: {record.licenceNumber}
                          </div>
                          <div className="text-gray-600">
                            Mobile: {record.mobileNumber}
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

                          <div className="font-medium text-red-600">
                            {formatCurrency(record.fineAmount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Points: {record.points}
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
                        <div className="max-w-xs">{record.violationArea}</div>
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
                      <td className="px-6 py-4 border">
                        <div className="max-w-xs">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              record.paymentStatus
                            )}`}
                          >
                            {record.paymentStatus}{" "}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border">
                        <div className="">
                          {formatDate(
                            record.paymentDate
                              ? record.paymentDate.toString()
                              : ""
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="text-[#6DB6FE] hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Violation Record"
                            disabled={record.status === "paid"}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record)}
                            disabled={record.status === "paid"}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              record.status === "paid"
                                ? "Already Cancelled"
                                : "Cancel Violation Record"
                            }
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
                  <tr className="bg-gray-100 ">
                    <td colSpan={12} className="px-6 py-3">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, filteredData.length)} of{" "}
                          {filteredData.length} violation records
                          {searchTerm &&
                            ` (filtered from ${violations.length} total)`}
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
