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

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 4 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

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

  return (
    <>
      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tell us about your startup
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Provide basic information about your startup. Don't worry, you can
            add more details later.
          </p>

          <div className="space-y-4">
            {/* Startup Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Startup Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="e.g. TechVenture"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tagline
                <span className="text-xs font-normal text-gray-500 ml-2">
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                {startupTagline.length}/100 characters
              </p>
            </div>

            {/* Founder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Founder/Co-founder Name(s){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="e.g. John Doe, Jane Smith"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={startupEmail}
                onChange={(e) => setStartupEmail(e.target.value)}
                placeholder="contact@startup.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            {/* Visibility Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Visibility Mode <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {STARTUP_VISIBILITY_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setVisibilityMode(mode.id)}
                    className={`p-4 rounded-lg text-left transition-all border-2 ${
                      visibilityMode === mode.id
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{mode.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-semibold text-sm ${visibilityMode === mode.id ? "text-white" : "text-gray-800"}`}
                          >
                            {mode.label}
                          </span>
                          {visibilityMode === mode.id && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 ${visibilityMode === mode.id ? "text-indigo-100" : "text-gray-500"}`}
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Startup Stage & Industry
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Tell us about your startup stage and select your industries. You can
            add more details in your profile later.
          </p>

          <div className="space-y-6">
            {/* Startup Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Stage <span className="text-red-500">*</span>
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

            {/* Team Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Team Size <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {STARTUP_TEAM_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setStartupTeamSize(size)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                      startupTeamSize === size
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{size}</span>
                      {startupTeamSize === size && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Industries <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-500 ml-2">
                  (Select at least one, max 5)
                </span>
              </label>
              <div className="space-y-2">
                {Object.keys(INDUSTRY_EXPERTISE).map((industry) => {
                  const isSelected =
                    selectedStartupIndustries.includes(industry);
                  return (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => handleStartupIndustryToggle(industry)}
                      className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600"
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

              <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-700 font-medium">
                  {selectedStartupIndustries.length === 1
                    ? "No industry selected"
                    : `Selected ${selectedStartupIndustries.length - 1} ${selectedStartupIndustries.length - 1 === 1 ? "Industry" : "Industries"}`}
                </p>
              </div>
            </div>

            {/* Target Market */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Market <span className="text-red-500">*</span>
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
          image={image}
          targetMarket={targetMarket}
        />
      )}
    </>
  );
};

export default Startup;
