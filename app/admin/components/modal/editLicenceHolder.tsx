"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useSnackbar } from "notistack";
import licenceService, {
  LicenceHolder,
  UpdateLicenceData,
} from "@/services/apiServices/licenceApi";

interface EditLicenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenceId: string;
  onSuccess: (updatedLicence: LicenceHolder) => void;
}

interface FormData {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: string;
  issueDate: string;
  expiryDate: string;
  idNumber: string;
  licenceNumber: string;
  permanentAddress: string;
  currentAddress: string;
  bloodGroup: string;
  phoneNumber: string;
  licencePoints: number;
  vehicleCategories: string[];
  issueDatePerCategory: Record<string, string>;
  expiryDatePerCategory: Record<string, string>;
}

const vehicleCategoryOptions = [
  "A1",
  "A",
  "B1",
  "B",
  "C1",
  "C",
  "CE",
  "D1",
  "D",
  "DE",
  "G1",
  "G",
  "J",
];

const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function EditLicenceModal({
  isOpen,
  onClose,
  licenceId,
  onSuccess,
}: EditLicenceModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] =
    useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    nameWithInitials: "",
    dob: "",
    age: "",
    issueDate: "",
    expiryDate: "",
    idNumber: "",
    licenceNumber: "",
    permanentAddress: "",
    currentAddress: "",
    bloodGroup: "",
    phoneNumber: "",
    licencePoints: 0,
    vehicleCategories: [],
    issueDatePerCategory: {},
    expiryDatePerCategory: {},
  });

  const { enqueueSnackbar } = useSnackbar();

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex =
      /^(\+94|94|0)?(70|71|72|74|75|76|77|78|91|92|93|94|95|96|97|98|99)\d{7}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
  };

  const validateDateOrder = (issueDate: string, expiryDate: string) => {
    if (!issueDate || !expiryDate) return true;
    const issue = new Date(issueDate);
    const expiry = new Date(expiryDate);
    return expiry > issue;
  };

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return m < 0 || (m === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
  };

  const validateForm = () => {
    const {
      fullName,
      nameWithInitials,
      dob,
      age,
      issueDate,
      expiryDate,
      idNumber,
      licenceNumber,
      permanentAddress,
      currentAddress,
      bloodGroup,
      phoneNumber,
      vehicleCategories,
      issueDatePerCategory,
      expiryDatePerCategory,
    } = formData;

    // Check required fields
    if (
      !fullName ||
      !nameWithInitials ||
      !dob ||
      !age ||
      !issueDate ||
      !expiryDate ||
      !idNumber ||
      !licenceNumber ||
      !permanentAddress ||
      !currentAddress ||
      !bloodGroup ||
      !phoneNumber ||
      vehicleCategories.length === 0
    ) {
      return "All fields are required.";
    }

    // Age validation
    const ageNumber = parseInt(age);
    if (ageNumber < 18) {
      return "Age must be 18 or above to hold a driving licence.";
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return "Please enter a valid Sri Lankan phone number (e.g., 0771234567, +94771234567).";
    }

    if (!validateDateOrder(issueDate, expiryDate)) {
      return "Date of Expiry must be after Date of Issue of the licence.";
    }

    for (const category of vehicleCategories) {
      if (!issueDatePerCategory[category] || !expiryDatePerCategory[category]) {
        return `Please provide issue and expiry dates for category: ${category}.`;
      }

      if (
        !validateDateOrder(
          issueDatePerCategory[category],
          expiryDatePerCategory[category]
        )
      ) {
        return `Date of Expiry must be after Date of Issue for category: ${category}.`;
      }
    }

    if (idNumber.length < 10) {
      return "ID number must be at least 10 characters.";
    }

    return null;
  };

  useEffect(() => {
    const available = vehicleCategoryOptions.filter(
      (category) => !formData.vehicleCategories.includes(category)
    );
    setAvailableCategories(available);
    setSelectedCategoryToAdd(available[0] || "");
  }, [formData.vehicleCategories]);

  useEffect(() => {
    if (isOpen && licenceId) {
      fetchLicenceData();
    }
  }, [isOpen, licenceId]);

  const fetchLicenceData = async () => {
    setFetchingData(true);
    try {
      const result = await licenceService.getLicenceHolderById(licenceId);

      if (result.success && result.data) {
        const licence = result.data;

        // Format dates for input fields
        const formatDateForInput = (dateString: string) => {
          if (!dateString) return "";
          return new Date(dateString).toISOString().split("T")[0];
        };

        // Prepare vehicle category data
        const categories = licence.vehicleCategories.map(
          (vc: any) => vc.category
        );
        const issueDates: Record<string, string> = {};
        const expiryDates: Record<string, string> = {};

        licence.vehicleCategories.forEach((vc: any) => {
          issueDates[vc.category] = formatDateForInput(vc.issueDate);
          expiryDates[vc.category] = formatDateForInput(vc.expiryDate);
        });

        setFormData({
          fullName: licence.fullName || "",
          nameWithInitials: licence.nameWithInitials || "",
          dob: formatDateForInput(licence.dob),
          age: licence.age?.toString() || "",
          issueDate: formatDateForInput(licence.issueDate),
          expiryDate: formatDateForInput(licence.expiryDate),
          idNumber: licence.idNumber || "",
          licenceNumber: licence.licenceNumber || "",
          permanentAddress: licence.permanentAddress || "",
          currentAddress: licence.currentAddress || "",
          bloodGroup: licence.bloodGroup || "",
          phoneNumber: licence.phoneNumber || "",
          licencePoints: licence.licencePoints,
          vehicleCategories: categories,
          issueDatePerCategory: issueDates,
          expiryDatePerCategory: expiryDates,
        });
      } else {
        enqueueSnackbar("Failed to fetch licence data", { variant: "error" });
        onClose();
      }
    } catch (error: unknown) {
      console.error("Error fetching licence:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error fetching licence data. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
      onClose();
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-calculate age when date of birth changes
    if (name === "dob" && value) {
      const calculatedAge = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        age: calculatedAge.toString(),
      }));
    }
  };

  const addVehicleCategory = () => {
    if (!selectedCategoryToAdd) {
      enqueueSnackbar("Please select a category to add", {
        variant: "warning",
      });
      return;
    }

    if (formData.vehicleCategories.includes(selectedCategoryToAdd)) {
      enqueueSnackbar("Category already exists", { variant: "warning" });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      vehicleCategories: [...prev.vehicleCategories, selectedCategoryToAdd],
      issueDatePerCategory: {
        ...prev.issueDatePerCategory,
        [selectedCategoryToAdd]: "",
      },
      expiryDatePerCategory: {
        ...prev.expiryDatePerCategory,
        [selectedCategoryToAdd]: "",
      },
    }));

    enqueueSnackbar(`Category ${selectedCategoryToAdd} added`, {
      variant: "success",
    });
  };

  const removeVehicleCategory = (categoryToRemove: string) => {
    setFormData((prev) => {
      const newCategories = prev.vehicleCategories.filter(
        (category) => category !== categoryToRemove
      );

      const newIssueDates = { ...prev.issueDatePerCategory };
      const newExpiryDates = { ...prev.expiryDatePerCategory };

      delete newIssueDates[categoryToRemove];
      delete newExpiryDates[categoryToRemove];

      return {
        ...prev,
        vehicleCategories: newCategories,
        issueDatePerCategory: newIssueDates,
        expiryDatePerCategory: newExpiryDates,
      };
    });

    enqueueSnackbar(`Category ${categoryToRemove} removed`, {
      variant: "info",
    });
  };

  const handleCategoryDateChange = (
    category: string,
    type: "issue" | "expiry",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type === "issue" ? "issueDatePerCategory" : "expiryDatePerCategory"]: {
        ...prev[
          type === "issue" ? "issueDatePerCategory" : "expiryDatePerCategory"
        ],
        [category]: value,
      },
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
      const updateData: UpdateLicenceData = {
        fullName: formData.fullName,
        nameWithInitials: formData.nameWithInitials,
        dob: formData.dob,
        age: formData.age,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        idNumber: formData.idNumber,
        licenceNumber: formData.licenceNumber,
        permanentAddress: formData.permanentAddress,
        currentAddress: formData.currentAddress,
        bloodGroup: formData.bloodGroup,
        phoneNumber: formData.phoneNumber,
        licencePoints: formData.licencePoints,
        vehicleCategories: formData.vehicleCategories,
        issueDatePerCategory: formData.issueDatePerCategory,
        expiryDatePerCategory: formData.expiryDatePerCategory,
      };

      const result = await licenceService.updateLicenceHolder(
        licenceId,
        updateData
      );

      if (result.licence) {
        enqueueSnackbar("Licence updated successfully", { variant: "success" });

        // Fetch updated data
        const updatedResult = await licenceService.getLicenceHolderById(
          licenceId
        );
        if (updatedResult.success && updatedResult.data) {
          onSuccess(updatedResult.data);
        }

        onClose();
      } else {
        enqueueSnackbar(result.message || "Failed to update licence", {
          variant: "error",
        });
      }
    } catch (error: unknown) {
      console.error("Error updating licence:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error updating licence. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className=" bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="fixed inset-0 transition-opacity  " onClick={onClose} />

        <div className="inline-block w-full max-w-4xl p-8  overflow-hidden text-left align-middle transition-all transform ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Licence
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {fetchingData ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading licence data...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name with Initials <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameWithInitials"
                    value={formData.nameWithInitials}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="18"
                    max="100"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number (e.g., 0771234567)"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                    minLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Licence Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenceNumber"
                    value={formData.licenceNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Licence Points <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="licencePoints"
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter licence points (0-100)"
                    value={formData.licencePoints}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroupOptions.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permanent Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Vehicle Categories <span className="text-red-500">*</span>
                </label>

                <div className="mb-4">
                  <div className="flex items-center space-x-3">
                    <select
                      value={selectedCategoryToAdd}
                      onChange={(e) => setSelectedCategoryToAdd(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={availableCategories.length === 0}
                    >
                      {availableCategories.length === 0 ? (
                        <option value="">All categories added</option>
                      ) : (
                        availableCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={addVehicleCategory}
                      disabled={availableCategories.length === 0}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Category
                    </button>
                  </div>
                  {availableCategories.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      All available categories have been added
                    </p>
                  )}
                </div>

                {/* Current Categories */}
                {formData.vehicleCategories.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Current Categories ({formData.vehicleCategories.length}):
                    </h4>
                    {formData.vehicleCategories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md border"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {category}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVehicleCategory(category)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                            title={`Remove category ${category}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Issue Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={
                                formData.issueDatePerCategory[category] || ""
                              }
                              onChange={(e) =>
                                handleCategoryDateChange(
                                  category,
                                  "issue",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Expiry Date{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={
                                formData.expiryDatePerCategory[category] || ""
                              }
                              onChange={(e) =>
                                handleCategoryDateChange(
                                  category,
                                  "expiry",
                                  e.target.value
                                )
                              }
                              required
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">
                      No vehicle categories added
                    </p>
                    <p className="text-sm text-gray-400">
                      Add at least one category to continue
                    </p>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.vehicleCategories.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  {loading ? "Updating..." : "Update Licence"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
