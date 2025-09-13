import React from "react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null; // if not open → don't show anything

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black dark:bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-300 dark:text-gray-600">{message}</p>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-600 dark:border-gray-300 text-white dark:text-black  "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
