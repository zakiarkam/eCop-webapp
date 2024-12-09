"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineArrowDown } from "react-icons/ai";

export default function LicenceDetailsForm() {
  const [form, setForm] = useState({
    fullName: "",
    nameWithInitials: "",
    dob: "",
    age: "",
    issueDate: "",
    expiryDate: "",
    idNumber: "",
    licenceNumber: "",
    permanentAddress: "",
    vehicleCategories: [""],
    issueDatePerCategory: {} as { [key: string]: string },
    expiryDatePerCategory: {} as { [key: string]: string },
  });

  const [error, setError] = useState("");
  const router = useRouter();

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
      vehicleCategories.length === 0
    ) {
      return "All fields are required.";
    }

    for (const category of vehicleCategories) {
      if (!issueDatePerCategory[category] || !expiryDatePerCategory[category]) {
        return `Please provide issue and expiry dates for category: ${category}.`;
      }
    }

    if (idNumber.length < 10) {
      return "ID number must be at least 10 characters.";
    }

    return null;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    console.log("Form submitted", form);
    // Add form submission logic
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCategorySelect = (e: any) => {
    const { value } = e.target;
    if (!form.vehicleCategories.includes(value)) {
      setForm((prevForm) => ({
        ...prevForm,
        vehicleCategories: [...prevForm.vehicleCategories, value],
        issueDatePerCategory: { ...prevForm.issueDatePerCategory, [value]: "" },
        expiryDatePerCategory: {
          ...prevForm.expiryDatePerCategory,
          [value]: "",
        },
      }));
    }
  };

  const handleCategoryDeselect = (category: string) => {
    setForm((prevForm) => {
      const { [category]: removedIssue, ...remainingIssues } =
        prevForm.issueDatePerCategory;
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

  return (
    <div className="font-[sans-serif]">
      <div className="text-center bg-gradient-to-r from-[#15134A] to-[#6DB6FE] min-h-[180px] sm:p-6 p-4">
        <h4 className="sm:text-3xl text-2xl font-bold pt-6 text-white">
          Add the Details of Licence Holder
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
                placeholder="Enter your full name"
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
                placeholder="Enter your name with initials"
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
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Age</label>
              <input
                name="age"
                type="number"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter your age"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Date of Issue of the licence
              </label>
              <input
                name="issueDate"
                type="date"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                value={form.issueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Date of Expiry of the licence
              </label>
              <input
                name="expiryDate"
                type="date"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                value={form.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Administrative Number (ID No)
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
                licence Number
              </label>
              <input
                name="licenceNumber"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter licence number"
                value={form.licenceNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Permanent Place of Residence
              </label>
              <input
                name="permanentAddress"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter your address"
                value={form.permanentAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <label className="text-gray-800 text-sm mb-2 block">
                Categories of Vehicles
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-gray-100 focus:bg-transparent w-full text-gray-500 text-sm  px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                >
                  {" "}
                  Select the Categories of Vehicle
                  {form.vehicleCategories.length > 0
                    ? form.vehicleCategories.join(", ")
                    : "Select categories"}
                  <span className="ml-2 text-gray-500">
                    {" "}
                    <AiOutlineArrowDown size={18} className="text-gray-500" />
                  </span>
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
                                });
                              } else {
                                handleCategoryDeselect(option);
                              }
                            }}
                            className="form-checkbox h-4 w-4"
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
                      className="text-red-600 text-sm"
                      onClick={() => handleCategoryDeselect(category)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-gray-800 text-sm mb-2 block">
                        Date of Issue
                      </label>
                      <input
                        type="date"
                        className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
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
                        Date of Expiry
                      </label>
                      <input
                        type="date"
                        className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
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
