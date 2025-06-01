"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Check,
  X,
  User,
  Mail,
  MapPin,
  Shield,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useSnackbar } from "notistack";
import { useUser } from "@/lib/context/UserContext";
import { PendingUsersApiService } from "@/services/apiServices/adminApi";

interface PendingUser {
  _id: string;
  rmbname: string;
  email: string;
  rmbdistrict: string;
  rmbprovince: string;
  role: string;
  createdAt?: string;
}

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "approve" | "reject";
  userCount: number;
  loading: boolean;
}

const BulkActionModal: React.FC<BulkActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  userCount,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div
            className={`rounded-full p-2 mr-3 ${
              action === "approve" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {action === "approve" ? (
              <Check className={`h-6 w-6 text-green-600`} />
            ) : (
              <AlertTriangle className={`h-6 w-6 text-red-600`} />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Bulk {action === "approve" ? "Approval" : "Rejection"}
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to {action} all {userCount} filtered users? This
          action cannot be undone.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
              action === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              `${action === "approve" ? "Approve" : "Reject"} All`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PendingUsersManagement() {
  const { user, isAuthenticated, isLoading } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkModal, setBulkModal] = useState<{
    isOpen: boolean;
    action: "approve" | "reject";
  }>({
    isOpen: false,
    action: "approve",
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchPendingUsers();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    let filtered = pendingUsers;
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.rmbname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.rmbdistrict.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  }, [pendingUsers, searchTerm]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const data = await PendingUsersApiService.fetchPendingUsers();
      setPendingUsers(data);
    } catch (error) {
      enqueueSnackbar("Failed to fetch pending users", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserApproval = async (
    userId: string,
    approved: boolean,
    userName: string
  ): Promise<void> => {
    setProcessing(userId);
    try {
      await PendingUsersApiService.approveUser(userId, approved);
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
      const action = approved ? "approved" : "rejected";
      enqueueSnackbar(`${userName} has been ${action} successfully!`, {
        variant: "success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error processing request. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setProcessing(null);
    }
  };

  const openBulkModal = (action: "approve" | "reject") => {
    setBulkModal({ isOpen: true, action });
  };

  const closeBulkModal = () => {
    setBulkModal({ isOpen: false, action: "approve" });
  };

  const handleBulkAction = async () => {
    if (filteredUsers.length === 0) return;

    setLoading(true);
    try {
      const userIds = filteredUsers.map((user) => user._id);
      await PendingUsersApiService.bulkApproveUsers(
        userIds,
        bulkModal.action === "approve"
      );

      setPendingUsers((prev) =>
        prev.filter((user) => !userIds.includes(user._id))
      );

      enqueueSnackbar(
        `Successfully ${bulkModal.action}ed ${filteredUsers.length} users!`,
        { variant: "success" }
      );
    } catch (error) {
      enqueueSnackbar("Error processing bulk action", { variant: "error" });
    } finally {
      setLoading(false);
      closeBulkModal();
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mr-3" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!isAuthenticated || !user) {
    return (
      <div className="p-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-yellow-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600">
            You don't have permission to access this page. Admin privileges
            required.
          </p>
          <div className="mt-4 text-sm text-red-500">
            Current role: {user.role}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                Pending User Approvals
              </h4>
              <p className="text-gray-600 mt-1">
                Review and manage user registration requests
              </p>
            </div>
            <div className="flex items-center sm:mt-0  mt-3 space-x-3">
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                {pendingUsers.length} Pending
              </div>
              <button
                onClick={fetchPendingUsers}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openBulkModal("approve")}
                  disabled={filteredUsers.length === 0 || loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                >
                  Approve All ({filteredUsers.length})
                </button>
                <button
                  onClick={() => openBulkModal("reject")}
                  disabled={filteredUsers.length === 0 || loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                >
                  Reject All ({filteredUsers.length})
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredUsers.length} of {pendingUsers.length} pending
              users
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading && pendingUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full mx-auto mb-4 h-8 w-8 border-b-2 border-blue-500"></div>

              <p className="text-gray-500">Loading pending users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending users
              </h3>
              <p className="text-gray-500">
                {pendingUsers.length === 0
                  ? "All user requests have been processed."
                  : "No users match your current filters."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((pendingUser) => (
                <div
                  key={pendingUser._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex  lg:flex-row gap-4 flex-col justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-full p-3">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {pendingUser.rmbname}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            <span className="text-sm">{pendingUser.email}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {pendingUser.rmbdistrict},{" "}
                              {pendingUser.rmbprovince}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Shield className="h-3 w-3 mr-1" />
                            {pendingUser.role.charAt(0).toUpperCase() +
                              pendingUser.role.slice(1)}
                          </span>
                          {pendingUser.createdAt && (
                            <span className="ml-2 text-xs text-gray-500">
                              Registered:{" "}
                              {new Date(
                                pendingUser.createdAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center lg:ml-0 ml-16 space-x-3">
                      <button
                        onClick={() =>
                          handleUserApproval(
                            pendingUser._id,
                            true,
                            pendingUser.rmbname
                          )
                        }
                        disabled={processing === pendingUser._id}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleUserApproval(
                            pendingUser._id,
                            false,
                            pendingUser.rmbname
                          )
                        }
                        disabled={processing === pendingUser._id}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                  {processing === pendingUser._id && (
                    <div className="mt-3 flex items-center text-sm text-blue-600">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Action Modal */}
        <BulkActionModal
          isOpen={bulkModal.isOpen}
          onClose={closeBulkModal}
          onConfirm={handleBulkAction}
          action={bulkModal.action}
          userCount={filteredUsers.length}
          loading={loading}
        />
      </div>
    </div>
  );
}
