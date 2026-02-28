import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import BoxCategories from "./BoxCategories";
import { ApiServices } from "../../Services/ApiServices";
import { INDUSTRY_EXPERTISE, ROLE_LEVELS, COMPANY_STAGES, domain_subdomain, allskills } from "../../Utils";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Startup from "../OnboardComponents/Startup";
import ProfileImageUpdate from "../Navbar/ProfileImageUpdate";
import WelcomeScreen from "./WelcomeScreen";
import { useNavigate } from "react-router-dom";
const EntryDetails = () => {
  /* ---------------- COMMON ---------------- */
  const [step, setStep] = useState(2); // Step 1 (role selection) commented out — start directly at "Tell us about yourself"
  const [selectedCategory, setSelectedCategory] = useState("Individual"); // Default category so Step 2 renders
  const [showWelcome, setShowWelcome] = useState(false);

  /* ---------------- USER ---------------- */
  const [username, setUsername] = useState("");
  const [headline, setHeadline] = useState("");
  const [image, setImage] = useState(null);

  /* ---------------- MENTOR ---------------- */
  const [roleLevel, setRoleLevel] = useState("");
  const [companyStage, setCompanyStage] = useState("");
  const [expandedIndustries, setExpandedIndustries] = useState({});
  const [selectedExpertise, setSelectedExpertise] = useState({});

  /* ---------------- NEW COMMON FIELDS ---------------- */
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedExpertiseList, setSelectedExpertiseList] = useState([]);
  const [expertiseSearch, setExpertiseSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");

  /* Interests */
  const INTEREST_OPTIONS = [
    "Startup Ideation",
    "Startup Growth",
    "Co-founder Search",
    "Business Model Ideation",
    "Problem Statement Validation",
    "Looking for jobs/hiring",
    "Others",
  ];
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [otherInterest, setOtherInterest] = useState("");
const navigate = useNavigate();
  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const industryKeys = useMemo(() => Object.keys(domain_subdomain), []);
  const filteredIndustries = useMemo(
    () => industryKeys.filter((k) => k.toLowerCase().includes(industrySearch.toLowerCase())),
    [industryKeys, industrySearch]
  );
  const filteredExpertise = useMemo(
    () => allskills.filter((s) => s.toLowerCase().includes(expertiseSearch.toLowerCase())),
    [expertiseSearch]
  );

  const toggleSelectedIndustry = (industry) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const toggleSelectedExpertiseItem = (skill) => {
    setSelectedExpertiseList((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  /* ---------------- AUTH ---------------- */
  const loginDetails = useSelector((store) => store.auth.loginDetails);
  const [email, setEmail] = useState(null);
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    if (loginDetails?.email && loginDetails?.user_id) {
      setEmail(loginDetails.email);
      setUserId(loginDetails.user_id);
    }
  }, [loginDetails]);

  const [openEditPfp, setOpenEditPfp] = useState(false);



  const [formState, setFormState] = useState({
    fullName: "",
    headline: "",
    role: null,
    image: null,
    mobileNumber: "",
    twitter: "",
    linkedin: "",
    country: "",
    state: "",
    town: "",
    languages: [],
  });
  /* ---------------- HELPERS ---------------- */

  const toggleIndustry = (industry) => {
    setExpandedIndustries((p) => ({ ...p, [industry]: !p[industry] }));
  };

  const handleExpertiseToggle = (industry, skill) => {
    setSelectedExpertise((prev) => {
      const current = prev[industry] || [];
      return {
        ...prev,
        [industry]: current.includes(skill)
          ? current.filter((s) => s !== skill)
          : [...current, skill],
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 4 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    try {
      console.log("Before API call:", { user_id, email, hasImage: !!image });
      if (image) {
        await ApiServices.updateuserProfileImage({
          userId: user_id,
          image,
          email,
        });
      }

      await ApiServices.InputEntryData({
        username,
        headline,
        selectedCategory,
        role_level: roleLevel,
        companyStage,
        mentorExpertise: selectedExpertise,
        beyincProfile:
          selectedCategory === "Mentor"
            ? "Mentor"
            : selectedCategory === "Startup"
              ? "Startup"
              : "Enterpreneur",
        phoneNumber,
        linkedIn,
        yearsOfExperience,
        industries: selectedIndustries,
        expertise: selectedExpertiseList,
        interests: [
          ...selectedInterests.filter((i) => i !== "Others"),
          ...(selectedInterests.includes("Others") && otherInterest.trim()
            ? [otherInterest.trim()]
            : []),
        ],
      });

      setShowWelcome(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  /* Show welcome screen after profile completion */
  if (showWelcome) {
   navigate("/welcomeScreen", {
      state: { username }
    });
  }

  // Single-step flow: step 2 is the only visible step
  const totalSteps = 1;
  const displayStep = 1;
  const progressPercentage = 100;

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white md:m-10 p-6 shadow-lg rounded-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700">
            Step {displayStep} of {totalSteps}
          </span>
          <span className="text-sm text-slate-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* <h2 className="font-bold text-xl mb-6">Tell us who you are *</h2> */}

      {/* ---------------- STEP 1 (COMMENTED OUT — role selection skipped) ---------------- */}
      {/* step === 1 && (
        <>
          <BoxCategories
            onCategoryClick={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <div className="flex justify-end mt-8">
            <button
              disabled={!selectedCategory}
              onClick={() => {
                setStep(2);
                setUsername("");
                setHeadline("");
                setImage(null);
                setSelectedExpertise({});
                setRoleLevel("");
                toggleIndustry({});
                setExpandedIndustries({});
              }}
              className="flex-1 md:flex-none px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Next
            </button>
          </div>
        </>
      ) */}

      {/* ---------------- STEP 2 (MENTOR) ---------------- */}
      {step === 2 && selectedCategory === "Mentor" && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Tell us about yourself</h3>
          <p className="text-sm text-gray-500 mb-6">
            Provide basic information about yourself. Don't worry, you can add more details later.
          </p>

          <div className="space-y-5">

            {/* Your Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="e.g. John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Tagline / Headline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tagline <span className="text-gray-400 font-normal">(Max 100 characters)</span>
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="e.g. Mentor | SaaS Builder | Angel Investor"
                maxLength={100}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">{headline.length}/100 characters</p>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profile Photo</label>
              <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-3">
                <input
                  id="mentor-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="mentor-photo"
                  className="cursor-pointer px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded border border-gray-300 transition-colors"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-400">{image ? "File chosen" : "No file chosen"}</span>
                {image && (
                  <img src={image} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-gray-200 ml-auto" />
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="contact@example.com"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">LinkedIn Profile</label>
              <input
                type="url"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
              />
            </div>

            {/* --- Commented out: Years of Experience, Industry/Sector, Expertise, Interests, Role Level --- */}
            {/* <div><label>Years of Experience</label><input type="number" value={yearsOfExperience} .../></div> */}
            {/* Industry/Sector tag selector */}
            {/* Expertise tag selector */}
            {/* Interests tag selector */}
            {/* Role Level grid (ROLE_LEVELS.map) */}
          </div>

          {/* Industry & Expertise Section (merged from old Step 3) */}
          <div className="border-t border-gray-200 pt-6 mt-2">
            <h4 className="text-base font-bold text-gray-800 mb-1">Select your industry and expertise</h4>
            <p className="text-sm text-gray-500 mb-4">Choose the industries you're experienced in and select specific skills.</p>

            <div className="space-y-2 mb-4">
              {Object.entries(INDUSTRY_EXPERTISE).map(([industry, skills]) => {
                const selectedCount = selectedExpertise[industry]?.length || 0;
                return (
                  <div key={industry} className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 transition-all">
                    <div
                      onClick={() => toggleIndustry(industry)}
                      className="flex items-center justify-between p-3.5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-sm text-gray-800">{industry}</span>
                        {selectedCount > 0 && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                            {selectedCount} selected
                          </span>
                        )}
                      </div>
                      {expandedIndustries[industry]
                        ? <ChevronUp className="w-4 h-4 text-gray-500" />
                        : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </div>
                    {expandedIndustries[industry] && (
                      <div className="p-4 bg-white border-t border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {skills.map((skill) => {
                            const isSelected = selectedExpertise[industry]?.includes(skill);
                            return (
                              <div
                                key={skill}
                                onClick={() => handleExpertiseToggle(industry, skill)}
                                className={`p-2.5 border-2 rounded-lg cursor-pointer transition-all text-xs font-medium text-center ${isSelected
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700"
                                  }`}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <span>{skill}</span>
                                  {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {Object.keys(selectedExpertise).length > 0 && (
              <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <p className="text-sm font-medium text-indigo-900">
                  {Object.values(selectedExpertise).flat().length} skills selected across {Object.keys(selectedExpertise).length} {Object.keys(selectedExpertise).length === 1 ? "industry" : "industries"}
                </p>
              </div>
            )}
          </div>

          {/* Visibility Mode — commented out
          <div className="border-t border-gray-200 pt-6 mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Visibility Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: "public", icon: "🌐", label: "Public", desc: "Visible to everyone" },
                { id: "stealth", icon: "🥷", label: "Stealth Mode", desc: "Name hidden, show industry/tags only" },
                { id: "idea", icon: "💡", label: "Idea Stage", desc: "Special badge for pre-launch ideas" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setCompanyStage(mode.id)}
                  className={...}
                >
                  ...
                </button>
              ))}
            </div>
          </div>
          */}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              disabled={!username}
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* ---------------- STEP 2 (INDIVIDUAL / ENTREPRENEUR) ---------------- */}
      {step === 2 && (selectedCategory === "Enterpreneur" || selectedCategory === "Individual") && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Tell us about yourself</h3>
          <p className="text-sm text-gray-500 mb-6">
            Provide basic information about yourself. Don't worry, you can add more details later.
          </p>

          <div className="space-y-5">

            {/* Your Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="e.g. John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Tagline / Headline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tagline <span className="text-gray-400 font-normal">(Max 100 characters)</span>
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder={selectedCategory === "Individual" ? "e.g. Explorer | Community Builder" : "e.g. Founder | SaaS Builder"}
                maxLength={100}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">{headline.length}/100 characters</p>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profile Photo</label>
              <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-3">
                <input
                  id="ind-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="ind-photo"
                  className="cursor-pointer px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded border border-gray-300 transition-colors"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-400">{image ? "File chosen" : "No file chosen"}</span>
                {image && (
                  <img src={image} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-gray-200 ml-auto" />
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="contact@example.com"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">LinkedIn Profile</label>
              <input
                type="url"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="70"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="e.g. 5"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Interests <span className="text-gray-400 font-normal">(Select multiple)</span>
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {INTEREST_OPTIONS.map((interest) => (
                  <div key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`interest-${interest}`}
                      checked={selectedInterests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`interest-${interest}`}
                      className="ml-3 text-sm text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                      {interest}
                    </label>
                  </div>
                ))}
              </div>
              {selectedInterests.includes("Others") && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Please specify your other interest"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    value={otherInterest}
                    onChange={(e) => setOtherInterest(e.target.value)}
                  />
                </div>
              )}
              {selectedInterests.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full flex items-center gap-1"
                    >
                      {interest}
                      <button
                        onClick={() => toggleInterest(interest)}
                        className="ml-1 hover:text-indigo-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>{/* end space-y-5 */}

          {/* Industry & Expertise Section (merged from old Step 3) */}
          <div className="border-t border-gray-200 pt-6 mt-2">
            <h4 className="text-base font-bold text-gray-800 mb-1">Select your industry and expertise</h4>
            <p className="text-sm text-gray-500 mb-4">Choose the industries you're experienced in and select specific skills.</p>

            <div className="space-y-2 mb-4">
              {Object.entries(INDUSTRY_EXPERTISE).map(([industry, skills]) => {
                const selectedCount = selectedExpertise[industry]?.length || 0;
                return (
                  <div key={industry} className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 transition-all">
                    <div
                      onClick={() => toggleIndustry(industry)}
                      className="flex items-center justify-between p-3.5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-sm text-gray-800">{industry}</span>
                        {selectedCount > 0 && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                            {selectedCount} selected
                          </span>
                        )}
                      </div>
                      {expandedIndustries[industry]
                        ? <ChevronUp className="w-4 h-4 text-gray-500" />
                        : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </div>
                    {expandedIndustries[industry] && (
                      <div className="p-4 bg-white border-t border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {skills.map((skill) => {
                            const isSelected = selectedExpertise[industry]?.includes(skill);
                            return (
                              <div
                                key={skill}
                                onClick={() => handleExpertiseToggle(industry, skill)}
                                className={`p-2.5 border-2 rounded-lg cursor-pointer transition-all text-xs font-medium text-center ${isSelected
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700"
                                  }`}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <span>{skill}</span>
                                  {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {Object.keys(selectedExpertise).length > 0 && (
              <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <p className="text-sm font-medium text-indigo-900">
                  {Object.values(selectedExpertise).flat().length} skills selected across {Object.keys(selectedExpertise).length} {Object.keys(selectedExpertise).length === 1 ? "industry" : "industries"}
                </p>
              </div>
            )}
          </div>

          {/* Visibility Mode — commented out
          <div className="border-t border-gray-200 pt-6 mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Visibility Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: "public", icon: "🌐", label: "Public", desc: "Visible to everyone" },
                { id: "stealth", icon: "🥷", label: "Stealth Mode", desc: "Name hidden, show industry/tags only" },
                { id: "idea", icon: "💡", label: "Idea Stage", desc: "Special badge for pre-launch ideas" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setCompanyStage(mode.id)}
                  className={...}
                >
                  ...
                </button>
              ))}
            </div>
          </div>
          */}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              disabled={!username}
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* ---------------- STEP 3 (COMMENTED OUT — merged into Step 2) ---------------- */}
      {/* step === 3 && ... industry/expertise section was here, now embedded in step 2 above */}

      {/* For Startup Onboarding Flow step 2 and 3 is being handled separately in this component */}
      {step > 1 && selectedCategory === "Startup" && (
        <Startup step={step} setStep={setStep} />
      )}
    </div>
  );
};

export default EntryDetails;
