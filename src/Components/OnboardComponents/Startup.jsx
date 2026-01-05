import { useState } from "react";

import {
  STARTUP_VISIBILITY_MODES,
  STARTUP_STAGES,
  STARTUP_TEAM_SIZES,
  TARGET_MARKETS,
  INDUSTRY_EXPERTISE,
} from "../../Utils";
import { CheckCircle2 } from "lucide-react";
import Navigation from "./Navigation";

const Startup = ({ step, setStep, selectedCategory }) => {
  // Startup States
  const [startupName, setStartupName] = useState("");
  const [startupTagline, setStartupTagline] = useState("");
  const [founderName, setFounderName] = useState("");
  const [startupEmail, setStartupEmail] = useState("");
  const [visibilityMode, setVisibilityMode] = useState("");
  const [startupStage, setStartupStage] = useState("");
  const [startupTeamSize, setStartupTeamSize] = useState("");

  // Calculate progress based on total steps (3 for mentor/service-partner/startup, 1 for others currently)

  const totalSteps =
    selectedCategory === "Mentor" || selectedCategory === "Startup" ? 3 : 1;
  const progressPercentage = (step / totalSteps) * 100;

  const [selectedStartupIndustries, setSelectedStartupIndustries] = useState([
    "",
  ]);
  const [targetMarket, setTargetMarket] = useState("");

  // Startup handlers
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
  console.log(step);
  return (
    <>
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Tell us about your startup
          </h2>
          <p className="text-slate-600 mb-8">
            Provide basic information about your startup. Don't worry, you can
            add more details later.
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
                Tagline
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
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-bold text-sm ${visibilityMode === mode.id ? "text-white" : "text-slate-900"}`}
                          >
                            {mode.label}
                          </span>
                          {visibilityMode === mode.id && (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 ${visibilityMode === mode.id ? "text-blue-100" : "text-slate-500"}`}
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
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Startup Stage & Industry
          </h2>
          <p className="text-slate-600 mb-8">
            Tell us about your startup stage and select your industries. You can
            add more details in your profile later.
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
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 ${startupStage === stage.id ? "text-blue-100" : "text-slate-500"}`}
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
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{size}</span>
                      {startupTeamSize === size && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
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
                      onClick={() => handleStartupIndustryToggle(industry)}
                      className={`w-full px-5 py-4 rounded-lg text-left transition-all border-2 ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{industry}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-semibold">
                  {selectedStartupIndustries.length === 1
                    ? "No industry selected"
                    : `Selected ${selectedStartupIndustries.length - 1} Industries`}
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
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
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
      )}

      {step > 1 && (
        <Navigation
          step={step}
          setStep={setStep}
          startupName={startupName}
          startupTagline={startupTagline}
          founderName={founderName}
          startupEmail={startupEmail}
          visibilityMode={visibilityMode}
          startupStage={startupStage}
          startupTeamSize={startupTeamSize}
          selectedStartupIndustries={selectedStartupIndustries}
          targetMarket={targetMarket}
        />
      )}
    </>
  );
};

export default Startup;
