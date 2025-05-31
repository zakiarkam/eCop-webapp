import React, { useState } from "react";
import UserDataTable from "./UserDataTable";

export default function Administration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  const handleApprovalFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setApprovalFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setApprovalFilter("");
  };

  return (
    <div className="w-full p-4 bg-gray-100 ">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h4 className="text-xl  font-semibold  text-[#15134A]">
            User Management
          </h4>
        </div>{" "}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[100px]">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Users
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE] focus:border-transparent"
              />
            </div>

            <div className="min-w-[150px]">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE] focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="rmvAdmin">rmvAdmin</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="min-w-[150px]">
              <label
                htmlFor="approval"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="approval"
                value={approvalFilter}
                onChange={handleApprovalFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6DB6FE] focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>

            <div>
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {roleFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Role: {roleFilter}
                <button
                  onClick={() => setRoleFilter("")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {approvalFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Status: {approvalFilter === "true" ? "Approved" : "Pending"}
                <button
                  onClick={() => setApprovalFilter("")}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
        {/* Table Section */}
        <div className="bg-white rounded-lg">
          <UserDataTable
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            approvalFilter={approvalFilter}
          />
        </div>
      </div>
    </div>
  );
}
