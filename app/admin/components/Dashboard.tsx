"use client";

import React from "react";
import {
  Users,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  Shield,
  Car,
  BookOpen,
} from "lucide-react";
import { useAdmin } from "../AdminContext";

const Dashboard: React.FC = () => {
  const { stats, loading, error, refreshStats } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
          <button
            onClick={refreshStats}
            className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: number;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +{trend} this month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const AlertCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    description: string;
  }> = ({ title, value, icon, color, description }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
          <h3 className="text-md font-semibold text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl  font-semibold text-[#15134A]">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Licences"
          value={stats.totalLicences}
          icon={<Car className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend={stats.recentActivity.newLicencesThisMonth}
        />
        <StatCard
          title="Police Officers"
          value={stats.totalPoliceOfficers}
          icon={<Shield className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend={stats.recentActivity.newOfficersThisMonth}
        />
        <StatCard
          title="Total Rules"
          value={stats.totalRules}
          icon={<BookOpen className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="System Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend={stats.recentActivity.newUsersThisMonth}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<UserCheck className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
          description="Users waiting for approval"
        />
        <AlertCard
          title="Expiring Soon"
          value={stats.expiringSoonLicences}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color="bg-red-500"
          description="Licences expiring in 30 days"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Monthly Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Car className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900">New Licences</h3>
            <p className="text-2xl font-bold text-blue-600">
              {stats.recentActivity.newLicencesThisMonth}
            </p>
            <p className="text-sm text-blue-700">This month</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900">
              New Police Officers
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.recentActivity.newOfficersThisMonth}
            </p>
            <p className="text-sm text-green-700">This month</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-orange-900">New RMD Admin</h3>
            <p className="text-2xl font-bold text-orange-600">
              {stats.recentActivity.newUsersThisMonth}
            </p>
            <p className="text-sm text-orange-700">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
