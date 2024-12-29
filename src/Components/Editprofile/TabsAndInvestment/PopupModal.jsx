import React from "react";

const PopupModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-600 mb-4">{children}</div>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupModal;
