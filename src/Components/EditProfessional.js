import React, { useState, useEffect } from "react";
import { STARTUP_STAGES, TARGET_MARKETS, INDUSTRY_EXPERTISE } from "../Utils";
import { CheckCircle2, X } from "lucide-react";
import { ApiServices } from "../Services/ApiServices";
import { useNavigate } from "react-router-dom";

const EditProfessional = ({ isOpen, onClose, currentProfile }) => {
  const navigate = useNavigate();
  // Initialize with current profile data
  const [startupStage, setStartupStage] = useState(
    currentProfile?.startupProfile?.stage || "",
  );
  const [selectedStartupIndustries, setSelectedStartupIndustries] = useState(
    currentProfile?.startupProfile?.industries || [],
  );
  const [targetMarket, setTargetMarket] = useState(
    currentProfile?.startupProfile?.targetMarket || "",
  );

  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen && currentProfile) {
      setStartupStage(currentProfile?.startupProfile?.stage || "");
      setSelectedStartupIndustries(
        currentProfile?.startupProfile?.industries || [],
      );
      setTargetMarket(currentProfile?.startupProfile?.targetMarket || "");
    }
  }, [isOpen, currentProfile]);

  const handleStartupIndustryToggle = (industry) => {
    if (selectedStartupIndustries.includes(industry)) {
      setSelectedStartupIndustries(
        selectedStartupIndustries.filter((ind) => ind !== industry),
      );
    } else {
      if (selectedStartupIndustries.length < 6) {
        setSelectedStartupIndustries([...selectedStartupIndustries, industry]);
      }
    }
  };

  const handleSubmit = async () => {
    // Validate at least one field is filled
    if (
      !startupStage &&
      selectedStartupIndustries.length === 0 &&
      !targetMarket
    ) {
      alert("Please update at least one field");
      return;
    }

    try {
      setSubmitting(true);

      // Only send fields that have values (partial updates)
      const updateData = {};
      if (startupStage) updateData.startupStage = startupStage;
      if (selectedStartupIndustries.length > 0)
        updateData.industries = selectedStartupIndustries;
      if (targetMarket) updateData.targetMarket = targetMarket;

      await ApiServices.StartupEntryData(updateData);
      alert("Profile Updated Successfully!");
      onClose();
      // Refresh the page or update parent component
      // window.location.reload();
      //window.location.href = "/editProfile";
      navigate("/editProfile");
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Professional Profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your startup information
            </p>
          </div>

          {/* <button */}
          {/*   onClick={onClose} */}
          {/*   className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" */}
          {/* > */}
          {/*   <X className="w-5 h-5 text-white" /> */}
          {/* </button> */}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="space-y-8">
            {/* Startup Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Stage
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {STARTUP_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setStartupStage(stage.id)}
                    className={`p-4 rounded-lg font-medium transition-all text-left border-2 ${
                      startupStage === stage.id
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
                          {startupStage === stage.id && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 ${startupStage === stage.id ? "text-indigo-100" : "text-gray-500"}`}
                        >
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Industries
                <span className="text-xs font-normal text-gray-500 ml-2">
                  (Select up to 5)
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.keys(INDUSTRY_EXPERTISE).map((industry) => {
                  const isSelected =
                    selectedStartupIndustries.includes(industry);
                  const isDisabled =
                    !isSelected && selectedStartupIndustries.length >= 6;
                  return (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => handleStartupIndustryToggle(industry)}
                      disabled={isDisabled}
                      className={`p-3 rounded-lg text-left transition-all border-2 ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : isDisabled
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{industry}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedStartupIndustries.length > 0 && (
                <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-700 font-medium">
                    Selected {selectedStartupIndustries.length}{" "}
                    {selectedStartupIndustries.length === 1
                      ? "Industry"
                      : "Industries"}
                  </p>
                </div>
              )}
            </div>

            {/* Target Market */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Market
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TARGET_MARKETS.map((market) => (
                  <button
                    key={market}
                    type="button"
                    onClick={() => setTargetMarket(market)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                      targetMarket === market
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{market}</span>
                      {targetMarket === market && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
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

export default EditProfessional;
