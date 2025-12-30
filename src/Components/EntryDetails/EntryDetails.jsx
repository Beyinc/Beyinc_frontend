


import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BoxCategories from "./BoxCategories";
import { ApiServices } from "../../Services/ApiServices";
import {
  INDUSTRY_EXPERTISE,
  ROLE_LEVELS,
  COMPANY_STAGES,
} from "../../Utils";
import { CheckCircle2 } from "lucide-react";
import Startup from "../OnboardComponents/Startup";

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
      });

      alert("Profile created successfully!");
      window.location.href = "/posts";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const totalSteps =
    selectedCategory === "Mentor" ||
    selectedCategory === "Startup" ||
    selectedCategory === "Individual/Entrepreneur"
      ? 3
      : 2;

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white md:m-10 p-6 shadow-lg rounded-lg">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="h-full bg-blue-600 rounded transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="font-bold text-xl mb-6">Tell us who you are *</h2>

      {/* ---------------- STEP 1 ---------------- */}
      {step === 1 && (
        <>
          <BoxCategories
            onCategoryClick={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <div className="flex justify-end mt-6">
            <button
              disabled={!selectedCategory}
              onClick={() => setStep(2)}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ---------------- STEP 2 (MENTOR) ---------------- */}
      {step === 2 && selectedCategory === "Mentor" && (
        <>
          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="mb-4"
            onChange={handleImageChange}
          />

          <h3 className="font-semibold mb-4">Select your role</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ROLE_LEVELS.map((role) => (
              <React.Fragment key={role}>
                <div
                  onClick={() => setRoleLevel(role)}
                  className={`cursor-pointer p-3 rounded-lg border-2 text-center ${
                    roleLevel === role
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  {role}
                  {roleLevel === role && (
                    <CheckCircle2 className="w-4 h-4 mx-auto mt-1" />
                  )}
                </div>

                {role === "CXO" && roleLevel === "CXO" && (
                  <div className="col-span-2 md:col-span-3 mt-8 pt-8 border-t-2 border-slate-200">
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
                                <span className="font-bold text-sm">{stage.label}</span>
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
              </React.Fragment>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border rounded"
            >
              Prev
            </button>
            <button
              disabled={!roleLevel || !image || !username}
              onClick={() => setStep(3)}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ---------------- STEP 2 (INDIVIDUAL / ENTREPRENEUR) ---------------- */}
      {step === 2 && selectedCategory === "Individual/Entrepreneur" && (
        <>
          <h3 className="font-semibold mb-4">Tell us about yourself</h3>

          {/* Name */}
          <input
            className="mt-2 w-full border p-2 rounded"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Photo */}
          <input
            type="file"
            accept="image/*"
            className="mt-4 w-full mb-4 p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
            onChange={handleImageChange}
          />

          {/* Tagline */}
          <input
            className="mt-2 w-full border p-2 rounded"
            placeholder="Your headline (e.g. Founder | SaaS Builder)"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="px-6 py-2 border rounded"
              onClick={() => setStep(1)}
            >
              Prev
            </button>

            <button
              disabled={!username || !image || !headline}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              onClick={() => setStep(3)}
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
            {selectedCategory === "Startup" && (
              <Startup step={step} setStep={setStep} />
            )}

            {(selectedCategory === "Mentor" ||
              selectedCategory === "Individual/Entrepreneur") && (
              <>
                <h2 className="text-xl font-bold mb-4">
                  Select your industry and expertise
                </h2>

                <div className="space-y-3">
                  {Object.entries(INDUSTRY_EXPERTISE).map(
                    ([industry, skills]) => (
                      <div key={industry} className="border rounded-lg">
                        <div
                          onClick={() => toggleIndustry(industry)}
                          className="flex justify-between p-4 cursor-pointer"
                        >
                          <strong>{industry}</strong>
                          <span>
                            {expandedIndustries[industry] ? "▲" : "▼"}
                          </span>
                        </div>

                        {expandedIndustries[industry] && (
                          <div className="p-4 grid grid-cols-3 gap-2 border-t">
                            {skills.map((skill) => (
                              <div
                                key={skill}
                                onClick={() =>
                                  handleExpertiseToggle(industry, skill)
                                }
                                className={`p-2 border rounded cursor-pointer ${
                                  selectedExpertise[industry]?.includes(skill)
                                    ? "bg-blue-600 text-white"
                                    : ""
                                }`}
                              >
                                {skill}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 border rounded"
                  >
                    Prev
                  </button>
                  <button
                    disabled={Object.keys(selectedExpertise).length === 0}
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </>
        )}
    </div>
  );
};

export default EntryDetails;
