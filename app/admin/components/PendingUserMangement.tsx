"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  Check,
  X,
  User,
  Mail,
  MapPin,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useSnackbar } from "notistack";

interface PendingUser {
  _id: string;
  rmbname: string;
  email: string;
  rmbdistrict: string;
  rmbprovince: string;
  role: string;
  createdAt?: string;
}

export default function PendingUsersManagement() {
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchPendingUsers();
    }
  }, [session]);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = pendingUsers;

    // Search filter
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
      const response = await fetch("/api/admin/pending-users");
      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data.pendingUsers || []);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
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
      const response = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, approved }),
      });

      if (response.ok) {
        setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
        const action = approved ? "approved" : "rejected";
        enqueueSnackbar(`${userName} has been ${action} successfully!`, {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Error processing request. Please try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error processing user approval:", error);
      enqueueSnackbar("Error processing request. Please try again.", {
        variant: "error",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    if (filteredUsers.length === 0) return;

    const confirmMessage = `Are you sure you want to ${action} all ${filteredUsers.length} filtered users?`;
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const promises = filteredUsers.map((user) =>
        handleUserApproval(user._id, action === "approve", user.rmbname)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Error in bulk action:", error);
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.role !== "admin") {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pending User Approvals
              </h1>
              <p className="text-gray-600 mt-1">
                Review and manage user registration requests
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchPendingUsers}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                {pendingUsers.length} Pending
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg  focus:border-transparent"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction("approve")}
                disabled={filteredUsers.length === 0 || loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
              >
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                disabled={filteredUsers.length === 0 || loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
              >
                Reject All
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredUsers.length} of {pendingUsers.length} pending
            users
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading && pendingUsers.length === 0 ? (
            <div className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
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
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-full p-3">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.rmbname}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {user.rmbdistrict}, {user.rmbprovince}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handleUserApproval(user._id, true, user.rmbname)
                        }
                        disabled={processing === user._id}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleUserApproval(user._id, false, user.rmbname)
                        }
                        disabled={processing === user._id}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>

                  {processing === user._id && (
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
      </div>
    </div>
  );
}
