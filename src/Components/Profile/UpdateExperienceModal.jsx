import axios from "axios";
import { useState, useEffect } from "react";
import aboutService from "./aboutPageApi";

const UpdateExperienceModal = ({ isOpen, onClose, item, setExperiences }) => {
    // Define state variables for the form fields
    const [company, setCompany] = useState(item?.company || "");
    const [designation, setDesignation] = useState(item?.designation || "");
    const [startYear, setStartYear] = useState(item?.startYear || "");
    const [endYear, setEndYear] = useState(item?.endYear || "");
    const [location, setLocation] = useState(item?.CompanyLocation || "");

    // State to manage form completeness
    const [isFormComplete, setIsFormComplete] = useState(false);

    useEffect(() => {
        if (isOpen) {
            console.log("This is the item from the updateExperience modal: ", item);
            setCompany(item.company);
            setDesignation(item.designation);
            setStartYear(item.startYear);
            setEndYear(item.endYear);
            setLocation(item.CompanyLocation);
        }
    }, [isOpen])
    // console.log("This is the companyLocation: ", item?.CompanyLocation);


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

    // const handleUpdateExperience = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:4000/api/updateExperienceDetails', {
    //             userId: "675e7e41e424505620d8faee",
    //             experience: {
    //                 _id: item._id,
    //                 startYear,
    //                 endYear,
    //                 company,
    //                 designation
    //             }
    //         })
    //         console.log("This is the response: ", response);
    //         if (response.data && response.data.success === true) {
    //             setExperiences(response.data.experienceDetails);
    //             onClose();
    //         }

    //     } catch (error) {
    //         console.log("There was an error Updating the Experience: ", error);
    //     }
    // }

    const currentYear = new Date().getFullYear();

    const startYears = [];
    for (let i = currentYear - 20; i <= currentYear; i++) {
        startYears.push(i);
    }
    const endYears = [];
    for (let i = currentYear - 20; i <= currentYear + 10; i++) {
        endYears.push(i);
    }


    const handleFormCompletion = () => {
        if (company && designation && startYear && endYear) {
            setIsFormComplete(true);
        } else {
            setIsFormComplete(false);
        }
    };

    useEffect(() => {
        handleFormCompletion();
    }, [company, designation, startYear, endYear]);

    const handleStartYearChange = (e) => setStartYear(e.target.value);
    const handleEndYearChange = (e) => setEndYear(e.target.value);


    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
        // onClick={onClose} // Close modal when clicking outside the modal
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-96"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Update Experience</h2>
                    {/* <button
                        className="text-gray-500 text-2xl"
                        onClick={onClose}
                    >
                        X
                    </button> */}
                </div>

                {/* Company Name */}
                <div className="mt-4">
                    <div className="text-base text-blue-700 font-bold">Company Name</div>
                    <input
                        className="w-52 mt-2 rounded-md border-gray-300 border p-2"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Enter your company name"
                    />
                </div>

                {/* Designation */}
                <div className="mt-4">
                    <div className="text-base text-blue-700 font-bold">Designation</div>
                    <select
                        name="designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        {designations.map((desig, index) => (
                            <option key={index} value={desig}>
                                {desig}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Year */}
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


                {/* End Year */}
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
                {/* Company Name */}
                <div className="mt-4">
                    <div className="text-base text-blue-700 font-bold">Company Location</div>
                    <input
                        className="w-52 mt-2 rounded-md border-gray-300 border p-2"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter your company Location"
                    />
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={() => aboutService.handleUpdateExperience(item, startYear, endYear, company, designation, location, setExperiences, onClose)}
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

export default UpdateExperienceModal;
