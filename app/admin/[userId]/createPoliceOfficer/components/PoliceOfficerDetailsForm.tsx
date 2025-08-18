"use client";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import {
  policeOfficerAPI,
  type PoliceOfficerFormData,
} from "@/services/apiServices/policeOfficerApi";

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

export default function PoliceOfficerDetailsForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useUser();

  const [form, setForm] = useState<PoliceOfficerFormData>({
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
    rank: "",
    joiningDate: "",
    bloodGroup: "",
    policePoints: "",
  });

  const [loading, setLoading] = useState(false);

  const rankOptions = [
    "Inspector General of Police (IGP)",
    "Deputy Inspector General (DIG)",
    "Senior Superintendent of Police (SSP)",
    "Superintendent of Police (SP)",
    "Assistant Superintendent of Police (ASP)",
    "Chief Inspector (CI)",
    "Inspector (IP)",
    "Sub Inspector (SI)",
    "Police Sergeant (PS)",
    "Police Constable (PC)",
  ];

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const validateForm = () => {
    const {
      fullName,
      nameWithInitials,
      dob,
      age,
      policeNumber,
      idNumber,
      permanentAddress,
      district,
      policeStation,
      badgeNo,
      phoneNumber,
      rank,
      joiningDate,
      bloodGroup,
    } = form;

    if (
      !fullName ||
      !nameWithInitials ||
      !dob ||
      !age ||
      !policeNumber ||
      !idNumber ||
      !permanentAddress ||
      !district ||
      !policeStation ||
      !badgeNo ||
      !phoneNumber ||
      !rank ||
      !joiningDate ||
      !bloodGroup
    ) {
      return "All fields are required.";
    }

    if (idNumber.length < 10) {
      return "ID number must be at least 10 characters.";
    }

    // Age validation - must be greater than 18
    const ageNumber = parseInt(age);
    if (ageNumber <= 18) {
      return "Age must be greater than 18 years.";
    }

    // Sri Lankan phone number validation
    const phoneRegex = /^(?:\+94|0)(?:7[0-9]{8}|[1-9][1-9][0-9]{7})$/;
    if (!phoneRegex.test(phoneNumber)) {
      return "Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567).";
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

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      enqueueSnackbar(validationError, { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const result = await policeOfficerAPI.createOfficer(form);

      enqueueSnackbar(
        `Police Officer created successfully! Officer ID: ${result.officer?.policeNumber}`,
        { variant: "success" }
      );

      // Reset form
      setForm({
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
        rank: "",
        joiningDate: "",
        bloodGroup: "",
        policePoints: "",
      });

      console.log("Police Officer created successfully:", result);

      setTimeout(() => {
        router.push(`/admin/${user?.id}`);
      }, 2000);
    } catch (error: unknown) {
      console.error("Error submitting licence:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit Police Officer details. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setLoading(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const sortedDistricts = Object.keys(districtToProvince).sort();

  return (
    <div className="font-sans">
      <div className="text-center bg-gradient-to-r from-[#15134A] to-[#6DB6FE] min-h-[200px] p-6">
        <h4 className="text-3xl mt-8 font-bold pt-6 text-white">
          Add the Details of Police Officer
        </h4>
      </div>

      <div className="mx-4 mb-4 -mt-16">
        <div className="max-w-4xl mx-auto mb-4 bg-white shadow-lg p-8 rounded-md">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Name with Initials <span className="text-red-500">*</span>
                </label>
                <input
                  name="nameWithInitials"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter your name with initials"
                  value={form.nameWithInitials}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  name="dob"
                  type="date"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  value={form.dob}
                  onChange={handleDobChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  name="age"
                  type="number"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter your age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  name="bloodGroup"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroupOptions.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Police ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="policeNumber"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter police number"
                  value={form.policeNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  NIC Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="idNumber"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter ID number"
                  value={form.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Badge Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="badgeNo"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter badge number"
                  value={form.badgeNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phoneNumber"
                  type="tel"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter phone number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="permanentAddress"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter your permanent address"
                  value={form.permanentAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
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
                  Province <span className="text-red-500">*</span>
                </label>
                <input
                  name="province"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  value={form.province}
                  readOnly
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Police Station <span className="text-red-500">*</span>
                </label>
                <input
                  name="policeStation"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter police station"
                  value={form.policeStation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Rank <span className="text-red-500">*</span>
                </label>
                <select
                  name="rank"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  value={form.rank}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Rank</option>
                  {rankOptions.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Joining Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="joiningDate"
                  type="date"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  value={form.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 text-sm tracking-wider font-semibold rounded-md w-full text-white bg-[#15134A] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
