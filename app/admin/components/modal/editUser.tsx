import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";

type UserData = {
  id: string;
  rmbname: string;
  rmbdistrict: string;
  rmbprovince: string;
  email: string;
  mobilenumber: string;
  idnumber: string;
  role: string;
  isApproved: boolean;
  approvedAt: string;
  updatedAt: string;
};

interface EditUserModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserData) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserData>({
    id: "",
    rmbname: "",
    rmbdistrict: "",
    rmbprovince: "",
    email: "",
    mobilenumber: "",
    idnumber: "",
    role: "user",
    isApproved: false,
    approvedAt: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { enqueueSnackbar } = useSnackbar();

  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ];

  useEffect(() => {
    if (user) {
      setFormData(user);
      setErrors({});
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.rmbname.trim()) newErrors.rmbname = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.rmbdistrict) newErrors.rmbdistrict = "District is required";
    if (!formData.mobilenumber.trim())
      newErrors.mobilenumber = "Mobile number is required";
    else if (!/^07\d{8}$/.test(formData.mobilenumber)) {
      newErrors.mobilenumber = "Mobile number must be in format 07XXXXXXXX";
    }
    if (!formData.idnumber.trim()) newErrors.idnumber = "ID number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/other/user/editUser/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rmbname: formData.rmbname,
          rmbdistrict: formData.rmbdistrict,
          email: formData.email,
          mobilenumber: formData.mobilenumber,
          idnumber: formData.idnumber,
          role: formData.role,
          isApproved: formData.isApproved,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSave(result.data);
        onClose();
        enqueueSnackbar(`User updated successfully`, {
          variant: "success",
        });
      } else {
        alert("Error updating user: " + result.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      enqueueSnackbar(`Error updating user`, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RMV Name *
                </label>
                <input
                  type="text"
                  name="rmbname"
                  value={formData.rmbname}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rmbname ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.rmbname && (
                  <p className="text-red-500 text-sm mt-1">{errors.rmbname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <select
                  name="rmbdistrict"
                  value={formData.rmbdistrict}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rmbdistrict ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.rmbdistrict && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rmbdistrict}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  name="mobilenumber"
                  value={formData.mobilenumber}
                  onChange={handleInputChange}
                  placeholder="07XXXXXXXX"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mobilenumber ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.mobilenumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mobilenumber}
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
                  name="idnumber"
                  value={formData.idnumber}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.idnumber ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.idnumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.idnumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="rmvAdmin">rmvAdmin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
