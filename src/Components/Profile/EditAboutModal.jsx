import { useEffect, useState } from "react";
import aboutService from "./aboutPageApi"; // Import the saveAbout function from aboutApi.js

const EditAboutModal = ({ isOpen, onClose, initialValue, onSave }) => {
    const MAX_CHAR_COUNT = 1000;
    const [aboutText, setAboutText] = useState("");
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setAboutText(initialValue || ""); // Set the initial value from props
            setCharCount(initialValue ? initialValue.length : 0); // Update character count
        }
    }, [isOpen, initialValue]);

    const handleChange = (e) => {
        const newText = e.target.value;
        if (newText.length <= MAX_CHAR_COUNT) {
            setAboutText(newText);
            setCharCount(newText.length);
        }
    };

    const handleSave = async () => {
        try {
            const updatedAbout = await aboutService.saveAbout("675e7e41e424505620d8faee", aboutText); // Update API call
            console.log("About saved successfully", updatedAbout);
            onSave(aboutText); // Update parent with the new about text
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error while saving about:", error);
            alert(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose} // Close modal on outside click
        >
            <div
                className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()} // Prevent close on content click
            >
                {/* Modal Content */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit About</h2>

                {/* Textarea */}
                <textarea
                    value={aboutText}
                    onChange={handleChange}
                    id="about-textarea"
                    className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Update your about section"
                    maxLength={MAX_CHAR_COUNT}
                />

                {/* Character Count */}
                <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">{`${charCount} / ${MAX_CHAR_COUNT} characters`}</span>
                    {charCount === MAX_CHAR_COUNT && (
                        <span className="text-sm text-red-500">Maximum limit reached!</span>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={handleSave}
                        style={{ backgroundColor: "#4e54c7" }}
                        className="text-white px-4 py-2 rounded-md"
                    >
                        Save
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAboutModal;