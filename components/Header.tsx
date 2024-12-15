"use client";

import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import logo from "../public/ecop.svg";
import Settings from "./Settings";
import { useRouter } from "next/router";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSettingsClick = () => {
    console.log("Navigate to Settings page");
  };

  const handleProfileClick = () => {
    console.log("Navigate to Profile page");
  };

  const handleLogoutClick = () => {
    console.log("Perform logout");
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

  return (
    <header className="bg-white shadow-md flex items-center justify-between px-4 py-4">
      <Image
        src={logo}
        alt="logo"
        width={50}
        height={15}
        className="md:mx-20 mx-4"
      ></Image>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 mx-4"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FaUserCircle className="text-2xl" />
          <span className="text-gray-600">John Doe</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 my-3 w-48 bg-white border border-gray-200 rounded shadow-lg">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              <FaUser className="text-gray-600" />
              <span>Profile</span>
            </button>
            <button
              onClick={handleSettingsClick}
              className="flex items-center space-x-2  w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              <FaCog className="text-gray-600" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogoutClick}
              className="flex items-center space-x-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt className="text-gray-600" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
