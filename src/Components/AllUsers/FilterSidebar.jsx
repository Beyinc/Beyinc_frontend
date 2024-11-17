import React, { useState, useEffect } from "react";
import { stages, allskills, domain_subdomain, categories } from "../../Utils";
import { RxCaretDown } from "react-icons/rx";
const FilterSidebar = ({ updateFilters, open }) => {
  const [userName, setUserName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [industries, setIndustries] = useState("");
  const [stage, setStage] = useState("");
  const [category, setCategory] = useState("");

  const subdomains = Object.values(domain_subdomain).flat();

  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState([]);
  const [selectedStage, setSelectedStage] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isStageOpen, setIsStageOpen] = useState(false);
  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Update filters in useEffect instead of outside
  useEffect(() => {
    // console.log("hello" + selectedCategories);

    const filters = {
      userName,
      expertise: selectedExpertise,
      industries: selectedIndustry,
      stages: selectedStage,
      categories: selectedCategories,
    };

    // Call the updateFilters function whenever the filters change
    updateFilters(filters);
  }, [
    userName,
    selectedExpertise,
    selectedIndustry,
    selectedStage,
    selectedCategories,
  ]);

  const handleExpertiseChange = (event) => {
    const { value, checked } = event.target;
    setSelectedExpertise((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  const handleIndustryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedIndustry((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      // Add the selected category if checked
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      // Remove the unselected category
      setSelectedCategories((prev) =>
        prev.filter((category) => category !== value)
      );
    }
  };

  const handleStageChange = (event) => {
    const { value, checked } = event.target;
    setSelectedStage((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  const filteredExpertiseOptions = allskills.filter((option) =>
    option.toLowerCase().includes(expertise.toLowerCase())
  );

  const filteredIndustryOptions = subdomains.filter((option) =>
    option.toLowerCase().includes(industries.toLowerCase())
  );

  const filteredStageOptions = stages.filter((option) =>
    option.toLowerCase().includes(stage.toLowerCase())
  );

  const filteredCategories = categories.filter((option) =>
    option.toLowerCase().includes(category.toLowerCase())
  );
  return (
    <div
      className={`filter-sidebar  ${open ? "h-[400px] px-20" : "h-[600px]"}`}
    >
      {/* <h2>Filter</h2> */}
      <hr className={`mt-2 mb-6 ${open ? "hidden" : "w-full"}`} />
      <h4 className="mt-3 mb-2">Username</h4>
      <input
        className="2xl:w-72 xl:w-72 lg:w-40 md:w-40 "
        type="text"
        placeholder="Enter username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <hr className="mt-4 mb-6" />
      <h4 className="mt-3 mb-2">Category</h4>
      <div className="relative">
        <button
          className={`absolute right-1 top-[-45px] text-xl transform transition-transform duration-300 focus:outline-none focus:ring-0 border-none bg-transparent hover:bg-transparent text-gray-500 ${
            isCategoryOpen ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => setIsCategoryOpen(!isCategoryOpen)} // Toggle dropdown visibility
        >
          <RxCaretDown />
        </button>
      </div>

      {/* Category checkboxes, shown only if isCategoryOpen is true */}
      {isCategoryOpen && (
        <div className="max-h-48 overflow-y-scroll overflow-x-hidden mt-2 border border-gray-300 rounded-md">
          <input
            type="text"
            className="w-64 mt-3"
            placeholder="Search Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)} // Update state on change
          />
          {filteredCategories.map((option) => (
            <div key={option} className="p-0">
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedCategories.includes(option)} // Check if option is selected
                  onChange={handleCategoryChange} // Handle checkbox change
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Expertise Input Field */}
      <hr className="mt-4 mb-6" />
      <h4 className="mt-3 mb-2">Expertise</h4>

      <div className="relative">
        <button
          className={`absolute right-1 top-[-45px] text-xl transform transition-transform duration-300 focus:outline-none focus:ring-0 border-none bg-transparent hover:bg-transparent text-gray-500 ${
            isExpertiseOpen ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => setIsExpertiseOpen(!isExpertiseOpen)}
        >
          <RxCaretDown />
        </button>
      </div>

      {/* Expertise checkboxes, shown only if isExpertiseOpen is true */}
      {isExpertiseOpen && (
        <div className="max-h-48 overflow-y-scroll overflow-x-hidden mt-2 border border-gray-300 rounded-md">
          <input
            type="text"
            className="w-64 mt-3"
            placeholder="Search Expertise"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
          />
          {filteredExpertiseOptions.map((option) => (
            <div key={option} className="p-0">
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedExpertise.includes(option)}
                  onChange={handleExpertiseChange}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Input field */}
      <hr className="mt-4 mb-6" />
      <h4 className="mt-3 mb-2">Industries</h4>
      <div className="relative">
        {/* Caret icon to toggle the dropdown with rotation */}
        <button
          className={`absolute right-1 top-[-45px] text-xl transform transition-transform duration-300 focus:outline-none focus:ring-0 border-none bg-transparent hover:bg-transparent text-gray-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <RxCaretDown />
        </button>
      </div>

      {/* Industry checkboxes with vertical scroll, shown only if isOpen is true */}
      {isOpen && (
        <div className="max-h-48 overflow-y-scroll overflow-x-hidden mt-2 border border-gray-300 rounded-md">
          <input
            type="text"
            className="w-64 mt-3"
            placeholder="Search Industry"
            value={industries}
            onChange={(e) => setIndustries(e.target.value)}
          />
          {filteredIndustryOptions.map((option) => (
            <div key={option} className="p-0">
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedIndustry.includes(option)}
                  onChange={handleIndustryChange}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Stage Input Field */}
      <hr className="mt-4 mb-6" />
      <h4 className="mt-3 mb-2">Stages</h4>
      <div className="relative">
        <button
          className={`absolute right-1 top-[-45px] text-xl transform transition-transform duration-300 focus:outline-none focus:ring-0 border-none bg-transparent hover:bg-transparent text-gray-500 ${
            isStageOpen ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => setIsStageOpen(!isStageOpen)}
        >
          <RxCaretDown />
        </button>
      </div>

      {/* Stage checkboxes, shown only if isStageOpen is true */}
      {isStageOpen && (
        <div className="max-h-48 overflow-y-scroll overflow-x-hidden mt-2 border border-gray-300 rounded-md">
          <input
            type="text"
            className="w-64 mt-3"
            placeholder="Search Stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          />
          {filteredStageOptions.map((option) => (
            <div key={option} className="p-0">
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedStage.includes(option)}
                  onChange={handleStageChange}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
