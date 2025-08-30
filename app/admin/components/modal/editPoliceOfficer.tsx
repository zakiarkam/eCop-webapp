"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSnackbar } from "notistack";
import {
  PoliceOfficer,
  policeOfficerAPI,
  PoliceOfficerFormData,
} from "@/services/apiServices/policeOfficerApi";

interface EditPoliceOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  officerId: string;
  onSuccess: (updatedOfficer: PoliceOfficer) => void;
}

export default function EditPoliceOfficerModal({
  isOpen,
  onClose,
  officerId,
  onSuccess,
}: EditPoliceOfficerModalProps) {
  const [formData, setFormData] = useState<PoliceOfficerFormData>({
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
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { enqueueSnackbar } = useSnackbar();

  // Fetch officer data when modal opens
  useEffect(() => {
    if (isOpen && officerId) {
      fetchOfficerData();
    }
  }, [isOpen, officerId]);

  const fetchOfficerData = async () => {
    setFetchLoading(true);
    try {
      const result = await policeOfficerAPI.getOfficer(officerId);

      if (result.success && result.data) {
        const officer = result.data;
        setFormData({
          fullName: officer.fullName || "",
          nameWithInitials: officer.nameWithInitials || "",
          dob: officer.dob
            ? new Date(officer.dob).toISOString().split("T")[0]
            : "",
          age: officer.age?.toString() || "",
          policeNumber: officer.policeNumber || "",
          idNumber: officer.idNumber || "",
          permanentAddress: officer.permanentAddress || "",
          district: officer.district || "",
          province: officer.province || "",
          policeStation: officer.policeStation || "",
          badgeNo: officer.badgeNo || "",
          phoneNumber: officer.phoneNumber || "",
          rank: officer.rank || "",
          joiningDate: officer.joiningDate
            ? new Date(officer.joiningDate).toISOString().split("T")[0]
            : "",
          bloodGroup: officer.bloodGroup || "",
          policePoints: officer.policePoints || "",
        });
      } else {
        enqueueSnackbar(result.message || "Failed to fetch officer data", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching officer:", error);
      enqueueSnackbar("Error loading officer data", { variant: "error" });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: PoliceOfficerFormData) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.nameWithInitials.trim())
      newErrors.nameWithInitials = "Name with initials is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.policeNumber.trim())
      newErrors.policeNumber = "Police number is required";
    if (!formData.idNumber.trim()) newErrors.idNumber = "ID number is required";
    if (!formData.permanentAddress.trim())
      newErrors.permanentAddress = "Permanent address is required";
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (!formData.province.trim()) newErrors.province = "Province is required";
    if (!formData.policeStation.trim())
      newErrors.policeStation = "Police station is required";
    if (!formData.badgeNo.trim())
      newErrors.badgeNo = "Badge number is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.rank.trim()) newErrors.rank = "Rank is required";
    if (!formData.joiningDate)
      newErrors.joiningDate = "Joining date is required";
    if (!formData.bloodGroup.trim())
      newErrors.bloodGroup = "Blood group is required";

    if (formData.idNumber && formData.idNumber.length < 10) {
      newErrors.idNumber = "ID number must be at least 10 characters";
    }

    const phoneRegex = /^(?:\+94|0)(?:7[0-9]{8}|[1-9][1-9][0-9]{7})$/;
    if (
      formData.phoneNumber &&
      !phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber =
        "Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567)";
    }

    if (
      formData.age &&
      (isNaN(Number(formData.age)) ||
        Number(formData.age) <= 18 ||
        Number(formData.age) > 70)
    ) {
      newErrors.age = "Age must be greater than 18 and not exceed 70";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        age: parseInt(formData.age, 10).toString(),
      };

      const result = await policeOfficerAPI.updateOfficer(
        officerId,
        updateData
      );

      if (result.success) {
        enqueueSnackbar(
          result.message || "Police officer updated successfully",
          {
            variant: "success",
          }
        );
        onSuccess(result.data!);
        onClose();
      } else {
        enqueueSnackbar(result.message || "Failed to update police officer", {
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error("Error updating officer:", error);
      enqueueSnackbar(error.message || "Error updating police officer", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Police Officer
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {fetchLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading officer data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name with Initials *
                </label>
                <input
                  type="text"
                  name="nameWithInitials"
                  value={formData.nameWithInitials}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nameWithInitials
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.nameWithInitials && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nameWithInitials}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dob ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="70"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                )}
              </div>

              {/* Police Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Police Number *
                </label>
                <input
                  type="text"
                  name="policeNumber"
                  value={formData.policeNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.policeNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.policeNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.policeNumber}
                  </p>
                )}
              </div>

              {/* ID Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number *
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.idNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.idNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.district ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.district && (
                  <p className="text-red-500 text-xs mt-1">{errors.district}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province *
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.province ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.province && (
                  <p className="text-red-500 text-xs mt-1">{errors.province}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Police Station *
                </label>
                <input
                  type="text"
                  name="policeStation"
                  value={formData.policeStation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.policeStation ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.policeStation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.policeStation}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Number *
                </label>
                <input
                  type="text"
                  name="badgeNo"
                  value={formData.badgeNo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.badgeNo ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.badgeNo && (
                  <p className="text-red-500 text-xs mt-1">{errors.badgeNo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="0771234567"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rank *
                </label>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rank ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Rank</option>
                  <option value="Inspector General of Police (IGP)">
                    Inspector General of Police (IGP)
                  </option>
                  <option value="Deputy Inspector General (DIG)">
                    Deputy Inspector General (DIG)
                  </option>
                  <option value="Senior Superintendent of Police (SSP)">
                    Senior Superintendent of Police (SSP)
                  </option>
                  <option value="Superintendent of Police (SP)">
                    Superintendent of Police (SP)
                  </option>
                  <option value="Assistant Superintendent of Police (ASP)">
                    Assistant Superintendent of Police (ASP)
                  </option>
                  <option value="Chief Inspector (CI)">
                    Chief Inspector (CI)
                  </option>
                  <option value="Inspector (IP)">Inspector (IP)</option>
                  <option value="Sub Inspector (SI)">Sub Inspector (SI)</option>
                  <option value="Police Sergeant (PS)">
                    Police Sergeant (PS)
                  </option>
                  <option value="Police Constable (PC)">
                    Police Constable (PC)
                  </option>
                </select>
                {errors.rank && (
                  <p className="text-red-500 text-xs mt-1">{errors.rank}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date *
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.joiningDate ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.joiningDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.joiningDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.bloodGroup ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodGroup && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.bloodGroup}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permanent Address *
                </label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.permanentAddress
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.permanentAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.permanentAddress}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {loading ? "Updating..." : "Update Officer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
