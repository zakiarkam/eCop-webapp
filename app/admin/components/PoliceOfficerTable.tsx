"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useSnackbar } from "notistack";
import DeleteConfirmationModal from "./modal/deleteModal";
import EditPoliceOfficerModal from "./modal/editPoliceOfficer";

type PoliceOfficer = {
  _id: string;
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: number;
  policeNumber: string;
  idNumber: string;
  permanentAddress: string;
  district: string;
  province: string;
  policeStation: string;
  badgeNo: string;
  phoneNumber: string;
  rank: string;
  joiningDate: string;
  bloodGroup: string;
};

interface ApiResponse {
  success: boolean;
  data?: PoliceOfficer[];
  message?: string;
  total?: number;
}

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

  // Fetch data from API
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/other/policeOfficer/getAllOfficers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

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
      const response = await fetch(
        `/api/other/policeOfficer/deleteOfficer/${officerToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success || response.ok) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading police officers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="font-[sans-serif] p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {currentData.length} of {filteredData.length} police officers
          {searchTerm && ` (filtered from ${data.length} total)`}
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-sm">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 border border-gray-300">No</th>
              <th className="px-6 py-3 border border-gray-300">Full Name</th>
              <th className="px-6 py-3 border border-gray-300">
                Name with Initials
              </th>
              <th className="px-6 py-3 border border-gray-300">
                Police Number
              </th>
              <th className="px-6 py-3 border border-gray-300">Badge No</th>
              <th className="px-6 py-3 border border-gray-300">Rank</th>
              <th className="px-6 py-3 border border-gray-300">
                Police Station
              </th>
              <th className="px-6 py-3 border border-gray-300">District</th>
              <th className="px-6 py-3 border border-gray-300">Province</th>
              <th className="px-6 py-3 border border-gray-300">Phone Number</th>
              <th className="px-6 py-3 border border-gray-300">Blood Group</th>
              <th className="px-6 py-3 border border-gray-300">DOB</th>
              <th className="px-6 py-3 border border-gray-300">Age</th>
              <th className="px-6 py-3 border border-gray-300">Joining Date</th>
              <th className="px-6 py-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
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
                  className="hover:bg-gray-50 odd:bg-white even:bg-gray-50"
                >
                  <td className="px-6 py-3 border border-gray-300">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-3 border border-gray-300 font-medium">
                    {officer.fullName}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {officer.nameWithInitials}
                  </td>
                  <td className="px-6 py-3 border border-gray-300 font-medium">
                    {officer.policeNumber}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {officer.badgeNo}
                    </span>
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {officer.rank}
                    </span>
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {officer.policeStation}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {officer.district}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {officer.province}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {officer.phoneNumber}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {officer.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-3 border whitespace-nowrap border-gray-300">
                    {formatDate(officer.dob)}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {officer.age}
                  </td>
                  <td className="px-6 py-3 border whitespace-nowrap border-gray-300">
                    {formatDate(officer.joiningDate)}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(officer)}
                        className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Edit Officer"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(officer)}
                        className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        title="Delete Officer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}

            {totalPages > 1 && (
              <tr className="bg-gray-100">
                <td colSpan={15} className="px-6 py-3">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex space-x-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else {
                              const start = Math.max(1, currentPage - 2);
                              const end = Math.min(totalPages, start + 4);
                              pageNum = start + i;
                              if (pageNum > end) return null;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1 text-sm rounded ${
                                  currentPage === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
