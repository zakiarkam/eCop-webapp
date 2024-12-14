import PropTypes from "prop-types";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Header({ setIsSidebarOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-md flex items-center justify-between px-4 py-3">
      <button
        className="text-gray-500 hover:text-gray-800"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        ☰
      </button>

      <div className="relative">
        <button
          className="flex items-center space-x-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FaUserCircle className="text-2xl" />
          <span className="text-gray-600">John Doe</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  setIsSidebarOpen: PropTypes.func.isRequired,
};
