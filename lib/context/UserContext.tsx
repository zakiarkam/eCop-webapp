"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  role: string;
  isApproved: boolean;
  needsApproval: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        isApproved: session.user.isApproved,
        needsApproval: session.user.needsApproval,
      }
    : null;

  const contextValue: UserContextType = {
    user,
    isLoading: status === "loading",
    isAuthenticated: !!session && !!user,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
