"use client";
import React from "react";

interface Dashboard_Btn {
  onClick?: () => void;
  text: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export default function SideBarButton({
  onClick,
  text,
  icon,
  isActive,
}: Dashboard_Btn) {
  return (
    <button
      onClick={onClick}
      className={`h-14 my-2 w-full px-4 flex items-center gap-3  transition-all duration-300 ${
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
    </button>
  );
}
