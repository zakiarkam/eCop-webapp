"use client";
import React, { useState } from "react";
import { AiFillEdit, AiFillCheckSquare } from "react-icons/ai";

export default function Settings() {
  const [form, setForm] = useState({
    rmbname: "Kamal",
    rmbdistrict: "Colombo",
    rmbprovince: "Western Province",
    email: "kamal@example.com",
    mobilenumber: "0712345678",
    idnumber: "123456789V",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.mobilenumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setIsEditing(false);
    alert("Changes saved successfully!");
  };

  return (
    <div className="font-[sans-serif]w-full p-4 bg-gray-100">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#15134A]">
          Account Settings
        </h2>
      </div>

      <div className="my-4">
        <div className="w-full  bg-white shadow-[0_2px_13px_-6px_rgba(0,0,0,0.4)] sm:p-8 p-4  rounded-md">
          {!!error && (
            <div className="my-4 text-red-600 text-center">{error}</div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                RMB Name
              </label>
              <input
                type="text"
                className={`bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE]transition-all ${
                  isEditing ? "border border-gray-400" : ""
                }`}
                value={form.rmbname}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, rmbname: e.target.value })}
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Email</label>
              <input
                type="email"
                className={`bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE]transition-all ${
                  isEditing ? "border border-gray-400" : ""
                }`}
                value={form.email}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Mobile No
              </label>
              <input
                type="text"
                className={`bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE]transition-all ${
                  isEditing ? "border border-gray-400" : ""
                }`}
                value={form.mobilenumber}
                readOnly={!isEditing}
                onChange={(e) =>
                  setForm({ ...form, mobilenumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                RMB District
              </label>
              <input
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE]transition-all"
                value={form.rmbdistrict}
                readOnly
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                RMB Province
              </label>
              <input
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE]transition-all"
                value={form.rmbprovince}
                readOnly
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                ID Number
              </label>
              <input
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE]transition-all"
                value={form.idnumber}
                readOnly
              />
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            {!isEditing ? (
              <button
                className="py-2 px-6 text-sm tracking-wider font-semibold rounded-md text-white bg-[#6DB6FE] hover:opacity-80 flex items-center"
                onClick={() => setIsEditing(true)}
              >
                <AiFillEdit className="mr-2" /> Edit
              </button>
            ) : (
              <button
                className="py-2 px-6 text-sm tracking-wider font-semibold rounded-md text-white bg-green-600 hover:opacity-80 flex items-center"
                onClick={handleSave}
              >
                <AiFillCheckSquare className="mr-2" /> Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
