"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useSnackbar } from "notistack";
import DeleteConfirmationModal from "./modal/deleteModal";
import EditPoliceOfficerModal from "./modal/editPoliceOfficer";
import {
  PoliceOfficer,
  policeOfficerAPI,
} from "@/services/apiServices/policeOfficerApi";

interface PoliceOfficerTableProps {
  searchTerm?: string;
}

export default function PoliceOfficerTable({
  searchTerm = "",
}: PoliceOfficerTableProps) {
  const [data, setData] = useState<PoliceOfficer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState<{
    id: string;
    name: string;
    policeNumber: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [officerToEdit, setOfficerToEdit] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  // Fetch data using API service
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await policeOfficerAPI.getAllOfficers();

        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.message || "Failed to fetch police officers");
        }
      } catch (err) {
        console.error("Error fetching police officers:", err);
        setError("Failed to load police officer data");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(
      (officer) =>
        officer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.nameWithInitials
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        officer.policeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.badgeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.policeStation
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        officer.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.rank.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (officer: PoliceOfficer) => {
    console.log("Edit clicked for officer:", officer);
    setOfficerToEdit(officer._id);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedOfficer: PoliceOfficer) => {
    setData((prevData) =>
      prevData.map((officer) =>
        officer._id === updatedOfficer._id ? updatedOfficer : officer
      )
    );
    setIsEditModalOpen(false);
    setOfficerToEdit(null);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setOfficerToEdit(null);
  };

  const handleDeleteClick = (officer: PoliceOfficer) => {
    console.log("Delete clicked for officer:", officer);
    setOfficerToDelete({
      id: officer._id,
      name: officer.fullName,
      policeNumber: officer.policeNumber,
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!officerToDelete) return;

    setDeleteLoading(true);
    try {
      const result = await policeOfficerAPI.deleteOfficer(officerToDelete.id);

      if (result.success) {
        setData((prevData) =>
          prevData.filter((officer) => officer._id !== officerToDelete.id)
        );
        setIsDeleteModalOpen(false);
        setOfficerToDelete(null);
        enqueueSnackbar(`Police officer deleted successfully`, {
          variant: "success",
        });
      } else {
        enqueueSnackbar(
          `Error deleting police officer: ${result.message || "Unknown error"}`,
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      console.error("Error deleting police officer:", error);
      enqueueSnackbar(`Error deleting police officer`, {
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setOfficerToDelete(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="mb-4">
        <div className="max-w-full mx-auto bg-white rounded-sm shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 border font-semibold">No</th>
                  <th className="px-6 py-3 border font-semibold">Full Name</th>
                  <th className="px-6 py-3 border font-semibold">
                    Name with Initials
                  </th>
                  <th className="px-6 py-3 border font-semibold">
                    Police Number
                  </th>
                  <th className="px-6 py-3 border font-semibold">Badge No</th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Rank
                  </th>
                  <th className="px-6 py-3 border font-semibold">
                    Police Station
                  </th>
                  <th className="px-6 py-3 border font-semibold">District</th>
                  <th className="px-6 py-3 border font-semibold">Province</th>
                  <th className="px-6 py-3 border font-semibold">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 border font-semibold">
                    Police Points
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 border font-semibold">DOB</th>
                  <th className="px-6 py-3 border font-semibold">Age</th>
                  <th className="px-6 py-3 border font-semibold">
                    Joining Date
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={15} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading police officers...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={15}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No police officers found matching your search."
                        : "No police officers found."}
                    </td>
                  </tr>
                ) : (
                  currentData.map((officer, index) => (
                    <tr
                      key={officer._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 border font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 border font-medium">
                        {officer.fullName}
                      </td>
                      <td className="px-6 py-4 border">
                        {officer.nameWithInitials}
                      </td>
                      <td className="px-6 py-4 border font-medium">
                        {officer.policeNumber}
                      </td>
                      <td className="px-6 py-4 border">{officer.badgeNo}</td>
                      <td className="px-6 py-4 border text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {officer.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 border">
                        {officer.policeStation}
                      </td>
                      <td className="px-6 py-4 border">{officer.district}</td>
                      <td className="px-6 py-4 border">{officer.province}</td>
                      <td className="px-6 py-4 border">
                        {officer.phoneNumber}
                      </td>
                      <td className="px-6 py-4 border">
                        {officer.policePoints}
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {officer.bloodGroup}
                        </span>
                      </td>

                      <td className="px-6 py-4 border">
                        {formatDate(officer.dob)}
                      </td>
                      <td className="px-6 py-4 border">{officer.age}</td>
                      <td className="px-6 py-4 border">
                        {formatDate(officer.joiningDate)}
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(officer)}
                            className="text-[#6DB6FE] hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Officer"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(officer)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete Officer"
                            disabled={loading}
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
                    <td colSpan={20} className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, filteredData.length)} of{" "}
                          {filteredData.length} police officers
                          {searchTerm &&
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

      {isEditModalOpen && officerToEdit && (
        <EditPoliceOfficerModal
          isOpen={isEditModalOpen}
          onClose={handleEditCancel}
          officerId={officerToEdit}
          onSuccess={handleEditSuccess}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Police Officer"
        description={`Are you sure you want to delete the police officer ${officerToDelete?.name}?`}
        item={{
          primaryText: officerToDelete?.name || "",
          secondaryText: `Police Number: ${
            officerToDelete?.policeNumber || ""
          }`,
        }}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        confirmButtonText="Delete Officer"
        warningText="This action cannot be undone. All officer data will be permanently removed."
      />
    </div>
  );
}
