import React, { useState, useEffect } from "react";
import { stages, allskills, domain_subdomain } from "../../Utils";

const FilterSidebar = ({ updateFilters }) => {
  const [userName, setUserName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [industries, setIndustries] = useState("");
  const [stage, setStage] = useState("");

  const subdomains = Object.values(domain_subdomain).flat();

  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState([]);
  const [selectedStage, setSelectedStage] = useState([]);

  // Update filters in useEffect instead of outside
  useEffect(() => {
    const filters = {
      userName,
      expertise: selectedExpertise,
      industries: selectedIndustry,
      stages: selectedStage,
    };

    // Call the updateFilters function whenever the filters change
    updateFilters(filters);
  }, [userName, selectedExpertise, selectedIndustry, selectedStage]);

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

  return (
    <div className="filter-sidebar">
      <h2>Filter</h2>

      <input
        className="w-72"
        type="text"
        placeholder="Enter username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <input
        type="text"
        className="w-72"
        placeholder="Search Expertise"
        value={expertise}
        onChange={(e) => setExpertise(e.target.value)}
      />

      {/* Expertise checkboxes with vertical scroll */}
      <div className="max-h-48 overflow-y-scroll overflow-x-hidden">
        {filteredExpertiseOptions.map((option) => (
          <div key={option}>
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

      <input
        type="text"
        className="w-72 mt-3"
        placeholder="Search Industry"
        value={industries}
        onChange={(e) => setIndustries(e.target.value)}
      />

      {/* Industry checkboxes with vertical scroll */}
      <div className="max-h-48 overflow-y-scroll overflow-x-hidden">
        {filteredIndustryOptions.map((option) => (
          <div key={option}>
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

      <input
        className="w-72 mt-3"
        type="text"
        placeholder="Search Stage"
        value={stage}
        onChange={(e) => setStage(e.target.value)}
      />

      {/* Stage checkboxes with vertical scroll */}
      <div className="max-h-48 overflow-y-scroll overflow-x-hidden">
        {filteredStageOptions.map((option) => (
          <div key={option}>
            <label>
              <input
                className="w-72"
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
    </div>
  );
};

export default FilterSidebar;
