"use client";
import React, { useState, useEffect, useMemo } from "react";
import EditUserModal from "./modal/editUser";
import { Edit, Trash2 } from "lucide-react";
import { enqueueSnackbar, useSnackbar } from "notistack";
import DeleteConfirmationModal from "./modal/deleteModal";

type UserData = {
  id: string;
  rmbname: string;
  rmbdistrict: string;
  rmbprovince: string;
  email: string;
  mobilenumber: string;
  idnumber: string;
  role: string;
  isApproved: boolean;
  approvedAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  data: UserData[];
  total: number;
  message?: string;
};

interface UserDataTableProps {
  searchTerm?: string;
  roleFilter?: string;
  approvalFilter?: string;
}

export default function UserDataTable({
  searchTerm = "",
  roleFilter = "",
  approvalFilter = "",
}: UserDataTableProps) {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (roleFilter) params.append("role", roleFilter);
        if (approvalFilter !== "") params.append("isApproved", approvalFilter);

        const response = await fetch(
          `/api/other/user/getAllUser?${params.toString()}`
        );
        const result: ApiResponse = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Failed to fetch users");
        }
      } catch (err) {
        setError("Error fetching users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter, approvalFilter]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(
      (user) =>
        user.rmbname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rmbdistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobilenumber.includes(searchTerm) ||
        user.idnumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEdit = (user: UserData) => {
    console.log("Edit clicked for user:", user);
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedUser: UserData) => {
    setData((prevData) =>
      prevData.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteClick = (user: UserData) => {
    console.log("Delete clicked for user:", user);
    setUserToDelete({
      id: user.id,
      name: user.rmbname,
      email: user.email,
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(
        `/api/other/user/deleteUser/${userToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success || response.ok) {
        setData((prevData) =>
          prevData.filter((user) => user.id !== userToDelete.id)
        );
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        enqueueSnackbar(`User deleted successfully`, {
          variant: "success",
        });
      } else {
        alert("Error deleting user: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      enqueueSnackbar(`Error deleting user`, {
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
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
      <div className=" mb-4">
        <div className="max-w-full mx-auto bg-white  rounded-sm shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 border font-semibold">No</th>
                  <th className="px-6 py-3 border font-semibold">RMV Name</th>
                  <th className="px-6 py-3 border font-semibold">Email</th>
                  <th className="px-6 py-3 border font-semibold">District</th>
                  <th className="px-6 py-3 border font-semibold">Mobile</th>
                  <th className="px-6 py-3 border font-semibold">ID Number</th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Role
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Status
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Approved
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No users found matching your search."
                        : "No users found."}
                    </td>
                  </tr>
                ) : (
                  currentData.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 border font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 border font-medium">
                        {entry.rmbname}
                      </td>
                      <td className="px-6 py-4 border">{entry.email}</td>
                      <td className="px-6 py-4 border">{entry.rmbdistrict}</td>
                      <td className="px-6 py-4 border">{entry.mobilenumber}</td>
                      <td className="px-6 py-4 border">{entry.idnumber}</td>
                      <td className="px-6 py-4 border text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {entry.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.isApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {entry.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 border text-center text-gray-500">
                        {formatDate(entry.approvedAt)}
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-[#6DB6FE] hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit User"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(entry)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete User"
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
                    <td colSpan={10} className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, filteredData.length)} of{" "}
                          {filteredData.length} users
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

      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete User Account"
        description="Are you sure you want to delete this user account?"
        item={{
          primaryText: userToDelete?.name || "",
          secondaryText: userToDelete?.email || "",
        }}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        confirmButtonText="Delete User"
        warningText="This action cannot be undone. All user data will be permanently removed."
      />
    </div>
  );
}
