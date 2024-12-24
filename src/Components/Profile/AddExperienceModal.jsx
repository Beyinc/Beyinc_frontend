import axios from "axios";
import { useEffect, useState } from "react";
import aboutService from './aboutPageApi'

const AddExperienceModal = ({ isOpen, onClose, setExperiences }) => {
    const designations = [
        "Lead", "Freelancer", "CEO", "Co Founder", "Software Developer",
        "Frontend Developer", "Backend Developer", "Full Stack Developer",
        "Mobile App Developer", "Web Developer", "DevOps Engineer",
        "System Administrator", "Network Administrator", "Database Administrator",
        "Quality Assurance (QA) Engineer", "Software Tester", "Business Analyst",
        "Product Manager", "Project Manager", "UI/UX Designer", "Data Scientist",
        "Data Analyst", "Machine Learning Engineer", "Artificial Intelligence (AI) Engineer",
        "Cloud Engineer", "Cloud Architect", "Cybersecurity Analyst",
        "Information Security Specialist", "IT Support Specialist", "IT Consultant",
        "Network Engineer", "Technical Writer", "Systems Analyst", "Technical Support Engineer",
        "Solution Architect", "IT Manager", "Chief Technology Officer (CTO)",
        "Chief Information Officer (CIO)", "Blockchain Developer", "Quantum Computing Engineer",
        "Game Developer", "Embedded Systems Engineer", "IT Trainer", "Robotics Engineer",
        "Virtual Reality (VR) Developer", "Augmented Reality (AR) Developer", "Data Engineer",
        "UI/UX Researcher", "IT Auditor", "IT Compliance Analyst", "ERP Consultant",
        "IT Recruiter", "Business Intelligence (BI) Developer", "Mobile Game Developer",
        "Frontend Architect", "Backend Architect", "Microservices Architect",
        "IT Procurement Specialist", "Health IT Specialist", "Geospatial Data Scientist",
        "Web Security Analyst", "Ethical Hacker", "Data Warehouse Architect",
        "Disaster Recovery Specialist", "Digital Marketing Technologist", "Financial Systems Analyst",
        "AR/VR Interaction Designer", "Geographic Information Systems (GIS) Analyst",
        "Wireless Communication Engineer", "System Integration Engineer", "IT Operations Manager",
        "Automation Engineer", "Chatbot Developer", "IT Compliance Manager",
        "Network Security Engineer", "Quantitative Analyst", "Digital Forensics Analyst",
        "Middleware Developer", "Business Process Analyst", "E-commerce Developer",
        "Linux System Administrator", "Information Systems Manager", "IT Project Coordinator",
        "Systems Engineer", "IT Security Consultant", "Mobile Solutions Architect",
        "Cloud Security Engineer", "IT Risk Analyst", "Technical Recruiter",
        "Software Configuration Manager", "Content Management System (CMS) Developer",
        "API Developer", "IT Business Continuity Planner", "Wireless Network Engineer",
        "Geotechnical Software Engineer", "Agile Coach", "Systems Integration Specialist",
        "Digital Transformation Consultant", "Big Data Engineer", "Customer Support Engineer"
    ];

    const [company, setCompany] = useState('');
    const [startYear, setStartYear] = useState();
    const [endYear, setEndYear] = useState();
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [designation, setDesignation] = useState("");
    const [location, setLocation] = useState("");

    const currentYear = new Date().getFullYear();

    const startYears = [];
    for (let i = currentYear - 20; i <= currentYear; i++) {
        startYears.push(i);
    }
    const endYears = [];
    for (let i = currentYear - 20; i <= currentYear + 10; i++) {
        endYears.push(i);
    }
    const handleAddExperience = async () => {
        try {
            const experienceData = [
                {
                    startYear: startYear,
                    endYear: endYear,
                    designation: designation,
                    company: company,
                    CompanyLocation: location
                }
            ];

            const response = await aboutService.addExperience(experienceData);
            if (response && response.success === true) {
                setExperiences(response.experienceDetails); // Update the experiences in parent component
                setCompany();
                setEndYear();
                setStartYear();
                setDesignation();
                setLocation();
                onClose(); // Close the modal
            }
        } catch (error) {
            console.log("There was an error while adding experience: ", error);
        }
    };



    const handleFormCompletion = () => {
        if (company && designation && startYear && location && (endYear || endYear === "Currently working")) {
            setIsFormComplete(true);
        } else {
            setIsFormComplete(false);
        }
    };

    useEffect(() => {
        handleFormCompletion();
    }, [company, designation, startYear, endYear, location]);

    const handleDesignationChange = (e) => setDesignation(e.target.value);
    const handleStartYearChange = (e) => setStartYear(e.target.value);
    const handleEndYearChange = (e) => setEndYear(e.target.value);
    const handleLocationChange = (e) => setLocation(e.target.value);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-96"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Add Experience</h2>
                </div>
                <div className="mt-4">
                    {/* Company Name Input */}
                    <div className="text-base text-blue-700 font-bold">Company Name</div>
                    <input
                        className="w-52 mt-2 rounded-md border-gray-300 border p-2"
                        placeholder="Enter your company name"
                        onChange={(e) => setCompany(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    {/* Designation Dropdown */}
                    <div className="text-base text-blue-700 font-bold">Designation</div>
                    <select
                        name="designation"
                        value={designation}
                        onChange={handleDesignationChange}
                        className="w-full mt-2 p-2 border-gray-300 border rounded-md"
                    >
                        <option value="">Select</option>
                        {designations.map((desig, index) => (
                            <option key={index} value={desig}>
                                {desig}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Year Dropdown */}
                <div className="mt-4 w-full">
                    <label htmlFor="startYear" className="text-base text-blue-700 font-bold">
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
                <div className="mt-4 w-full">
                    <label htmlFor="endYear" className="text-base text-blue-700 font-bold">
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
                        <option value="Currently working">Currently working</option>
                        {endYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                    {/* Company Location Input */}
                    <div className="text-base text-blue-700 font-bold">Location</div>
                    <input
                        className="w-52 mt-2 rounded-md border-gray-300 border p-2"
                        placeholder="Enter your company location"
                        onChange={handleLocationChange}
                    />
                </div>

                <div className="mt-4 flex justify-end gap-3">
                    {/* Save Button */}
                    <button
                        onClick={handleAddExperience}
                        className={`px-4 py-2 ${isFormComplete ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-300 cursor-not-allowed"} text-white rounded `}
                        disabled={!isFormComplete}
                    >
                        Save
                    </button>
                    {/* Cancel Button */}
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExperienceModal;
