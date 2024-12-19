import axios from "axios";
import { useEffect, useState } from "react";

const EditAboutModal = ({ isOpen, onClose, initialValue, onSave }) => {
    const MAX_CHAR_COUNT = 1000; // Maximum character limit
    const [aboutText, setAboutText] = useState(initialValue || "");
    const [charCount, setCharCount] = useState(initialValue ? initialValue.length : 0); // To track the character count

    // Handle close by clicking the overlay or button
    const handleClose = () => {
        onClose(); // Trigger the close function passed from the parent component
    };

    useEffect(() => {
        if (isOpen) {
            const textarea = document.getElementById("about-textarea");
            if (textarea) {
                textarea.focus(); // Automatically focus on the textarea
            }
        }
    }, [isOpen]);

    // Handle the changes in the textarea
    const handleChange = (e) => {
        const newText = e.target.value;
        if (newText.length <= MAX_CHAR_COUNT) {
            setAboutText(newText); // Update the aboutText state with the textarea value
            setCharCount(newText.length); // Update character count
        }
    };

    // Handle save logic
    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/createAbout', {
                userId: '675e7e41e424505620d8faee', // Make sure to use the actual userId
                about: aboutText
            });
    
            if (response.status === 200 && response.data.success) {
                console.log("About saved successfully", response.data.about);
                onSave(aboutText); // Call onSave to update the parent component with the new about text
                onClose(); // Close the modal after saving
            } else {
                // Handle unexpected success response or other status codes
                alert(response.data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            // Network or server error
            console.error("Error while saving about:", error);
            if (error.response) {
                // Server returned a response with an error status code
                alert(error.response.data.message || "An error occurred while saving. Please try again.");
            } else {
                // No response received, could be a network issue
                alert("Network error. Please check your connection.");
            }
        }
    };

    if (!isOpen) return null; // Don't render anything if modal is closed

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClose} // Close modal when clicking the overlay
        >
            <div
                className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Modal Content */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit About</h2>

                {/* Center the Textarea */}
                <div className="flex justify-center items-center">
                    <textarea
                        value={aboutText} // Bind the value of textarea to aboutText state
                        onChange={handleChange} // Update aboutText state on user input
                        id="about-textarea"
                        className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="Update your about section"
                        maxLength={MAX_CHAR_COUNT} // Set the max length to 1000
                    />
                </div>

                {/* Character Count */}
                <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">{`${charCount} / ${MAX_CHAR_COUNT} characters`}</span>
                    {charCount === MAX_CHAR_COUNT && (
                        <span className="text-sm text-red-500">Maximum limit reached!</span>
                    )}
                </div>

                {/* Button Row */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAboutModal;
