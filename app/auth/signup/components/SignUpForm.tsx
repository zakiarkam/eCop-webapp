"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSnackbar } from "notistack";

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
  Jaffna: "Northen Province",
  Kilinochi: "Northen Province",
  Mannar: "Northen Province",
  Mullaitivu: "Northen Province",
  Vavuniya: "Northen Province",
  Kurunegala: "North-Western Province",
  Puttalam: "North-Western Province",
};

export default function SignUpForm() {
  const [form, setForm] = useState({
    rmbname: "",
    rmbdistrict: "",
    rmbprovince: "",
    email: "",
    mobilenumber: "",
    password: "",
    confirmpassword: "",
    idnumber: "",
  });

  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const validateForm = () => {
    const {
      rmbname,
      rmbdistrict,
      email,
      mobilenumber,
      password,
      confirmpassword,
      idnumber,
    } = form;

    if (
      !rmbname ||
      !rmbdistrict ||
      !email ||
      !mobilenumber ||
      !password ||
      !confirmpassword ||
      !idnumber
    ) {
      return "All fields are required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (mobilenumber.length !== 10) {
      return "Please enter a valid 10-digit mobile number.";
    }
    if (idnumber.length < 10) {
      return "Please enter a valid ID number.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (password !== confirmpassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      enqueueSnackbar(validationError, { variant: "warning" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/other/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar(
          "Account created successfully! Please login to continue.",
          {
            variant: "success",
            autoHideDuration: 3000,
          }
        );

        // Clear form
        setForm({
          rmbname: "",
          rmbdistrict: "",
          rmbprovince: "",
          email: "",
          mobilenumber: "",
          password: "",
          confirmpassword: "",
          idnumber: "",
        });

        // Redirect after showing success message
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        enqueueSnackbar(
          data.message || "Registration failed. Please try again.",
          {
            variant: "error",
          }
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      enqueueSnackbar(
        "Network error. Please check your connection and try again.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value as keyof typeof districtToProvince;
    setForm({
      ...form,
      rmbdistrict: selectedDistrict,
      rmbprovince: districtToProvince[selectedDistrict] || "",
    });
  };

  const sortedDistricts = Object.keys(districtToProvince).sort();

  return (
    <div className="font-[sans-serif]">
      <div className="text-center bg-gradient-to-r from-[#15134A] to-[#6DB6FE] min-h-[180px] sm:p-6 p-4">
        <h4 className="sm:text-3xl text-2xl font-bold pt-6 text-white">
          Create your Secured account
        </h4>
      </div>

      <div className="mx-4 mb-4 -mt-16">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto mb-4 bg-white shadow-[0_2px_13px_-6px_rgba(0,0,0,0.4)] sm:p-8 p-4 rounded-md"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                RMB Name
              </label>
              <input
                name="rmbname"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter Your name"
                required
                disabled={isSubmitting}
                value={form.rmbname}
                onChange={(e) => setForm({ ...form, rmbname: e.target.value })}
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Email</label>
              <input
                name="email"
                type="email"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter email"
                required
                disabled={isSubmitting}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                RMB District
              </label>
              <select
                name="rmbdistrict"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                required
                disabled={isSubmitting}
                value={form.rmbdistrict}
                onChange={handleDistrictChange}
              >
                <option value="" disabled>
                  Select your district
                </option>
                {sortedDistricts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                RMB Province
              </label>
              <input
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Province will be displayed here"
                value={form.rmbprovince}
                readOnly
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Mobile No
              </label>
              <input
                name="mobilenumber"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter mobile number"
                required
                disabled={isSubmitting}
                value={form.mobilenumber}
                onChange={(e) =>
                  setForm({ ...form, mobilenumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                ID Number
              </label>
              <input
                name="idnumber"
                type="text"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter ID number"
                required
                disabled={isSubmitting}
                value={form.idnumber}
                onChange={(e) => setForm({ ...form, idnumber: e.target.value })}
              />
            </div>

            <div className="relative">
              <label className="text-gray-800 text-sm mb-2 block">
                Password
              </label>
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Enter password"
                required
                disabled={isSubmitting}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <div
                className="absolute top-10 right-3 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <AiOutlineEye size={20} className="text-gray-500" />
                ) : (
                  <AiOutlineEyeInvisible size={20} className="text-gray-500" />
                )}
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-800 text-sm mb-2 block">
                Confirm Password
              </label>
              <input
                name="confirmpassword"
                type={confirmPasswordVisible ? "text" : "password"}
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-[#6DB6FE] transition-all"
                placeholder="Confirm password"
                required
                disabled={isSubmitting}
                value={form.confirmpassword}
                onChange={(e) =>
                  setForm({ ...form, confirmpassword: e.target.value })
                }
              />
              <div
                className="absolute top-10 right-3 cursor-pointer"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? (
                  <AiOutlineEye size={20} className="text-gray-500" />
                ) : (
                  <AiOutlineEyeInvisible size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 text-sm tracking-wider font-semibold rounded-md w-full text-white bg-[#15134A] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Creating Account..." : "Sign up"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="text-[#6DB6FE] hover:text-[#15134A] font-semibold underline"
                disabled={isSubmitting}
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
