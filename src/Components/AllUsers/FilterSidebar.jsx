import React, { useState, useEffect } from "react";
import {
  ROLE_LEVELS,
  INDUSTRY_EXPERTISE,
  STARTUP_STAGES,
  STARTUP_SEEKING_OPTIONS,
} from "../../Utils";

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #d1d5db;
  }
`;

// 2. Button Reset Style
const cleanButtonStyle = {
  backgroundColor: "transparent",
  color: "inherit",
  border: "none",
  padding: "0",
  margin: "0",
  marginBottom: "10px",
  width: "100%",
  textAlign: "left",
  boxShadow: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const FilterSidebar = ({
  viewMode,
  updateFilters,
  updateStartupFilters,
  open,
  industrySkillCounts = {},
}) => {
  // --- STATE ---
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState([]);

  // --- STATE FOR STARTUPS ---
  const [selectedStartupIndustries, setSelectedStartupIndustries] = useState(
    [],
  );
  const [selectedStartupStage, setSelectedStartupStage] = useState("");
  const [selectedSeekingOptions, setSelectedSeekingOptions] = useState([]); // NEW STATE

  // Accordion State
  const [expandedSections, setExpandedSections] = useState({
    roleLevel: true,
    expertise: true,
    startupStage: true,
    seekingOptions: true,
    // Initialize specific industries as closed
    ...Object.keys(INDUSTRY_EXPERTISE || {}).reduce((acc, key) => {
      acc[`industry-${key}`] = false;
      return acc;
    }, {}),
  });

  // --- HANDLERS ---
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleExpertiseToggle = (skill) => {
    setSelectedExpertise((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((item) => item !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  // --- HANDLER FOR STARTUP INDUSTRIES ---
  const handleStartupIndustryToggle = (industry) => {
    setSelectedStartupIndustries((prev) => {
      if (prev.includes(industry)) {
        return prev.filter((item) => item !== industry);
      } else {
        return [...prev, industry];
      }
    });
  };
  // --- NEW HANDLER FOR STARTUP STAGE ---
  const handleStartupStageChange = (e) => {
    setSelectedStartupStage(e.target.value);
  };
  // --- NEW HANDLER FOR SEEKING OPTIONS ---
  const handleSeekingOptionToggle = (option) => {
    setSelectedSeekingOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  // --- SAFE EFFECT (DEBOUNCED) ---
  useEffect(() => {
    // Wait 500ms after user stops clicking before calling API
    const handler = setTimeout(() => {
      const filters = {
        role: selectedRole,
        expertise: selectedExpertise,
        // Default empty values to satisfy backend structure
        userName: "",
        industries: [],
        stages: [],
        categories: [],
      };

      // console.log("Syncing filters to parent...");
      updateFilters(filters);
    }, 500);

    return () => clearTimeout(handler);
  }, [selectedRole, selectedExpertise, updateFilters]);
  // --- NEW EFFECT FOR STARTUPS ---

  // --- EFFECT FOR STARTUPS (UPDATED) ---
  useEffect(() => {
    if (viewMode !== "startups") return;
    const handler = setTimeout(() => {
      const filters = {
        userName: "",
        industries: selectedStartupIndustries,
        stage: selectedStartupStage,
        targetMarket: [],
        seekingOptions: selectedSeekingOptions, // NOW USING SELECTED SEEKING OPTIONS
      };
      updateStartupFilters(filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [
    selectedStartupIndustries,
    selectedStartupStage,
    selectedSeekingOptions,
    updateStartupFilters,
    viewMode,
  ]); // ADDED selectedSeekingOptions

  // --- SVG ICON ---
  const ChevronDown = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

  return (
    <>
      {/* Inject Styles Here */}
      <style>{scrollbarStyles}</style>

      <aside
        className={`w-72 flex-shrink-0 !bg-white ${open ? "block" : "hidden"} md:block pr-2`}
      >
        <div className="flex flex-col">
          {/* Main Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold !text-gray-900 m-0">Filter By:</h2>
          </div>

          {/* ================= ROLE LEVEL SECTION ================= */}
          {viewMode === "mentors" && (
            <div className="mb-6 border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => toggleSection("roleLevel")}
                style={cleanButtonStyle}
                className="group mb-2"
              >
                <h3 className="text-base font-bold !text-gray-800 group-hover:!text-[#4f55c7] transition-colors">
                  Role Level
                </h3>
                <ChevronDown
                  className={`!text-gray-500 transform transition-transform duration-200 ${expandedSections.roleLevel ? "rotate-180" : ""}`}
                />
              </button>

              {expandedSections.roleLevel && (
                <div className="mt-2 pl-1">
                  <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    // Added 'accent-[#4f55c7]' and made the ring solid to ensure no blue remains
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm !bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4f55c7] focus:border-[#4f55c7] accent-[#4f55c7] transition-all cursor-pointer hover:border-[#4f55c7]"
                  >
                    <option value="">All Levels</option>
                    {ROLE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* ================= EXPERTISE SECTION ================= */}
          {viewMode === "mentors" && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => toggleSection("expertise")}
                style={cleanButtonStyle}
                className="group mb-4"
              >
                <h3 className="text-base font-bold !text-gray-800 group-hover:!text-[#4f55c7] transition-colors">
                  Expertise
                </h3>
                <ChevronDown
                  className={`!text-gray-500 transform transition-transform duration-200 ${expandedSections.expertise ? "rotate-180" : ""}`}
                />
              </button>

              {expandedSections.expertise && (
                <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Dynamic Categories */}
                  {Object.entries(INDUSTRY_EXPERTISE || {}).map(
                    ([industry, skills]) => (
                      <div key={industry} className="mb-1">
                        {/* Category Header (Level 2) */}
                        <button
                          type="button"
                          onClick={() => toggleSection(`industry-${industry}`)}
                          style={cleanButtonStyle}
                          className="py-2 px-2 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
                        >
                          <span className="text-sm font-semibold !text-gray-700">
                            {industry}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              (
                              {industrySkillCounts[industry]?.industryCount ||
                                0}
                              )
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 !text-gray-400 transform transition-transform duration-200 ${
                                expandedSections[`industry-${industry}`]
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* Skills List (Level 3) - Nested */}
                        {expandedSections[`industry-${industry}`] && (
                          <div className="ml-2 pl-4 border-l-2 border-gray-100 space-y-2 py-2 mb-2">
                            {skills.map((skill) => (
                              <label
                                key={skill}
                                className="flex items-center justify-between w-full cursor-pointer group p-1 -ml-1 hover:bg-gray-50 rounded transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedExpertise.includes(skill)}
                                    onChange={() =>
                                      handleExpertiseToggle(skill)
                                    }
                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 !text-[#4f55c7] focus:ring-[#4f55c7] accent-[#4f55c7] cursor-pointer"
                                  />
                                  <span className="text-sm !text-gray-600 group-hover:!text-gray-900 leading-tight select-none">
                                    {skill}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400 ml-4">
                                  (
                                  {industrySkillCounts[industry]?.skills?.[
                                    skill
                                  ] || 0}
                                  )
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
          {/* NEW STARTUP INDUSTRIES FILTER */}
          {viewMode === "startups" && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => toggleSection("startupIndustries")}
                style={cleanButtonStyle}
                className="group mb-4"
              >
                <h3 className="text-base font-bold !text-gray-800 group-hover:!text-[#4f55c7] transition-colors">
                  Industries
                </h3>
                <ChevronDown
                  className={`!text-gray-500 transform transition-transform duration-200 ${expandedSections.startupIndustries ? "rotate-180" : ""}`}
                />
              </button>

              {expandedSections.startupIndustries && (
                <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.keys(INDUSTRY_EXPERTISE || {}).map((industry) => (
                    <label
                      key={industry}
                      className="flex items-center justify-between w-full cursor-pointer group p-1 -ml-1 hover:bg-gray-50 rounded transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedStartupIndustries.includes(industry)}
                          onChange={() => handleStartupIndustryToggle(industry)}
                          className="mt-0.5 w-4 h-4 rounded border-gray-300 !text-[#4f55c7] focus:ring-[#4f55c7] accent-[#4f55c7] cursor-pointer"
                        />
                        <span className="text-sm !text-gray-600 group-hover:!text-gray-900 leading-tight select-none">
                          {industry}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* ================= STARTUP STAGE SECTION ================= */}
          {viewMode === "startups" && (
            <div className="mb-6 border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => toggleSection("startupStage")}
                style={cleanButtonStyle}
                className="group mb-2"
              >
                <h3 className="text-base font-bold !text-gray-800 group-hover:!text-[#4f55c7] transition-colors">
                  Startup Stage
                </h3>
                <ChevronDown
                  className={`!text-gray-500 transform transition-transform duration-200 ${expandedSections.startupStage ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.startupStage && (
                <div className="mt-2 pl-1">
                  <select
                    value={selectedStartupStage}
                    onChange={handleStartupStageChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm !bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4f55c7] focus:border-[#4f55c7] accent-[#4f55c7] transition-all cursor-pointer hover:border-[#4f55c7]"
                  >
                    <option value="">All Stages</option>
                    {STARTUP_STAGES.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.icon} {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          {/* ================= SEEKING OPTIONS FILTER ================= */}
          {viewMode === "startups" && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => toggleSection("seekingOptions")}
                style={cleanButtonStyle}
                className="group mb-4"
              >
                <h3 className="text-base font-bold !text-gray-800 group-hover:!text-[#4f55c7] transition-colors">
                  Seeking
                </h3>
                <ChevronDown
                  className={`!text-gray-500 transform transition-transform duration-200 ${expandedSections.seekingOptions ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.seekingOptions && (
                <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {STARTUP_SEEKING_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center justify-between w-full cursor-pointer group p-1 -ml-1 hover:bg-gray-50 rounded transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSeekingOptions.includes(option)}
                          onChange={() => handleSeekingOptionToggle(option)}
                          className="mt-0.5 w-4 h-4 rounded border-gray-300 !text-[#4f55c7] focus:ring-[#4f55c7] accent-[#4f55c7] cursor-pointer"
                        />
                        <span className="text-sm !text-gray-600 group-hover:!text-gray-900 leading-tight select-none">
                          {option}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
