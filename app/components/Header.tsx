"use client";

import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaUser, FaSignOutAlt, FaBell } from "react-icons/fa";
import { signOut } from "next-auth/react";
import Image from "next/image";
import logo from "../../public/ecop.svg";
import { useUser } from "../../lib/context/UserContext";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user, isAuthenticated, isLoading } = useUser();

  const handleProfileClick = () => {
    console.log("Navigate to Profile page");
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <header className="bg-white shadow-md flex items-center justify-between px-4 py-4">
        <Image
          src={logo}
          alt="logo"
          width={50}
          height={15}
          className="md:mx-20 mx-4"
        />
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md flex items-center justify-between px-4 py-2 absolute top-0 left-0 w-full z-50">
      <Image
        src={logo}
        alt="logo"
        width={50}
        height={15}
        className="md:mx-20 mx-4"
      />

      {isAuthenticated && user && (
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 mx-4 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUserCircle className="text-2xl text-gray-600" />
              <div className="flex flex-col items-start">
                <span className="text-gray-800 font-medium">
                  {user.email.split("@")[0]}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user.role}
                </span>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0  w-60 bg-white border border-gray-200 rounded shadow-lg z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    Role: {user.role}
                  </p>
                  {user.role === "rmvAdmin" && (
                    <p className="text-xs mt-1">
                      Status:{" "}
                      {user.isApproved ? (
                        <span className="text-green-600">Approved</span>
                      ) : (
                        <span className="text-yellow-600">
                          Pending Approval
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaUser className="text-gray-600" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={handleLogoutClick}
                  className="flex items-center space-x-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
                >
                  <FaSignOutAlt className="text-gray-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
