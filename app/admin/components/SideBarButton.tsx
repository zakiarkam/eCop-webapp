"use client";
import React from "react";

interface Dashboard_Btn {
  onClick?: () => void;
  text: string;
  icon: React.ReactNode;
  isActive?: boolean;
  notificationCount?: number;
}

export default function SideBarButton({
  onClick,
  text,
  icon,
  isActive,
  notificationCount,
}: Dashboard_Btn) {
  return (
    <button
      onClick={onClick}
      className={`h-14 my-2 w-full px-4 flex items-center gap-3 transition-all duration-300 relative ${
        isActive
          ? "bg-[#15134A] text-white "
          : "bg-white text-black hover:bg-gray-100"
      }`}
    >
      <span className={`text-lg ${isActive ? "text-white" : "text-gray-500"}`}>
        {icon}
      </span>
      <span
        className={`text-base font-medium hidden md:inline ${
          isActive ? "text-white" : "text-black"
        }`}
      >
        {text}
      </span>

      {notificationCount !== undefined && notificationCount > 0 && (
        <>
          <span className="md:hidden absolute top-2 left-6 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold z-10">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
          <span className="hidden md:flex absolute top-5 right-3 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] items-center justify-center font-bold z-10">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        </>
      )}
    </button>
  );
}
