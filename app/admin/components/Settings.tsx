"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/context/UserContext";
import { userApiService, UserData } from "@/services/apiServices/userApi";

export default function Settings() {
  const { user, isLoading } = useUser();
  const [userDetails, setUserDetails] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await userApiService.getUserById(user.id);
        setUserDetails(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserDetails();
    }
  }, [user?.id]);

  if (isLoading || loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full mx-auto mb-4 h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-[sans-serif] w-full p-4 bg-gray-100">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="font-[sans-serif] w-full p-4 bg-gray-100">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">No user details found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[sans-serif] w-full p-4 bg-gray-100">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-[#15134A]">
          Account Details
        </h4>
      </div>

      <div className="my-4">
        <div className="w-full bg-white shadow-[0_2px_13px_-6px_rgba(0,0,0,0.4)] sm:p-8 p-4 rounded-md">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-800 text-sm mb-2 block font-semibold">
                RMV Name
              </label>
              <div className="bg-gray-50 w-full text-sm text-gray-800 px-4 py-3 rounded-md border">
                {userDetails.rmbname || "Not provided"}
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block font-semibold">
                Email
              </label>
              <div className="bg-gray-50 w-full text-sm text-gray-800 px-4 py-3 rounded-md border">
                {userDetails.email || "Not provided"}
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block font-semibold">
                Mobile No
              </label>
              <div className="bg-gray-50 w-full text-sm text-gray-800 px-4 py-3 rounded-md border">
                {userDetails.mobilenumber || "Not provided"}
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block font-semibold">
                RMV District
              </label>
              <div className="bg-gray-50 w-full text-sm text-gray-800 px-4 py-3 rounded-md border">
                {userDetails.rmbdistrict || "Not provided"}
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block font-semibold">
                RMV Province
              </label>
              <div className="bg-gray-50 w-full text-sm text-gray-800 px-4 py-3 rounded-md border">
                {userDetails.rmbprovince || "Not provided"}
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block font-semibold">
                ID Number
              </label>
              <div className="bg-gray-50 w-full text-sm text-gray-800 px-4 py-3 rounded-md border">
                {userDetails.idnumber || "Not provided"}
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block font-semibold">
                Role
              </label>
              <div className="bg-gray-50 w-full text-sm text-gray-800 px-4 py-3 rounded-md border">
                {userDetails.role || "Not provided"}
              </div>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block font-semibold">
                Status
              </label>
              <div className="bg-gray-50 w-full text-sm text-gray-800 px-4 py-3 rounded-md border">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userDetails.isApproved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {userDetails.isApproved ? "Approved" : "Pending Approval"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6  ">
            <div className="text-sm text-gray-600">
              {userDetails.approvedAt && (
                <p>
                  Account approved:{" "}
                  {new Date(userDetails.approvedAt).toLocaleDateString()}
                </p>
              )}
              {userDetails.updatedAt && (
                <p>
                  Last updated:{" "}
                  {new Date(userDetails.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
