"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AdminStats {
  totalLicences: number;
  totalPoliceOfficers: number;
  totalRules: number;
  totalUsers: number;
  pendingApprovals: number;
  activeRules: number;
  expiringSoonLicences: number;
  recentActivity: {
    newLicencesThisMonth: number;
    newOfficersThisMonth: number;
    newUsersThisMonth: number;
  };
}

interface AdminContextType {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || "Failed to fetch stats");
      }
    } catch (err) {
      setError("Failed to fetch admin statistics");
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    await fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminContext.Provider value={{ stats, loading, error, refreshStats }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
