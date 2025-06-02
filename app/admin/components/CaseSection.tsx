"use client";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import DeleteConfirmationModal from "./modal/deleteModal";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import {
  rulesApiService,
  RuleType,
  CreateRuleData,
} from "@/services/apiServices/rulesApi";

export default function RulesManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const [rulesData, setRulesData] = useState<RuleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<RuleType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(rulesData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRules = rulesData.slice(startIndex, endIndex);

  const [newRule, setNewRule] = useState({
    section: "",
    provision: "",
    fine: "",
    points: "",
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const result = await rulesApiService.getAllRules();

      if (result.rules) {
        setRulesData(result.rules);
      } else {
        enqueueSnackbar(result.message || "Failed to fetch rules", {
          variant: "error",
        });
      }
    } catch (error: unknown) {
      console.error("Error submitting rule:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed fetch rules. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingRule) {
      setEditingRule({
        ...editingRule,
        [name]: name === "points" ? Number(value) : value,
      });
    } else {
      setNewRule((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const data = editingRule || newRule;
    return rulesApiService.validateRuleData({
      section: data.section,
      provision: data.provision,
      fine: data.fine,
      points:
        typeof data.points === "string" ? parseInt(data.points) : data.points,
    });
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      enqueueSnackbar(validationError, { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const isEdit = !!editingRule;
      const ruleData: CreateRuleData = {
        section: isEdit ? editingRule.section : newRule.section,
        provision: isEdit ? editingRule.provision : newRule.provision,
        fine: isEdit ? editingRule.fine : newRule.fine,
        points: isEdit ? editingRule.points : parseInt(newRule.points),
      };

      let result;
      if (isEdit) {
        result = await rulesApiService.updateRule(editingRule._id, ruleData);
      } else {
        result = await rulesApiService.createRule(ruleData);
      }

      enqueueSnackbar(result.message, { variant: "success" });

      // Reset form
      if (editingRule) {
        setEditingRule(null);
      }
      setNewRule({ section: "", provision: "", fine: "", points: "" });

      await fetchRules();
    } catch (error: unknown) {
      console.error("Error submitting rule:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to save rule.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: RuleType) => {
    setEditingRule(rule);
    setNewRule({
      section: rule.section,
      provision: rule.provision,
      fine: rule.fine,
      points: rule.points.toString(),
    });
  };

  const handleDeleteClick = (rule: RuleType) => {
    setRuleToDelete(rule);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ruleToDelete) return;

    setDeleteLoading(true);

    try {
      const result = await rulesApiService.deleteRule(ruleToDelete._id);
      enqueueSnackbar(result.message, { variant: "success" });
      await fetchRules();
    } catch (error: unknown) {
      console.error("Error delete rule:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit delete rule. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
      setRuleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setRuleToDelete(null);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setNewRule({ section: "", provision: "", fine: "", points: "" });
  };

  return (
    <div className="font-sans">
      <div className="mx-4 mb-4  ">
        <div className="max-w-6xl mx-auto mb-4 bg-white shadow-lg p-8 rounded-md">
          <h2 className="text-xl font-bold mb-4">
            {editingRule ? "Edit Rule" : "Add New Rule"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Section of Act <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="section"
                value={editingRule ? editingRule.section : newRule.section}
                onChange={handleInputChange}
                placeholder="e.g., 21, 22, 23"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                disabled={loading}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-gray-800 text-sm mb-2 block">
                Provision <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="provision"
                value={editingRule ? editingRule.provision : newRule.provision}
                onChange={handleInputChange}
                placeholder="Description of the violation"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Fine (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fine"
                value={editingRule ? editingRule.fine : newRule.fine}
                onChange={handleInputChange}
                placeholder="1,000"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Points <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="points"
                min="0"
                max="10"
                value={editingRule ? editingRule.points : newRule.points}
                onChange={handleInputChange}
                placeholder="3"
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-400 transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#15134A] text-white px-8 py-3 rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? "Saving..." : editingRule ? "Update Rule" : "Add Rule"}
            </button>

            {editingRule && (
              <button
                onClick={handleCancelEdit}
                disabled={loading}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 border font-semibold">Section</th>
                  <th className="px-6 py-3 border font-semibold">Provision</th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Fine (Rs.)
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Points
                  </th>
                  <th className="px-6 py-3 border font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading rules...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentRules.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No rules found. Add your first rule above.
                    </td>
                  </tr>
                ) : (
                  currentRules.map((rule) => (
                    <tr
                      key={rule._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 border font-medium">
                        {rule.section}
                      </td>
                      <td className="px-6 py-4 border">{rule.provision}</td>
                      <td className="px-6 py-4 border text-center">
                        {rule.fine}.00
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {rule.points}
                        </span>
                      </td>
                      <td className="px-6 py-4 border text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="text-[#6DB6FE] hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                            onClick={() => handleEdit(rule)}
                            disabled={loading}
                            title="Edit rule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                            onClick={() => handleDeleteClick(rule)}
                            disabled={loading}
                            title="Delete rule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {rulesData.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-100">
                    <td colSpan={5} className="px-6 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, rulesData.length)} of{" "}
                          {rulesData.length} rules
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Rule"
        description={`Are you sure you want to delete this traffic rule?`}
        item={{
          primaryText: ruleToDelete?.section
            ? `Section ${ruleToDelete.section}`
            : "",
          secondaryText: ruleToDelete?.provision || "",
        }}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        confirmButtonText="Delete Rule"
        warningText="This action cannot be undone. The rule will be permanently removed from the system."
      />
    </div>
  );
}
