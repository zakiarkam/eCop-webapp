"use client";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

export function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New message from admin" },
    { id: 2, message: "Your profile has been updated" },
    { id: 3, message: "System maintenance scheduled at midnight" },
  ]);

  const handleDelete = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="">
      <div className="flex justify-between bg-gray-300 p-4 items-center mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button
          onClick={handleClearAll}
          className="text-red-500 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      {notifications.length > 0 ? (
        <div className="max-h-60 overflow-y-auto">
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="text-gray-700  px-4 py-2 rounded hover:bg-gray-200 flex justify-between items-center border-b-2 "
              >
                <span>{notification.message}</span>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No new notifications</p>
      )}
    </div>
  );
}
