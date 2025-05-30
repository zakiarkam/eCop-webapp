import React from "react";

interface DeleteItem {
  primaryText: string;
  secondaryText?: string;
  additionalInfo?: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  item: DeleteItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmButtonText?: string;
  warningText?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  item,
  onConfirm,
  onCancel,
  loading = false,
  confirmButtonText = "Delete",
  warningText = "This action cannot be undone. All data will be permanently removed.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>
          <div className="text-sm text-gray-600 text-center mb-6">
            <p className="mb-2">{description}</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900">{item.primaryText}</p>
              {item.secondaryText && (
                <p className="text-gray-600">{item.secondaryText}</p>
              )}
              {item.additionalInfo && (
                <p className="text-gray-500 text-xs mt-1">
                  {item.additionalInfo}
                </p>
              )}
            </div>
            <p className="mt-3 text-red-600 font-medium">{warningText}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Deleting..." : confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
