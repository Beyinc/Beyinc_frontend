import React, { useEffect, useState } from "react";
import aboutService from "./aboutPageApi"; // Import the skillsApi

const EditSkillsModal = ({ isOpen, onClose, savedSkills, setSkills }) => {
  const options = [
    "Accounting",
    "Aerospace Engineering",
    "AgroTech",
    "AI Development",
    "Android Development",
    "Art",
    "Biotechnology",
    "Blockchain",
    "Chemistry",
    "Clean Energy",
    "Clothing Design",
    "Commercial Property Management",
    "Communication",
    "Computer Programming",
    "Consultancy",
    "Construction Management",
    "Consumer Goods",
    "Content Marketing",
    "Cryptocurrency",
    "Data Analysis",
    "Design Thinking",
    "Digital Marketing",
    "Ecommerce",
    "EdTech",
    "Electronics",
    "Energy",
    "Environmental Science",
    "Events Management",
    "Fashion Design",
    "Finance",
    "Financial Analysis",
    "Fintech",
    "Food and Beverage",
    "Frontend Development",
    "Full Stack Development",
    "Gaming",
    "GreenTech",
    "Healthcare",
    "Hospitality",
    "Information Technology",
    "Insurance",
    "Interior Design",
    "Investment",
    "iOS Development",
    "Java Programming",
    "JavaScript",
    "Jewelry Design",
    "Logistics",
    "Machine Learning",
    "Management Consulting",
    "Manufacturing",
    "Marine Engineering",
    "Marketing Strategy",
    "Material Science",
    "Mathematics",
    "Mechanical Engineering",
    "Medical Technology",
    "Mining",
    "Mobile App Development",
    "Music Composition",
    "Natural Language Processing",
    "Neural Networks",
    "Nutrition",
    "Oil & Gas",
    "Organic Farming",
    "Patent Law",
    "Pharmaceuticals",
    "Physics",
    "Product Design",
    "Project Management",
    "Prototyping",
    "Publishing",
    "Python Programming",
    "Real Estate",
    "Recruitment",
    "Renewable Energy",
    "Restaurants",
    "Robotics",
    "Ruby Programming",
    "Sales",
    "Security",
    "SEO",
    "Social Media Management",
    "Software Development",
    "Spa Services",
    "Sports Management",
    "Supply Chain Management",
    "Telecommunications",
    "Tourism",
    "Translation",
    "UI/UX Design",
    "Virtual Reality",
    "Web Development",
    "Wholesale",
    "3D Printing"
  ];

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [displayedSkill, setDisplayedSkill] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [skillsToDelete, setSkillsToDelete] = useState([]);

  useEffect(() => {
    setDisplayedSkill(savedSkills);
  }, [savedSkills]);

  const handleClickCrossIcon = (item) => {
    // Remove the item from displayedSkill
    const updatedDisplayedSkills = displayedSkill.filter(skill => skill !== item);

    // Add the item to skillsToDelete
    const updatedSkillsToDelete = [...skillsToDelete, item];

    // Update the states
    setDisplayedSkill(updatedDisplayedSkills);
    setSkillsToDelete(updatedSkillsToDelete);
  };

  const handleSkillSelect = (e) => {
    const selectedSkill = e.target.value;
    if (selectedSkill && !selectedSkills.includes(selectedSkill)) {
      setSelectedSkills((prevSkills) => [...prevSkills, selectedSkill]);
    }
    setCurrentSkill("");
  };

  const handleAddSkill = () => {
    aboutService.handleAddSkill(setSelectedSkills, selectedSkills, skillsToDelete, setSkills, onClose);
  };

  if (!isOpen) {
    return null;
  }

  return (
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      >
        <div
          className="bg-white md:w-1/3 p-6 rounded-lg shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Content */}
          <h2 className="text-2xl font-semibold mt-5 md:mt-0 text-gray-800 mb-4">Edit Skills</h2>

          {/* savedSkills */}
          <div className="mt-4 flex flex-wrap gap-2">{
            displayedSkill.length > 0 ? (
              displayedSkill.map((skill, index) => (
                <span key={index} className="relative group my-2">
                  <span className="bg-blue-200 py-3 px-4 rounded-lg text-sm cursor-pointer">
                    {skill}
                  </span>
                  <svg
                    onClick={() => handleClickCrossIcon(skill)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 text-red-500 absolute -top-1/2 cursor-pointer right-0 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
              ))
            ) : (
              <p>No skills available</p>
            )}
          </div>
          <hr className="mt-4" />

          {/* Display skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedSkills.length > 0 ? (
              selectedSkills.map((skill, index) => (
                <span key={index} className="relative group my-2">
                  <span className="bg-blue-200 py-3 px-4 rounded-lg text-sm cursor-pointer">
                    {skill}
                  </span>
                  <svg
                    onClick={() => {
                      setSelectedSkills((prevSkills) =>
                        prevSkills.filter((item) => item !== skill)
                      );
                    }} xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 text-red-500 absolute -top-1/2 cursor-pointer right-0 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
              ))
            ) : (
              <p>No skills available</p>
            )}
          </div>

          {/* Dropdown to select a new skill */}
          <div className="mt-4">
            <select
              value={currentSkill}
              onChange={handleSkillSelect}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Select a skill</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Button Row */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleAddSkill}
              style={{ backgroundColor: "#4e54c7" }}
              className="text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
            <button
              style={{backgroundColor:"rgba(200, 50, 50, 1)"}}
              className="px-4 py-2 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
  );
};

export default EditSkillsModal;
