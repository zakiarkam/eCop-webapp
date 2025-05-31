"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { enqueueSnackbar, useSnackbar } from "notistack";
import DeleteConfirmationModal from "./modal/deleteModal";
import EditLicenceModal from "./modal/editLicenceHolder";

type LicenceHolder = {
  _id: string;
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: number;
  issueDate: string;
  expiryDate: string;
  idNumber: string;
  licenceNumber: string;
  permanentAddress: string;
  currentAddress: string;
  bloodGroup: string;
  vehicleCategories: Array<{
    category: string;
    issueDate: string;
    expiryDate: string;
  }>;
};

interface ApiResponse {
  success: boolean;
  data?: LicenceHolder[];
  message?: string;
  total?: number;
}

interface LicenceDetailsTableProps {
  searchTerm?: string;
}

export default function LicenceDetailsTable({
  searchTerm = "",
}: LicenceDetailsTableProps) {
  const [data, setData] = useState<LicenceHolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [licenceToDelete, setLicenceToDelete] = useState<{
    id: string;
    name: string;
    licenceNumber: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [licenceToEdit, setLicenceToEdit] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  // Fetch data from API
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/other/licence/getAllHolder`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.message || "Failed to fetch licenses");
        }
      } catch (err) {
        console.error("Error fetching licenses:", err);
        setError("Failed to load license data");
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(
      (licence) =>
        licence.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        licence.nameWithInitials
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        licence.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        licence.licenceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        licence.currentAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        licence.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEdit = (licence: LicenceHolder) => {
    console.log("Edit clicked for licence:", licence);
    setLicenceToEdit(licence._id);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedLicence: LicenceHolder) => {
    setData((prevData) =>
      prevData.map((licence) =>
        licence._id === updatedLicence._id ? updatedLicence : licence
      )
    );
    setIsEditModalOpen(false);
    setLicenceToEdit(null);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setLicenceToEdit(null);
  };

  const handleDeleteClick = (licence: LicenceHolder) => {
    console.log("Delete clicked for licence:", licence);
    setLicenceToDelete({
      id: licence._id,
      name: licence.fullName,
      licenceNumber: licence.licenceNumber,
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!licenceToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(
        `/api/other/licence/deleteHolder/${licenceToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success || response.ok) {
        setData((prevData) =>
          prevData.filter((licence) => licence._id !== licenceToDelete.id)
        );
        setIsDeleteModalOpen(false);
        setLicenceToDelete(null);
        enqueueSnackbar(`Licence deleted successfully`, {
          variant: "success",
        });
      } else {
        enqueueSnackbar(
          `Error deleting licence: ${result.message || "Unknown error"}`,
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      console.error("Error deleting licence:", error);
      enqueueSnackbar(`Error deleting licence`, {
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setLicenceToDelete(null);
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
                  <th className="px-6 py-3 border font-semibold">DOB</th>
                  <th className="px-6 py-3 border font-semibold">Age</th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 border font-semibold">
                    Current Address
                  </th>
                  <th className="px-6 py-3 border font-semibold">ID Number</th>
                  <th className="px-6 py-3 border font-semibold">
                    Licence Number
                  </th>
                  <th className="px-6 py-3 border font-semibold">Issue Date</th>
                  <th className="px-6 py-3 border font-semibold">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 border font-semibold">
                    Vehicle Categories
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading licences...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No licences found matching your search."
                        : "No licences found."}
                    </td>
                  </tr>
                ) : (
                  currentData.map((entry, index) => (
                    <tr
                      key={entry._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 border font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 border font-medium">
                        {entry.fullName}
                      </td>
                      <td className="px-6 py-4 border">
                        {entry.nameWithInitials}
                      </td>
                      <td className="px-6 py-4 border">
                        {formatDate(entry.dob)}
                      </td>
                      <td className="px-6 py-4 border">{entry.age}</td>
                      <td className="px-6 py-4 border text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {entry.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 border">
                        <div
                          className="max-w-xs truncate"
                          title={entry.currentAddress}
                        >
                          {entry.currentAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4 border">{entry.idNumber}</td>
                      <td className="px-6 py-4 border font-medium">
                        {entry.licenceNumber}
                      </td>
                      <td className="px-6 py-4 border">
                        {formatDate(entry.issueDate)}
                      </td>
                      <td className="px-6 py-4 border">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            new Date(entry.expiryDate) > new Date()
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formatDate(entry.expiryDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 border">
                        <div className="space-y-2">
                          {entry.vehicleCategories.map((vc, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                                  {vc.category}
                                </span>
                                <span className="text-gray-500 whitespace-nowrap">
                                  {formatDate(vc.issueDate)} -{" "}
                                  {formatDate(vc.expiryDate)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-[#6DB6FE] hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Licence"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(entry)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete Licence"
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
                    <td colSpan={13} className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, filteredData.length)} of{" "}
                          {filteredData.length} licences
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

      {isEditModalOpen && licenceToEdit && (
        <EditLicenceModal
          isOpen={isEditModalOpen}
          onClose={handleEditCancel}
          licenceId={licenceToEdit}
          onSuccess={handleEditSuccess}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Licence Holder"
        description={`Are you sure you want to delete the licence for ${licenceToDelete?.name}?`}
        item={{
          primaryText: licenceToDelete?.name || "",
          secondaryText: `Licence: ${licenceToDelete?.licenceNumber || ""}`,
        }}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        confirmButtonText="Delete Licence"
        warningText="This action cannot be undone. All licence data will be permanently removed."
      />
    </div>
  );
}
