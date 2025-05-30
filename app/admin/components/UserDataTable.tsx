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
      enqueueSnackbar(`UError deleting user`, {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading users...</span>
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
          Showing {currentData.length} of {filteredData.length} users
          {searchTerm && ` (filtered from ${data.length} total)`}
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-sm ">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 border border-gray-300">No</th>
              <th className="px-6 py-3 border border-gray-300">RMV Name</th>
              <th className="px-6 py-3 border border-gray-300">Email</th>
              <th className="px-6 py-3 border border-gray-300">District</th>
              <th className="px-6 py-3 border border-gray-300">Mobile</th>
              <th className="px-6 py-3 border border-gray-300">ID Number</th>
              <th className="px-6 py-3 border border-gray-300">Role</th>
              <th className="px-6 py-3 border border-gray-300">Status</th>
              <th className="px-6 py-3 border border-gray-300">Approved</th>
              <th className="px-6 py-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
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
                  className="hover:bg-gray-50 odd:bg-white even:bg-gray-50"
                >
                  <td className="px-6 py-3 border border-gray-300">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-3 border border-gray-300 font-medium">
                    {entry.rmbname}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {entry.email}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {entry.rmbdistrict}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {entry.mobilenumber}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    {entry.idnumber}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
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
                  <td className="px-6 py-3 border border-gray-300">
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
                  <td className="px-6 py-3 border border-gray-300 text-gray-500">
                    {formatDate(entry.approvedAt)}
                  </td>
                  <td className="px-6 py-3 border border-gray-300">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Edit User"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry)}
                        className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        title="Delete User"
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
                <td colSpan={10} className="px-6 py-3">
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
