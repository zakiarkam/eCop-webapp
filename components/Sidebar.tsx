import PropTypes from "prop-types";
import { FaHome, FaUser, FaCog } from "react-icons/fa";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-blue-600 text-white h-full transition-all duration-300`}
    >
      <button
        className="p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "" : ""}
      </button>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li className="p-2 flex items-center space-x-2">
            <FaHome /> <span className={isOpen ? "" : "hidden"}>Dashboard</span>
          </li>
          <li className="p-2 flex items-center space-x-2">
            <FaUser /> <span className={isOpen ? "" : "hidden"}>Profile</span>
          </li>
          <li className="p-2 flex items-center space-x-2">
            <FaCog /> <span className={isOpen ? "" : "hidden"}>Settings</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
