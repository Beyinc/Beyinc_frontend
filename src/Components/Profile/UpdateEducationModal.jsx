import { useState, useEffect } from "react";
import aboutService from "./aboutPageApi";  // Import the aboutServiceApi file

const UpdateEducationModal = ({ isOpen, onClose, setEducation, item }) => {
    const grades = [
        { value: "SSC", label: "10th" },
        { value: "Inter", label: "Inter/Equivalent" },
        { value: "UG", label: "UG (Btech, degree)" },
        { value: "PG", label: "PG" },
        { value: "Medical", label: "Medical" },
        { value: "Business", label: "Business" },
        { value: "Law", label: "Law" },
        { value: "other", label: "Other" },
    ];

    const [selectedGrade, setSelectedGrade] = useState(item?.grade || ""); // State to track the selected grade
    const [college, setCollege] = useState(item?.college || ""); // State to track the college/university input
    const [startYear, setStartYear] = useState(""); // State to track the selected start year
    const [endYear, setEndYear] = useState(item?.Edend || ""); // State to track the selected end year
    const [isFormComplete, setIsFormComplete] = useState(false); // State to track if the form is complete
    const [itemId, setItemId] = useState(item?._id);

    useEffect(() => {
        if (isOpen) {
            setItemId(item._id);
            setSelectedGrade(item.grade);
            setCollege(item.college);
            setStartYear(item.Edstart);
            setEndYear(item.Edend);
        }
    }, [isOpen, item]);

    const currentYear = new Date().getFullYear();

    const startYears = [];
    for (let i = currentYear - 20; i <= currentYear; i++) {
        startYears.push(i);
    }
    const endYears = [];
    for (let i = currentYear - 20; i <= currentYear + 10; i++) {
        endYears.push(i);
    }

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            const modalContent = document.getElementById("education-modal-content");
            if (modalContent) {
                modalContent.focus();
            }
        }
    }, [isOpen]);

    const handleGradeChange = (e) => {
        setSelectedGrade(e.target.value);
    };

    const handleCollegeChange = (e) => {
        setCollege(e.target.value);
    };

    const handleStartYearChange = (e) => {
        setStartYear(e.target.value);
    };

    const handleEndYearChange = (e) => {
        setEndYear(e.target.value);
    };

    const handleFormCompletion = () => {
        if (selectedGrade && college && startYear && endYear) {
            setIsFormComplete(true);
        } else {
            setIsFormComplete(false);
        }
    };

    const saveUpdatedEducation = async () => {
        const payload = {
            _id: item._id,
            Edstart: startYear,
            Edend: endYear,
            grade: selectedGrade,
            college: college
    }
        try {
            const updatedEducation = await aboutService.saveUpdatedEducation(payload);

            setEducation(updatedEducation);
            setSelectedGrade('');
            setCollege('');
            setStartYear('');
            setEndYear('');
            handleClose();
        } catch (error) {
            console.log("There was an error while saving Experience", error);
        }
    };

    useEffect(() => {
        handleFormCompletion();
    }, [selectedGrade, college, startYear, endYear]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleClose}
        >

            <div
                id="education-modal-content"
                className="bg-white md:w-1/3 mt-10 md:mt-0 p-6 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center items-center flex-col ">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Education</h2>

                    <div className="flex-col flex justify-center items-center">
                        {/* Grade Dropdown */}
                        <div className="mb-4 w-full">
                            <label htmlFor="grade" className="block text-gray-700 mb-2">
                                Grade
                            </label>
                            <select
                                name="grade"
                                id="grade"
                                value={selectedGrade}
                                onChange={handleGradeChange}
                                className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select</option>
                                {grades.map((grade) => (
                                    <option key={grade.value} value={grade.value}>
                                        {grade.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* College/University Input */}
                        <div className="mb-4 w-full">
                            <label htmlFor="college" className="block text-gray-700 mb-2">
                                College/University
                            </label>
                            <input
                                type="text"
                                id="college"
                                value={college}
                                onChange={handleCollegeChange}
                                className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter College/University"
                            />
                        </div>

                        {/* Start Year Dropdown */}
                        <div className="mb-4 w-full">
                            <label htmlFor="startYear" className="block text-gray-700 mb-2">
                                Start Year
                            </label>
                            <select
                                name="startYear"
                                id="startYear"
                                value={startYear}
                                onChange={handleStartYearChange}
                                className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select</option>
                                {startYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* End Year Dropdown */}
                        <div className="mb-4 w-full">
                            <label htmlFor="endYear" className="block text-gray-700 mb-2">
                                End Year
                            </label>
                            <select
                                name="endYear"
                                id="endYear"
                                value={endYear}
                                onChange={handleEndYearChange}
                                className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select</option>
                                <option value="Currently Working">Currently working</option>
                                {endYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Button Row */}
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={saveUpdatedEducation}
                        disabled={!isFormComplete}
                        className={`${!isFormComplete
                            ? "bg-blue-400 cursor-not-allowed text-gray-500"
                            : "bg-blue-500 hover:bg-blue-700 text-white"
                            }  px-4 py-2 rounded-md`}
                    >
                        Save
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={onClose}
                    >Cancel</button>

                </div>
            </div>
        </div>
    );
};

export default UpdateEducationModal;
