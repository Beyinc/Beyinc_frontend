import React, { useState, useEffect } from "react";
import { ROLE_LEVELS, COMPANY_STAGES, INDUSTRY_EXPERTISE } from "../Utils";
import {
  CheckCircle2,
  X,
  Briefcase,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ApiServices } from "../Services/ApiServices";

const EditMentorProfessional = ({ isOpen, onClose, currentProfile }) => {
  // Initialize with current profile data
  const [roleLevel, setRoleLevel] = useState(currentProfile?.role_level || "");
  const [companyStage, setCompanyStage] = useState(
    currentProfile?.companyStage || "",
  );
  const [selectedExpertise, setSelectedExpertise] = useState({});
  const [expandedIndustries, setExpandedIndustries] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen && currentProfile) {
      setRoleLevel(currentProfile?.role_level || "");
      setCompanyStage(currentProfile?.companyStage || "");

      // Convert mentorExpertise array back to object format
      if (currentProfile?.mentorExpertise?.length > 0) {
        const expertiseObj = {};
        currentProfile.mentorExpertise.forEach((item) => {
          if (item.skills && item.skills.length > 0) {
            // Only add if has skills
            expertiseObj[item.industry] = item.skills;
          }
        });
        setSelectedExpertise(expertiseObj);
      } else {
        setSelectedExpertise({});
      }
    }
  }, [isOpen, currentProfile]);

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

  const handleSubmit = async () => {
    // Validate at least one field is filled
    if (
      !roleLevel &&
      !companyStage &&
      Object.keys(selectedExpertise).length === 0
    ) {
      alert("Please update at least one field");
      return;
    }

    try {
      setSubmitting(true);

      // Only send fields that have values (partial updates)
      const updateData = {};

      // IMPORTANT: Always send selectedCategory as the current user's role
      updateData.selectedCategory = currentProfile.role; // "Mentor" or "Individual/Entrepreneur"

      if (roleLevel) updateData.role_level = roleLevel;
      if (companyStage) updateData.companyStage = companyStage;
      if (Object.keys(selectedExpertise).length > 0) {
        // Filter out empty skill arrays before sending
        const cleanedExpertise = Object.entries(selectedExpertise)
          .filter(([_, skills]) => skills.length > 0)
          .reduce((acc, [industry, skills]) => {
            acc[industry] = skills;
            return acc;
          }, {});

        if (Object.keys(cleanedExpertise).length > 0) {
          updateData.mentorExpertise = cleanedExpertise;
        }
      }

      await ApiServices.InputEntryData(updateData);
      alert("Profile Updated Successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Professional Profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your professional information
            </p>
          </div>
          {/* <button */}
          {/*   onClick={onClose} */}
          {/*   className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" */}
          {/* > */}
          {/*   <X className="w-5 h-5 text-gray-500" /> */}
          {/* </button> */}
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Role Level Selection */}
            {currentProfile.role === "Mentor" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Your Role
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ROLE_LEVELS.map((role) => (
                    <div
                      key={role}
                      onClick={() => setRoleLevel(role)}
                      className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${
                        roleLevel === role
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium">{role}</span>
                        {roleLevel === role && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Stage (only for CXO) */}
            {roleLevel === "CXO" && (
              <div className="pt-6 border-t-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Company Stage
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This helps us understand your company context
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {COMPANY_STAGES.map((stage) => (
                    <button
                      key={stage.id}
                      type="button"
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

            {/* Industry Expertise */}
            <div className="pt-6 border-t-2 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Industry & Expertise
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose the industries you're experienced in and select specific
                skills
              </p>

              <div className="space-y-3">
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
                                  selectedExpertise[industry]?.includes(skill);

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
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-indigo-900">
                        {Object.values(selectedExpertise).flat().length} skills
                        selected across {Object.keys(selectedExpertise).length}{" "}
                        {Object.keys(selectedExpertise).length === 1
                          ? "industry"
                          : "industries"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMentorProfessional;
