import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BoxCategories from "./BoxCategories";
import { ApiServices } from "../../Services/ApiServices";
import { INDUSTRY_EXPERTISE, ROLE_LEVELS, COMPANY_STAGES } from "../../Utils";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Startup from "../OnboardComponents/Startup";
import ProfileImageUpdate from "../Navbar/ProfileImageUpdate";

const EntryDetails = () => {
  /* ---------------- COMMON ---------------- */
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  /* ---------------- USER ---------------- */
  const [username, setUsername] = useState("");
  const [headline, setHeadline] = useState("");
  const [image, setImage] = useState(null);

  /* ---------------- MENTOR ---------------- */
  const [roleLevel, setRoleLevel] = useState("");
  const [companyStage, setCompanyStage] = useState("");
  const [expandedIndustries, setExpandedIndustries] = useState({});
  const [selectedExpertise, setSelectedExpertise] = useState({});
  const [experienceYears, setExperienceYears] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");

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
        experienceYears,
        linkedinProfile,
        verified: false,
      });

      alert("Profile created successfully!");
      window.location.href = "/posts";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const totalSteps =
    selectedCategory === "" ||
    selectedCategory === "Mentor" ||
    selectedCategory === "Startup" ||
    selectedCategory === "Individual/Entrepreneur"
      ? 3
      : 2;
  const progressPercentage = (step / totalSteps) * 100;

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white md:m-10 p-6 shadow-lg rounded-lg">
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
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* <h2 className="font-bold text-xl mb-6">Tell us who you are *</h2> */}

      {/* ---------------- STEP 1 ---------------- */}
      {step === 1 && (
        <>
          <BoxCategories
            onCategoryClick={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <div className="flex justify-end mt-8">
            <button
              disabled={!selectedCategory}
              onClick={() => setStep(2)}
              className="flex-1 md:flex-none px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ---------------- STEP 2 (MENTOR) ---------------- */}
      {step === 2 && selectedCategory === "Mentor" && (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Tell us about yourself
          </h3>

          <div className="space-y-4 mb-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Enter your full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Profile Photo
                {/* <span className="text-red-500">*</span> */}
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2.5 border-2 border-dashed border-gray-300 rounded cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                onChange={handleImageChange}
              />
              {image && (
                <div className="mt-3">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Role Level Selection */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select your role <span className="text-red-500">*</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {ROLE_LEVELS.map((role) => (
              <React.Fragment key={role}>
                <div
                  onClick={() => setRoleLevel(role)}
                  className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${
                    roleLevel === role
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium">{role}</span>
                    {roleLevel === role && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                {role === "CXO" && roleLevel === "CXO" && (
                  <div className="col-span-2 md:col-span-3 mt-6 pt-6 border-t-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      What stage is your company at?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      This helps us understand your company context and match
                      you with relevant opportunities
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {COMPANY_STAGES.map((stage) => (
                        <button
                          key={stage.id}
                          onClick={() => setCompanyStage(stage.label)}
                          className={`p-4 rounded-lg font-medium transition-all text-left border-2 ${
                            companyStage === stage.label
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{stage.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm">
                                  {stage.label}
                                </span>
                                {companyStage === stage.label && (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                              </div>
                              <p
                                className={`text-xs ${
                                  companyStage === stage.label
                                    ? "text-indigo-100"
                                    : "text-gray-500"
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
              </React.Fragment>
            ))}
          </div>

          {/* Experience & LinkedIn Section */}
          <div className="mt-8 pt-8 border-t-2 border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Professional Details
            </h3>
            <p className="text-slate-600 mb-6">
              Share your experience and LinkedIn profile to help mentees connect
              with you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience in Years */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Experience in Years <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {/* <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /> */}
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Years of professional experience in your field
                </p>
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  LinkedIn Profile <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {/* <svg */}
                  {/*   className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" */}
                  {/*   viewBox="0 0 24 24" */}
                  {/*   fill="currentColor" */}
                  {/* > */}
                  {/*   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> */}
                  {/* </svg> */}
                  <input
                    type="url"
                    value={linkedinProfile}
                    onChange={(e) => setLinkedinProfile(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Your LinkedIn profile URL
                </p>
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all bg-slate-200 hover:bg-slate-300 text-slate-900"
            >
              Previous
            </button>
            <button
              disabled={
                !roleLevel || !username || !linkedinProfile || !experienceYears
              }
              onClick={() => setStep(3)}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ---------------- STEP 2 (INDIVIDUAL / ENTREPRENEUR) ---------------- */}
      {step === 2 && selectedCategory === "Individual/Entrepreneur" && (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Tell us about yourself
          </h3>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Enter your full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Profile Photo
                {/* <span className="text-red-500">*</span> */}
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2.5 border-2 border-dashed border-gray-300 rounded cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                onChange={handleImageChange}
              />
              {image && (
                <div className="mt-3">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Headline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Professional Headline
                {/* <span className="text-red-500">*</span> */}
              </label>
              <input
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g., Founder | SaaS Builder"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all bg-slate-200 hover:bg-slate-300 text-slate-900"
            >
              Previous
            </button>
            <button
              disabled={!username}
              onClick={() => setStep(3)}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ---------------- STEP 3 ---------------- */}
      {step === 3 &&
        (selectedCategory === "Mentor" ||
          selectedCategory === "Individual/Entrepreneur" ||
          selectedCategory === "Startup") && (
          <>
            {(selectedCategory === "Mentor" ||
              selectedCategory === "Individual/Entrepreneur") && (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Select your industry and expertise
                  </h2>
                  <p className="text-sm text-gray-600">
                    Choose the industries you're experienced in and select
                    specific skills
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {Object.entries(INDUSTRY_EXPERTISE).map(
                    ([industry, skills]) => {
                      const selectedCount =
                        selectedExpertise[industry]?.length || 0;

                      return (
                        <div
                          key={industry}
                          className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 transition-all"
                        >
                          <div
                            onClick={() => toggleIndustry(industry)}
                            className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Briefcase className="w-5 h-5 text-indigo-600" />
                              <span className="font-semibold text-gray-800">
                                {industry}
                              </span>
                              {selectedCount > 0 && (
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                  {selectedCount} selected
                                </span>
                              )}
                            </div>
                            {expandedIndustries[industry] ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </div>

                          {expandedIndustries[industry] && (
                            <div className="p-4 bg-white border-t-2 border-gray-100">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {skills.map((skill) => {
                                  const isSelected =
                                    selectedExpertise[industry]?.includes(
                                      skill,
                                    );

                                  return (
                                    <div
                                      key={skill}
                                      onClick={() =>
                                        handleExpertiseToggle(industry, skill)
                                      }
                                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-sm font-medium text-center ${
                                        isSelected
                                          ? "bg-indigo-600 text-white border-indigo-600"
                                          : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700"
                                      }`}
                                    >
                                      <div className="flex items-center justify-center gap-2">
                                        <span>{skill}</span>
                                        {isSelected && (
                                          <CheckCircle2 className="w-4 h-4" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>

                {/* Summary */}
                {Object.keys(selectedExpertise).length > 0 && (
                  <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-900">
                          {Object.values(selectedExpertise).flat().length}{" "}
                          skills selected across{" "}
                          {Object.keys(selectedExpertise).length}{" "}
                          {Object.keys(selectedExpertise).length === 1
                            ? "industry"
                            : "industries"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all bg-slate-200 hover:bg-slate-300 text-slate-900"
                  >
                    Previous
                  </button>
                  <button
                    disabled={Object.keys(selectedExpertise).length === 0}
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                  >
                    <span>Complete Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </>
        )}

      {/* For Startup Onboarding Flow step 2 and 3 is being handled separately in this component */}
      {step > 1 && selectedCategory === "Startup" && (
        <Startup step={step} setStep={setStep} />
      )}
    </div>
  );
};

export default EntryDetails;
