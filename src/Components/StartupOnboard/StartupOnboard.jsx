import { useState } from "react";
// import {
//   ChevronRight,
//   CheckCircle2,
//   ChevronDown,
//   ChevronUp,
//   Search,
//   X,
//   Users,
//   User,
//   Briefcase,
//   Eye,
//   EyeOff,
// } from "lucide-react";
import {
  ROLE_LEVELS,
  INDUSTRY_EXPERTISE,
  COMPANY_STAGES,
  PROFILE_TYPES,
  SKILLS_LIST,
  TEAM_SIZES,
  STARTUP_STAGES,
  STARTUP_VISIBILITY_MODES,
  STARTUP_TEAM_SIZES,
  STARTUP_SEEKING_OPTIONS,
  STARTUP_FUNDING_STATUS,
  TARGET_MARKETS,
} from "../../lib/constants";

const Icon = ({ children, className = "" }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>
    {children}
  </span>
);
export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  // Step 1 States
  const [selectedProfileType, setSelectedProfileType] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");

  // Existing Mentor Flow States (Now Steps 2 & 3)
  const [roleLevel, setRoleLevel] = useState("");
  const [companyStage, setCompanyStage] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [customExpertise, setCustomExpertise] = useState({});
  const [showOtherInput, setShowOtherInput] = useState({});
  const [expandedIndustries, setExpandedIndustries] = useState({});

  // Service Partner States

  const [servicePartnerType, setServicePartnerType] = useState("individual");
  const [teamSize, setTeamSize] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [minProjectPrice, setMinProjectPrice] = useState("");

  // Startup States
  const [startupName, setStartupName] = useState("");
  const [startupTagline, setStartupTagline] = useState("");
  const [founderName, setFounderName] = useState("");
  const [startupEmail, setStartupEmail] = useState("");
  const [visibilityMode, setVisibilityMode] = useState("");
  const [startupStage, setStartupStage] = useState("");
  const [startupTeamSize, setStartupTeamSize] = useState("");
  const [selectedStartupIndustries, setSelectedStartupIndustries] = useState(
    [],
  );
  const [targetMarket, setTargetMarket] = useState("");

  // Step 1 Handlers
  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  // Existing Handlers
  const handleExpertiseToggle = (skill, industry) => {
    if (!selectedExpertise.includes(skill)) {
      setSelectedExpertise([...selectedExpertise, skill]);
      if (!selectedIndustries.includes(industry)) {
        setSelectedIndustries([...selectedIndustries, industry]);
      }
    } else {
      const newExpertise = selectedExpertise.filter((s) => s !== skill);
      setSelectedExpertise(newExpertise);

      const hasExpertiseInIndustry = newExpertise.some((exp) =>
        INDUSTRY_EXPERTISE[industry]?.includes(exp),
      );
      if (!hasExpertiseInIndustry) {
        setSelectedIndustries(
          selectedIndustries.filter((ind) => ind !== industry),
        );
      }
    }
  };

  const handleAddCustomExpertise = (industry, customSkill) => {
    if (customSkill.trim()) {
      const newSkill = `${customSkill} (Custom)`;
      if (!selectedExpertise.includes(newSkill)) {
        setSelectedExpertise([...selectedExpertise, newSkill]);
        if (!selectedIndustries.includes(industry)) {
          setSelectedIndustries([...selectedIndustries, industry]);
        }
      }
      setCustomExpertise({ ...customExpertise, [industry]: "" });
      setShowOtherInput({ ...showOtherInput, [industry]: false });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (selectedProfileType) {
        if (
          selectedProfileType === "mentor" ||
          selectedProfileType === "service-partner" ||
          selectedProfileType === "startup"
        ) {
          setStep(2);
        } else {
          // For non-mentor/non-service-partner/non-startup profiles, we currently just mark as complete
          setCompleted(true);
        }
      }
    } else if (step === 2) {
      if (selectedProfileType === "mentor") {
        if (roleLevel) {
          // If CXO is selected, require company stage before proceeding
          if (roleLevel === "CXO" && !companyStage) {
            return;
          }
          setStep(3);
        }
      } else if (selectedProfileType === "service-partner") {
        if (selectedExpertise.length > 0) {
          setStep(3);
        }
      } else if (selectedProfileType === "startup") {
        if (
          startupName &&
          startupTagline &&
          founderName &&
          startupEmail &&
          visibilityMode
        ) {
          setStep(3);
        }
      }
    } else if (step === 3) {
      if (selectedProfileType === "mentor" && selectedExpertise.length > 0) {
        setCompleted(true);
      } else if (selectedProfileType === "service-partner") {
        if (servicePartnerType === "agency" && !teamSize) return;
        if (!foundedYear || !minProjectPrice) return;
        setCompleted(true);
      } else if (selectedProfileType === "startup") {
        if (
          startupStage &&
          startupTeamSize &&
          selectedStartupIndustries.length > 0 &&
          targetMarket
        ) {
          setCompleted(true);
        }
      }
    }
  };

  const handleRoleLevelSelect = (level) => {
    setRoleLevel(level);
    // Reset company stage if CXO is deselected
    if (level !== "CXO") {
      setCompanyStage("");
    }
  };

  const toggleIndustry = (industry) => {
    setExpandedIndustries({
      ...expandedIndustries,
      [industry]: !expandedIndustries[industry],
    });
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  // Calculate progress based on total steps (3 for mentor/service-partner/startup, 1 for others currently)
  const totalSteps =
    selectedProfileType === "mentor" ||
    selectedProfileType === "service-partner" ||
    selectedProfileType === "startup"
      ? 3
      : 1;
  const progressPercentage = (step / totalSteps) * 100;

  // Startup handlers
  const handleStartupIndustryToggle = (industry) => {
    if (selectedStartupIndustries.includes(industry)) {
      setSelectedStartupIndustries(
        selectedStartupIndustries.filter((ind) => ind !== industry),
      );
    } else {
      if (selectedStartupIndustries.length < 5) {
        setSelectedStartupIndustries([...selectedStartupIndustries, industry]);
      }
    }
  };

  const filteredSkills = SKILLS_LIST.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.toLowerCase()),
  );

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="mb-6 flex justify-center">
            {/* <CheckCircle2 className="w-16 h-16 text-green-500" /> */}

            <Icon className="text-green-500 text-2xl">✔️</Icon>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Onboarding Complete!
          </h1>

          <div className="text-left bg-slate-50 p-4 rounded-lg mb-6 space-y-2">
            <p className="text-slate-600">
              Profile Type:{" "}
              <span className="font-semibold text-slate-900">
                {PROFILE_TYPES.find((t) => t.id === selectedProfileType)?.label}
              </span>
            </p>

            {selectedProfileType === "mentor" && (
              <>
                <div className="h-px bg-slate-200 my-2" />
                <p className="text-slate-600">
                  Role/Level:{" "}
                  <span className="font-semibold text-slate-900">
                    {roleLevel}
                  </span>
                </p>
                {roleLevel === "CXO" && companyStage && (
                  <p className="text-slate-600">
                    Company Stage:{" "}
                    <span className="font-semibold text-slate-900">
                      {companyStage}
                    </span>
                  </p>
                )}
                <p className="text-slate-600">
                  Expertise:{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedExpertise.length} areas
                  </span>
                </p>
              </>
            )}

            {selectedProfileType === "service-partner" && (
              <>
                <div className="h-px bg-slate-200 my-2" />
                <p className="text-slate-600">
                  Services:{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedExpertise.length} areas
                  </span>
                </p>
                <p className="text-slate-600 capitalize">
                  Type:{" "}
                  <span className="font-semibold text-slate-900">
                    {servicePartnerType}
                  </span>
                </p>
                {servicePartnerType === "agency" && (
                  <p className="text-slate-600">
                    Team Size:{" "}
                    <span className="font-semibold text-slate-900">
                      {teamSize}
                    </span>
                  </p>
                )}
                <p className="text-slate-600">
                  Founded:{" "}
                  <span className="font-semibold text-slate-900">
                    {foundedYear}
                  </span>
                </p>
                <p className="text-slate-600">
                  Starts at:{" "}
                  <span className="font-semibold text-slate-900">
                    ${minProjectPrice}
                  </span>
                </p>
              </>
            )}

            {selectedProfileType === "startup" && (
              <>
                <div className="h-px bg-slate-200 my-2" />
                <p className="text-slate-600">
                  Startup:{" "}
                  <span className="font-semibold text-slate-900">
                    {startupName}
                  </span>
                </p>
                <p className="text-slate-600">
                  Stage:{" "}
                  <span className="font-semibold text-slate-900">
                    {STARTUP_STAGES.find((s) => s.id === startupStage)?.label}
                  </span>
                </p>
                <p className="text-slate-600">
                  Team Size:{" "}
                  <span className="font-semibold text-slate-900">
                    {startupTeamSize}
                  </span>
                </p>
                <p className="text-slate-600">
                  Industries:{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedStartupIndustries.length}
                  </span>
                </p>
                <p className="text-slate-600">
                  Target Market:{" "}
                  <span className="font-semibold text-slate-900">
                    {targetMarket}
                  </span>
                </p>
                <p className="text-slate-600">
                  Visibility:{" "}
                  <span className="font-semibold text-slate-900">
                    {
                      STARTUP_VISIBILITY_MODES.find(
                        (m) => m.id === visibilityMode,
                      )?.label
                    }
                  </span>
                </p>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setStep(1);
              setRoleLevel("");
              setCompanyStage("");
              setSelectedIndustries([]);
              setSelectedExpertise([]);
              setSelectedProfileType("");
              setSelectedSkills([]);
              setServicePartnerType("individual");
              setTeamSize("");
              setFoundedYear("");
              setMinProjectPrice("");
              setStartupName("");
              setStartupTagline("");
              setFounderName("");
              setStartupEmail("");
              setVisibilityMode("");
              setStartupStage("");
              setStartupTeamSize("");
              setSelectedStartupIndustries([]);
              setTargetMarket("");
              setCompleted(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Start Again
          </button>
          <button
            onClick={() => {
              if (selectedProfileType === "startup") {
                window.location.href = "/profile/startup";
              } else {
                window.location.href = "/";
              }
            }}
            className="w-full mt-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 rounded-lg transition-colors"
          >
            {selectedProfileType === "startup" ? "Go to Profile" : "Go to Home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome to BEYINC
          </h1>
          <p className="text-lg text-slate-600">
            Let's personalize your experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-slate-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Indicators (Only show for Mentor, Service Partner, or Startup flow) */}
        {(selectedProfileType === "mentor" ||
          selectedProfileType === "service-partner" ||
          selectedProfileType === "startup") && (
          <div className="flex gap-2 mb-12">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold transition-all ${
                  step === num
                    ? "bg-blue-600 text-white shadow-lg"
                    : step > num
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                }`}
              >
                {step > num ? "✓" : num}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* STEP 1: Profile Type */}
          {step === 1 && (
            <div className="space-y-10">
              {/* Profile Type Section */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Tell us who you are?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PROFILE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedProfileType(type.id)}
                      className={`p-6 rounded-xl text-left transition-all border-2 flex flex-col h-full ${
                        selectedProfileType === type.id
                          ? "bg-blue-50 border-blue-600 shadow-md"
                          : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="p-3 bg-blue-100 w-fit rounded-lg mb-4 text-2xl">
                        {type.icon}
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">
                        {type.label}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* STEP 2: Role/Level (Mentor) OR Expertise (Service Partner) */}
          {step === 2 && (
            <>
              {selectedProfileType === "mentor" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    What's your role or level?
                  </h2>
                  <p className="text-slate-600 mb-6">
                    This helps us match you with mentors and resources tailored
                    to your career stage
                  </p>

                  {/* Role Level Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {ROLE_LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleRoleLevelSelect(level)}
                        className={`px-4 py-4 rounded-lg font-medium transition-all text-left border-2 ${
                          roleLevel === level
                            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{level}</span>
                          {roleLevel === level && (
                            <>
                              <Icon className="text-green-500 text-2xl">
                                ✔️
                              </Icon>
                              {/* <CheckCircle2 className="w-5 h-5 text-white" /> */}
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Company Stage Selection (only shown when CXO is selected) */}
                  {roleLevel === "CXO" && (
                    <div className="mt-8 pt-8 border-t-2 border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        What stage is your company at?
                      </h3>
                      <p className="text-slate-600 mb-6">
                        This helps us understand your company context and match
                        you with relevant mentors
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {COMPANY_STAGES.map((stage) => (
                          <button
                            key={stage.id}
                            onClick={() => setCompanyStage(stage.label)}
                            className={`px-5 py-5 rounded-xl font-medium transition-all text-left border-2 ${
                              companyStage === stage.label
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105"
                                : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{stage.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-sm">
                                    {stage.label}
                                  </span>
                                  {companyStage === stage.label && (
                                    <>
                                      <Icon className="text-green-500 text-2xl">
                                        ✔️
                                      </Icon>
                                      {/* <CheckCircle2 */}
                                      {/**/}
                                      {/*   className={`w-5 h-5 ${ */}
                                      {/*     companyStage === stage.label */}
                                      {/*       ? "text-white" */}
                                      {/*       : "text-blue-600" */}
                                      {/*   }`} */}
                                      {/* /> */}
                                    </>
                                  )}
                                </div>
                                <p
                                  className={`text-xs mt-1 ${
                                    companyStage === stage.label
                                      ? "text-blue-100"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {stage.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedProfileType === "startup" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Tell us about your startup
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Provide basic information about your startup. Don't worry,
                    you can add more details later.
                  </p>

                  <div className="space-y-6">
                    {/* Startup Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Startup Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={startupName}
                        onChange={(e) => setStartupName(e.target.value)}
                        placeholder="e.g. TechVenture"
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Tagline */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Tagline / One-liner{" "}
                        <span className="text-red-500">*</span>
                        <span className="text-xs font-normal text-slate-500 ml-2">
                          (Max 100 characters)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={startupTagline}
                        onChange={(e) =>
                          setStartupTagline(e.target.value.slice(0, 100))
                        }
                        placeholder="e.g. Revolutionizing healthcare through AI"
                        maxLength={100}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {startupTagline.length}/100 characters
                      </p>
                    </div>

                    {/* Founder Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Founder/Co-founder Name(s){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={founderName}
                        onChange={(e) => setFounderName(e.target.value)}
                        placeholder="e.g. John Doe, Jane Smith"
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={startupEmail}
                        onChange={(e) => setStartupEmail(e.target.value)}
                        placeholder="contact@startup.com"
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Visibility Mode */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-4">
                        Visibility Mode <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {STARTUP_VISIBILITY_MODES.map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setVisibilityMode(mode.id)}
                            className={`p-5 rounded-xl text-left transition-all border-2 ${
                              visibilityMode === mode.id
                                ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                                : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{mode.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className={`font-bold text-sm ${
                                      visibilityMode === mode.id
                                        ? "text-white"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {mode.label}
                                  </span>
                                  {visibilityMode === mode.id && (
                                    <>
                                      <Icon className="text-green-500 text-2xl">
                                        ✔️
                                      </Icon>
                                      {/* <CheckCircle2 className="w-5 h-5 text-white" /> */}
                                    </>
                                  )}
                                </div>
                                <p
                                  className={`text-xs mt-1 ${
                                    visibilityMode === mode.id
                                      ? "text-blue-100"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {mode.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedProfileType === "service-partner" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Select your services
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Choose the industries and services you offer to clients.
                  </p>

                  {/* Reuse Industry/Expertise UI */}
                  <div className="space-y-3">
                    {Object.entries(INDUSTRY_EXPERTISE).map(
                      ([industry, skills]) => {
                        const isExpanded = expandedIndustries[industry];
                        const hasSelectedExpertise = skills.some((skill) =>
                          selectedExpertise.includes(skill),
                        );

                        return (
                          <div
                            key={industry}
                            className={`border-2 rounded-lg transition-all ${
                              isExpanded
                                ? "border-blue-600 shadow-md bg-blue-50/30"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            {/* Industry Dropdown Header */}
                            <button
                              onClick={() => toggleIndustry(industry)}
                              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                    selectedIndustries.includes(industry)
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-slate-300"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedIndustries.includes(industry)) {
                                      const industrySkills =
                                        INDUSTRY_EXPERTISE[industry] || [];
                                      const newExpertise =
                                        selectedExpertise.filter(
                                          (exp) =>
                                            !industrySkills.includes(exp),
                                        );
                                      setSelectedExpertise(newExpertise);
                                      setSelectedIndustries(
                                        selectedIndustries.filter(
                                          (ind) => ind !== industry,
                                        ),
                                      );
                                    } else {
                                      setSelectedIndustries([
                                        ...selectedIndustries,
                                        industry,
                                      ]);
                                    }
                                  }}
                                >
                                  {selectedIndustries.includes(industry) && (
                                    <span className="text-white text-sm">
                                      ✓
                                    </span>
                                  )}
                                </button>
                                <h3 className="font-semibold text-slate-900 text-lg">
                                  {industry}
                                </h3>
                                {hasSelectedExpertise && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {
                                      skills.filter((skill) =>
                                        selectedExpertise.includes(skill),
                                      ).length
                                    }{" "}
                                    selected
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {isExpanded ? <Icon>▴</Icon> : <Icon>▾</Icon>}
                              </div>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className="px-5 pb-5 pt-2 border-t border-slate-200 mt-2">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                  {skills.map((skill) => (
                                    <button
                                      key={skill}
                                      onClick={() =>
                                        handleExpertiseToggle(skill, industry)
                                      }
                                      className={`px-4 py-3 rounded-lg font-medium transition-all text-sm text-left border-2 ${
                                        selectedExpertise.includes(skill)
                                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>{skill}</span>
                                        {selectedExpertise.includes(skill) && (
                                          <Icon className="text-green-500 text-2xl">
                                            ✔️
                                          </Icon>
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      setShowOtherInput({
                                        ...showOtherInput,
                                        [industry]: true,
                                      })
                                    }
                                    className="px-4 py-2 rounded-lg font-medium transition-all text-sm border-2 border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                                  >
                                    + Add Custom Service
                                  </button>
                                  {showOtherInput[industry] && (
                                    <div className="flex items-center gap-2 flex-1">
                                      <input
                                        type="text"
                                        value={customExpertise[industry] || ""}
                                        onChange={(e) =>
                                          setCustomExpertise({
                                            ...customExpertise,
                                            [industry]: e.target.value,
                                          })
                                        }
                                        placeholder="Enter custom service..."
                                        className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-blue-600"
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleAddCustomExpertise(
                                              industry,
                                              customExpertise[industry] || "",
                                            );
                                          }
                                        }}
                                      />
                                      <button
                                        onClick={() =>
                                          handleAddCustomExpertise(
                                            industry,
                                            customExpertise[industry] || "",
                                          )
                                        }
                                        className="px-4 py-2 rounded-lg font-medium transition-all text-sm bg-blue-600 text-white hover:bg-blue-700"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-semibold">
                      Selected: {selectedExpertise.length} services across{" "}
                      {selectedIndustries.length} industries
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 3: Industry/Expertise (Mentor) OR Partner Details (Service Partner) */}
          {step === 3 && (
            <>
              {selectedProfileType === "mentor" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Select your industry and expertise
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Click on an industry to expand and select expertise areas.
                    Industries will be automatically selected based on your
                    choices.
                  </p>
                  <div className="space-y-3">
                    {/* Reuse Industry/Expertise UI (Same as above but for mentor step 3) */}
                    {Object.entries(INDUSTRY_EXPERTISE).map(
                      ([industry, skills]) => {
                        const isExpanded = expandedIndustries[industry];
                        const hasSelectedExpertise = skills.some((skill) =>
                          selectedExpertise.includes(skill),
                        );

                        return (
                          <div
                            key={industry}
                            className={`border-2 rounded-lg transition-all ${
                              isExpanded
                                ? "border-blue-600 shadow-md bg-blue-50/30"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <button
                              onClick={() => toggleIndustry(industry)}
                              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                    selectedIndustries.includes(industry)
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-slate-300"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedIndustries.includes(industry)) {
                                      const industrySkills =
                                        INDUSTRY_EXPERTISE[industry] || [];
                                      const newExpertise =
                                        selectedExpertise.filter(
                                          (exp) =>
                                            !industrySkills.includes(exp),
                                        );
                                      setSelectedExpertise(newExpertise);
                                      setSelectedIndustries(
                                        selectedIndustries.filter(
                                          (ind) => ind !== industry,
                                        ),
                                      );
                                    } else {
                                      setSelectedIndustries([
                                        ...selectedIndustries,
                                        industry,
                                      ]);
                                    }
                                  }}
                                >
                                  {selectedIndustries.includes(industry) && (
                                    <span className="text-white text-sm">
                                      ✓
                                    </span>
                                  )}
                                </button>
                                <h3 className="font-semibold text-slate-900 text-lg">
                                  {industry}
                                </h3>
                                {hasSelectedExpertise && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {
                                      skills.filter((skill) =>
                                        selectedExpertise.includes(skill),
                                      ).length
                                    }{" "}
                                    selected
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {isExpanded ? <Icon>▴</Icon> : <Icon>▾</Icon>}
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="px-5 pb-5 pt-2 border-t border-slate-200 mt-2">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                  {skills.map((skill) => (
                                    <button
                                      key={skill}
                                      onClick={() =>
                                        handleExpertiseToggle(skill, industry)
                                      }
                                      className={`px-4 py-3 rounded-lg font-medium transition-all text-sm text-left border-2 ${
                                        selectedExpertise.includes(skill)
                                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>{skill}</span>
                                        {selectedExpertise.includes(skill) && (
                                          <Icon className="text-green-500 text-2xl">
                                            ✔️
                                          </Icon>
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      setShowOtherInput({
                                        ...showOtherInput,
                                        [industry]: true,
                                      })
                                    }
                                    className="px-4 py-2 rounded-lg font-medium transition-all text-sm border-2 border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                                  >
                                    + Add Custom Expertise
                                  </button>
                                  {showOtherInput[industry] && (
                                    <div className="flex items-center gap-2 flex-1">
                                      <input
                                        type="text"
                                        value={customExpertise[industry] || ""}
                                        onChange={(e) =>
                                          setCustomExpertise({
                                            ...customExpertise,
                                            [industry]: e.target.value,
                                          })
                                        }
                                        placeholder="Enter custom expertise..."
                                        className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-blue-600"
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleAddCustomExpertise(
                                              industry,
                                              customExpertise[industry] || "",
                                            );
                                          }
                                        }}
                                      />
                                      <button
                                        onClick={() =>
                                          handleAddCustomExpertise(
                                            industry,
                                            customExpertise[industry] || "",
                                          )
                                        }
                                        className="px-4 py-2 rounded-lg font-medium transition-all text-sm bg-blue-600 text-white hover:bg-blue-700"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-semibold">
                      Selected: {selectedExpertise.length} expertise area
                      {selectedExpertise.length !== 1 ? "s" : ""} across{" "}
                      {selectedIndustries.length} industrie
                      {selectedIndustries.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}

              {selectedProfileType === "service-partner" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Tell us about your practice
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Provide details about your business structure and
                    experience.
                  </p>

                  <div className="space-y-8">
                    {/* Individual vs Agency */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-900">
                        Are you an individual or an agency?
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setServicePartnerType("individual")}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            servicePartnerType === "individual"
                              ? "border-blue-600 bg-blue-50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon
                              className={`w-6 h-6 ${
                                servicePartnerType === "individual"
                                  ? "text-blue-600"
                                  : "text-slate-400"
                              }`}
                            >
                              👤
                            </Icon>

                            <span
                              className={`font-semibold ${
                                servicePartnerType === "individual"
                                  ? "text-blue-900"
                                  : "text-slate-700"
                              }`}
                            >
                              Individual / Freelancer
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            I work solo on projects
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setServicePartnerType("agency")}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            servicePartnerType === "agency"
                              ? "border-blue-600 bg-blue-50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon
                              className={`w-6 h-6 ${
                                servicePartnerType === "agency"
                                  ? "text-blue-600"
                                  : "text-slate-400"
                              }`}
                            >
                              👥
                            </Icon>

                            <span
                              className={`font-semibold ${
                                servicePartnerType === "agency"
                                  ? "text-blue-900"
                                  : "text-slate-700"
                              }`}
                            >
                              Agency / Company
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            We are a team of people
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Team Size (Agency only) */}
                    {servicePartnerType === "agency" && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-bold text-slate-900">
                          What is your team size?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {TEAM_SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setTeamSize(size)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                                teamSize === size
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Founded Year */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-900">
                          {servicePartnerType === "agency"
                            ? "Year Founded"
                            : "Year Started"}
                        </label>
                        <div className="relative">
                          <Icon className="text-xl">💼</Icon>

                          <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={foundedYear}
                            onChange={(e) => setFoundedYear(e.target.value)}
                            placeholder="e.g. 2018"
                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-900">
                          Minimum Gig Price ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                            $
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={minProjectPrice}
                            onChange={(e) => setMinProjectPrice(e.target.value)}
                            placeholder="e.g. 500"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Provide the year established and your minimum engagement
                      fee to set client expectations.
                    </p>
                  </div>
                </div>
              )}

              {selectedProfileType === "startup" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Startup Stage & Industry
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Tell us about your startup stage and select your industries.
                    You can add more details in your profile later.
                  </p>

                  <div className="space-y-8">
                    {/* Startup Stage */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-4">
                        Current Stage <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {STARTUP_STAGES.map((stage) => (
                          <button
                            key={stage.id}
                            type="button"
                            onClick={() => setStartupStage(stage.id)}
                            className={`px-5 py-5 rounded-xl font-medium transition-all text-left border-2 ${
                              startupStage === stage.id
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105"
                                : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{stage.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-sm">
                                    {stage.label}
                                  </span>
                                  {startupStage === stage.id && (
                                    <Icon className="text-green-500 text-2xl">
                                      ✔️
                                    </Icon>
                                  )}
                                </div>
                                <p
                                  className={`text-xs mt-1 ${
                                    startupStage === stage.id
                                      ? "text-blue-100"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {stage.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Team Size */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-4">
                        Team Size <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {STARTUP_TEAM_SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setStartupTeamSize(size)}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                              startupTeamSize === size
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{size}</span>
                              {startupTeamSize === size && (
                                <Icon className="text-green-500 text-2xl">
                                  ✔️
                                </Icon>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Industry Selection - Reuse the industry selector */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-4">
                        Industries <span className="text-red-500">*</span>
                        <span className="text-xs font-normal text-slate-500 ml-2">
                          (Select at least one, max 5)
                        </span>
                      </label>
                      <div className="space-y-3">
                        {Object.keys(INDUSTRY_EXPERTISE).map((industry) => {
                          const isSelected =
                            selectedStartupIndustries.includes(industry);
                          return (
                            <button
                              key={industry}
                              type="button"
                              onClick={() =>
                                handleStartupIndustryToggle(industry)
                              }
                              className={`w-full px-5 py-4 rounded-lg text-left transition-all border-2 ${
                                isSelected
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                  {industry}
                                </span>
                                {isSelected && (
                                  <Icon className="text-green-500 text-2xl">
                                    ✔️
                                  </Icon>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700 font-semibold">
                          Selected: {selectedStartupIndustries.length} industr
                          {selectedStartupIndustries.length !== 1 ? "ies" : "y"}
                        </p>
                      </div>
                    </div>

                    {/* Target Market */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-4">
                        Target Market <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TARGET_MARKETS.map((market) => (
                          <button
                            key={market}
                            type="button"
                            onClick={() => setTargetMarket(market)}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                              targetMarket === market
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{market}</span>
                              {targetMarket === market && (
                                <Icon className="text-green-500 text-2xl">
                                  ✔️
                                </Icon>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-200 hover:bg-slate-300 text-slate-900"
          >
            Previous
          </button>

          <div className="flex-1 flex gap-2">
            {step === 1 && (
              <button
                onClick={() => {
                  // Save logic for later
                  alert("Saved!");
                }}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Save
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedProfileType) ||
                (step === 2 &&
                  selectedProfileType === "mentor" &&
                  (!roleLevel || (roleLevel === "CXO" && !companyStage))) ||
                (step === 2 &&
                  selectedProfileType === "service-partner" &&
                  selectedExpertise.length === 0) ||
                (step === 2 &&
                  selectedProfileType === "startup" &&
                  (!startupName ||
                    !startupTagline ||
                    !founderName ||
                    !startupEmail ||
                    !visibilityMode)) ||
                (step === 3 &&
                  selectedProfileType === "mentor" &&
                  selectedExpertise.length === 0) ||
                (step === 3 &&
                  selectedProfileType === "service-partner" &&
                  (!foundedYear ||
                    !minProjectPrice ||
                    (servicePartnerType === "agency" && !teamSize))) ||
                (step === 3 &&
                  selectedProfileType === "startup" &&
                  (!startupStage ||
                    !startupTeamSize ||
                    selectedStartupIndustries.length === 0 ||
                    !targetMarket))
              }
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              {step ===
              (selectedProfileType === "mentor" ||
              selectedProfileType === "service-partner" ||
              selectedProfileType === "startup"
                ? 3
                : 1)
                ? "Submit"
                : "Next"}
              {step <
                (selectedProfileType === "mentor" ||
                selectedProfileType === "service-partner" ||
                selectedProfileType === "startup"
                  ? 3
                  : 1) && <Icon className="text-lg">›</Icon>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
