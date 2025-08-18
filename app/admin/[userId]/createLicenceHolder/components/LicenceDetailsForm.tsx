"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import licenceService, {
  CreateLicenceData,
} from "@/services/apiServices/licenceApi";

type LicenceFormType = {
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
  issueDatePerCategory: { [key: string]: string };
  expiryDatePerCategory: { [key: string]: string };
};

export default function LicenceDetailsForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useUser();
  const [form, setForm] = useState<LicenceFormType>({
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
    licencePoints: 100,
    vehicleCategories: [],
    issueDatePerCategory: {},
    expiryDatePerCategory: {},
  });
  const [loading, setLoading] = useState(false);

  const vehicleOptions = [
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

  // Phone number validation function
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex =
      /^(\+94|94|0)?(70|71|72|74|75|76|77|78|91|92|93|94|95|96|97|98|99)\d{7}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
  };

  // Date validation function
  const validateDateOrder = (issueDate: string, expiryDate: string) => {
    if (!issueDate || !expiryDate) return true;
    const issue = new Date(issueDate);
    const expiry = new Date(expiryDate);
    return expiry > issue;
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
    } = form;

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

    const ageNumber = parseInt(age);
    if (ageNumber < 18) {
      return "Age must be 18 or above to obtain a driving licence.";
    }

    // Phone number validation
    if (!validatePhoneNumber(phoneNumber)) {
      return "Please enter a valid Sri Lankan phone number (e.g., 0771234567, +94771234567).";
    }

    // Date validation for main licence
    if (!validateDateOrder(issueDate, expiryDate)) {
      return "Date of Expiry must be after Date of Issue of the licence.";
    }

    // Date validation for each vehicle category
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
      const formData = { ...form, licencePoints: 100 };

      const result = await licenceService.createLicenceHolder(
        formData as CreateLicenceData
      );

      enqueueSnackbar(
        `Licence created successfully! Licence ID: ${result.licence?.licenceNumber}`,
        { variant: "success" }
      );

      setForm({
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
        licencePoints: 100, // Reset to 100
        vehicleCategories: [],
        issueDatePerCategory: {},
        expiryDatePerCategory: {},
      });

      console.log("Licence created successfully:", result);
      setTimeout(() => {
        router.push(`/admin/${user?.id}`);
      }, 2000);
    } catch (error: unknown) {
      console.error("Error submitting licence:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit licence details. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Don't allow manual changes to licencePoints
    if (name === "licencePoints") return;

    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (!form.vehicleCategories.includes(value)) {
      setForm((prevForm) => ({
        ...prevForm,
        vehicleCategories: [...prevForm.vehicleCategories, value],
        issueDatePerCategory: {
          ...prevForm.issueDatePerCategory,
          [value]: prevForm.issueDate || "",
        },
        expiryDatePerCategory: {
          ...prevForm.expiryDatePerCategory,
          [value]: prevForm.expiryDate || "",
        },
      }));
    }
  };

  const handleCategoryDeselect = (category: string) => {
    setForm((prevForm) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [category]: removedIssue, ...remainingIssues } =
        prevForm.issueDatePerCategory;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [category]: removedExpiry, ...remainingExpiries } =
        prevForm.expiryDatePerCategory;
      return {
        ...prevForm,
        vehicleCategories: prevForm.vehicleCategories.filter(
          (cat) => cat !== category
        ),
        issueDatePerCategory: remainingIssues,
        expiryDatePerCategory: remainingExpiries,
      };
    });
  };

  const handleCategoryDateChange = (
    category: string,
    field: "issueDatePerCategory" | "expiryDatePerCategory",
    value: string
  ) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: {
        ...prevForm[field],
        [category]: value,
      },
    }));
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="font-sans">
      <div className="text-center bg-gradient-to-r from-[#15134A] to-[#6DB6FE] min-h-[200px] p-6">
        <h4 className="text-3xl mt-8 font-bold pt-6 text-white">
          Add the Details of Licence Holder
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
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phoneNumber"
                  type="tel"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter phone number (e.g., 0771234567)"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  NIC Number (ID No) <span className="text-red-500">*</span>
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
                  Current Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="currentAddress"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter your current address"
                  value={form.currentAddress}
                  onChange={handleChange}
                  required
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
                  Licence Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="licenceNumber"
                  type="text"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  placeholder="Enter licence number"
                  value={form.licenceNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Date of Issue of the licence{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="issueDate"
                  type="date"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  value={form.issueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Date of Expiry of the licence{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="expiryDate"
                  type="date"
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                  value={form.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Hidden Licence Points - Always 100 */}
              <input name="licencePoints" type="hidden" value={100} />

              {/* Vehicle Categories */}
              <div className="relative">
                <label className="text-gray-800 text-sm mb-2 block">
                  Categories of Vehicles <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className="bg-gray-100 focus:bg-transparent w-full text-gray-500 text-sm px-4 py-3 rounded-md outline-blue-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {form.vehicleCategories.length > 0
                          ? `${form.vehicleCategories.length} ${
                              form.vehicleCategories.length === 1
                                ? "category"
                                : "categories"
                            } selected`
                          : "Select categories"}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto">
                      <ul className="p-2">
                        {vehicleOptions.map((option) => (
                          <li key={option} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`category-${option}`}
                              value={option}
                              checked={form.vehicleCategories.includes(option)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleCategorySelect({
                                    target: { value: option },
                                  } as any);
                                } else {
                                  handleCategoryDeselect(option);
                                }
                              }}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                            <label
                              htmlFor={`category-${option}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {option}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Vehicle Category Details */}
            {form.vehicleCategories.length > 0 && (
              <div className="mt-4 space-y-4">
                {form.vehicleCategories.map((category) => (
                  <div key={category} className="p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">
                        {category}
                      </span>
                      <button
                        type="button"
                        className="text-red-600 text-sm hover:text-red-800"
                        onClick={() => handleCategoryDeselect(category)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="text-gray-800 text-sm mb-2 block">
                          Date of Issue <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                          value={form.issueDatePerCategory[category] || ""}
                          onChange={(e) =>
                            handleCategoryDateChange(
                              category,
                              "issueDatePerCategory",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-gray-800 text-sm mb-2 block">
                          Date of Expiry <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                          value={form.expiryDatePerCategory[category] || ""}
                          onChange={(e) =>
                            handleCategoryDateChange(
                              category,
                              "expiryDatePerCategory",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
