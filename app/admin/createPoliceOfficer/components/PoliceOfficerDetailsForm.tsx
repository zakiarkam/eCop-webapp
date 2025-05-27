"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const districtToProvince = {
  Colombo: "Western Province",
  Gampaha: "Western Province",
  Kalutara: "Western Province",
  Kandy: "Central Province",
  Matale: "Central Province",
  NuwaraEliya: "Central Province",
  Galle: "Southern Province",
  Matara: "Southern Province",
  Hambantota: "Southern Province",
  Kegalle: "Sabragamuwa Province",
  Rathnapura: "Sabragamuwa Province",
  Ampara: "Eastern Province",
  Batticaloa: "Eastern Province",
  Trincomalee: "Eastern Province",
  Badulla: "Uva Province",
  Monaragala: "Uva Province",
  Anuradhapura: "North-Central Province",
  Plonnaruwa: "North-Central Province",
  Jaffna: "Northern Province",
  Kilinochi: "Northern Province",
  Mannar: "Northern Province",
  Mullaitivu: "Northern Province",
  Vavuniya: "Northern Province",
  Kurunegala: "North-Western Province",
  Puttalam: "North-Western Province",
};

type PoliceOfficerForm = {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: string;
  policeNumber: string;
  idNumber: string;
  permanentAddress: string;
  district: string;
  province: string;
  policeStation: string;
  badgeNo: string;
  phoneNumber: string;
  email: string;
};

export default function PoliceOfficerDetailsForm() {
  const [form, setForm] = useState<PoliceOfficerForm>({
    fullName: "",
    nameWithInitials: "",
    dob: "",
    age: "",
    policeNumber: "",
    idNumber: "",
    permanentAddress: "",
    district: "",
    province: "",
    policeStation: "",
    badgeNo: "",
    phoneNumber: "",
    email: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    const {
      fullName,
      nameWithInitials,
      dob,
      policeNumber,
      idNumber,
      permanentAddress,
      district,
      policeStation,
      badgeNo,
      phoneNumber,
      email,
    } = form;

    if (
      !fullName ||
      !nameWithInitials ||
      !dob ||
      !policeNumber ||
      !idNumber ||
      !permanentAddress ||
      !district ||
      !policeStation ||
      !badgeNo ||
      !phoneNumber ||
      !email
    ) {
      return "All fields are required.";
    }

    if (idNumber.length < 10) {
      return "ID number must be at least 10 characters.";
    }

    // Phone number validation (Sri Lankan format)
    const phoneRegex = /^(?:\+94|0)?[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      return "Please enter a valid phone number.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      dob: value,
      age: calculateAge(value).toString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("/api/police/officer/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard"); // Adjust the route as needed
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value as keyof typeof districtToProvince;
    setForm({
      ...form,
      district: selectedDistrict,
      province: districtToProvince[selectedDistrict] || "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const sortedDistricts = Object.keys(districtToProvince).sort();

  return (
    <div className="font-[sans-serif]">
      <div className="text-center bg-gradient-to-r from-[#15134A] to-[#6DB6FE] min-h-[200px] sm:p-6 p-4">
        <h4 className="sm:text-3xl text-2xl mt-8 font-bold pt-6 text-white">
          Add Police Officer Details
        </h4>
      </div>

      <div className="mx-4 mb-4 -mt-16">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto mb-4 bg-white shadow-[0_2px_13px_-6px_rgba(0,0,0,0.4)] sm:p-8 p-4 rounded-md"
        >
          {error && (
            <div className="my-4 text-red-600 text-center">{error}</div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Name with Initials
              </label>
              <input
                name="nameWithInitials"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter name with initials"
                value={form.nameWithInitials}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                value={form.dob}
                onChange={handleDobChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Age</label>
              <input
                name="age"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                value={form.age}
                readOnly
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="tel"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter phone number"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Police Number
              </label>
              <input
                name="policeNumber"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter police number"
                value={form.policeNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                ID Number
              </label>
              <input
                name="idNumber"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter ID number"
                value={form.idNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Permanent Address
              </label>
              <input
                name="permanentAddress"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter permanent address"
                value={form.permanentAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                District
              </label>
              <select
                name="district"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                value={form.district}
                onChange={handleDistrictChange}
                required
              >
                <option value="">Select district</option>
                {sortedDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Province
              </label>
              <input
                name="province"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                value={form.province}
                readOnly
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Police Station
              </label>
              <input
                name="policeStation"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter police station"
                value={form.policeStation}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Badge Number
              </label>
              <input
                name="badgeNo"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter badge number"
                value={form.badgeNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="py-3 px-6 text-sm tracking-wider font-semibold rounded-md w-full text-white bg-[#15134A] hover:opacity-80"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
