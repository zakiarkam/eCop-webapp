"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AiOutlineHome, AiOutlineArrowLeft } from "react-icons/ai";
import { Search } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="font-[sans-serif] min-h-screen bg-white flex flex-col">
      <div className="text-center bg-gradient-to-r from-[#15134A] to-[#6DB6FE] min-h-[350px] flex items-center justify-center p-6 ">
        <div className="max-w-2xl  mt-8">
          <div className="text-white mb-6">
            <h1 className="text-7xl  font-bold opacity-90 mb-4">404</h1>
            <h2 className="text-3xl  font-bold mb-4">Page Not Found</h2>
            <p className="text-lg opacity-90">
              Oops! The page you&apos;re looking for seems to have wandered off.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 -mt-32">
        <div className="max-w-2xl mx-auto bg-white shadow-[0_2px_13px_-6px_rgba(0,0,0,0.4)] p-8 rounded-md text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#15134A] to-[#6DB6FE] rounded-full flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              What happened?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The page you&apos;re trying to access doesn&apos;t exist or may
              have been moved. Don&apos;t worry, it happens to the best of us!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-[#15134A] to-[#6DB6FE] hover:opacity-90 transition-all"
            >
              <AiOutlineHome size={18} />
              Go to Home
            </button>

            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 text-sm font-semibold rounded-md text-[#15134A] bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <AiOutlineArrowLeft size={18} />
              Go Back
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              If you believe this is an error, please contact our support team.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 left-10 transform -translate-y-1/2 opacity-10">
        <div className="w-32 h-32 bg-gradient-to-r from-[#15134A] to-[#6DB6FE] rounded-full"></div>
      </div>
      <div className="absolute top-1/3 right-10 transform -translate-y-1/2 opacity-10">
        <div className="w-24 h-24 bg-gradient-to-r from-[#6DB6FE] to-[#15134A] rounded-full"></div>
      </div>
    </div>
  );
}
