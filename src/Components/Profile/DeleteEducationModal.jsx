import React from "react";

const DeleteEducationModal = ({isOpen,  onClose, onDelete, item }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose} 
        >
            <div
                className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Are you sure you want to delete this education element?
                </h2>

                <div className="mb-4">
                    <p className="text-gray-700">{item.college}</p>
                    <p className="text-gray-600">{item.Edstart} - {item.Edend}</p>
                </div>

                {/* Buttons to confirm or cancel */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose} // Close the modal if Cancel is clicked
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onDelete(item._id); 
                            onClose();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteEducationModal;
