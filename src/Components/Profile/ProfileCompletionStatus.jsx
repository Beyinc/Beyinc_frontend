import {
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Info,
  Edit2,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

// Mock function to check eligibility - replace with your actual logic
const checkMentorEligibility = (profileData, profileType) => {
  const checks = {
    about: {
      label: "About",
      description: "Add a description about yourself",
      completed: profileData?.about && profileData.about.length > 50,
      percentage: profileData?.about && profileData.about.length > 50 ? 100 : 0,
    },
    experience: {
      label: "Experience",
      description: "Add your work experience",
      completed: profileData?.experience && profileData.experience.length > 0,
      percentage:
        profileData?.experience && profileData.experience.length > 0 ? 100 : 0,
    },
    expertise: {
      label: "Expertise",
      description: "Add your areas of expertise",
      completed: profileData?.expertise && profileData.expertise.length > 0,
      percentage:
        profileData?.expertise && profileData.expertise.length > 0 ? 100 : 0,
    },
    education: {
      label: "Education",
      description: "Add your educational background",
      completed: profileData?.education && profileData.education.length > 0,
      percentage:
        profileData?.education && profileData.education.length > 0 ? 100 : 0,
    },
    linkedin: {
      label: "LinkedIn",
      description: "Connect your LinkedIn profile",
      completed: profileData?.linkedin && profileData.linkedin.length > 0,
      percentage:
        profileData?.linkedin && profileData.linkedin.length > 0 ? 100 : 0,
    },
  };

  const checkValues = Object.values(checks);
  const completionPercentage = Math.round(
    checkValues.reduce((sum, check) => sum + check.percentage, 0) /
      checkValues.length,
  );
  const isEligible = completionPercentage >= 80;

  return { isEligible, checks, completionPercentage };
};

export default function ProfileCompletionStatus({
  profileData = {},
  profileType = "startup",
  onToggleListing = () => {},
  onEditAbout,
  onEditExperience,
  onEditExpertise,
  onEditEducation,
  onEditLinkedIn,
}) {
  const { isEligible, checks, completionPercentage } = checkMentorEligibility(
    profileData,
    profileType,
  );
  const [isListed, setIsListed] = useState(profileData.isListed ?? false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const hasAutoListed = useRef(false);

  // Memoize the toggle handler to prevent unnecessary re-renders
  const handleToggleListing = useCallback(() => {
    setIsListed((prev) => {
      const newValue = !prev;
      onToggleListing(newValue);
      return newValue;
    });
  }, [onToggleListing]);

  // Auto-list ONCE when 80%+ and eligible
  useEffect(() => {
    if (
      isEligible &&
      completionPercentage >= 80 &&
      !isListed &&
      !hasAutoListed.current
    ) {
      hasAutoListed.current = true;
      setIsListed(true);
      onToggleListing(true);
    }
  }, [isEligible, completionPercentage]);

  // Sync ONLY when parent explicitly changes isListed
  useEffect(() => {
    if (profileData.isListed !== undefined) {
      setIsListed(profileData.isListed);
    }
  }, [profileData.isListed]);

  // Calculate circumference for SVG circle (2 * π * radius)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  const checkEntries = Object.entries(checks);
  const completedCount = checkEntries.filter(
    ([_, check]) => check.completed,
  ).length;
  const totalSteps = checkEntries.length;

  // Calculate cumulative progress (each field is 20% of total)
  const fieldWeight = 100 / totalSteps;
  const getCumulativeProgress = (index) => {
    let cumulative = 0;
    for (let i = 0; i <= index; i++) {
      cumulative += (checkEntries[i][1].percentage / 100) * fieldWeight;
    }
    return Math.round(cumulative);
  };

  // Map field keys to edit handlers
  const editHandlers = {
    about: onEditAbout,
    experience: onEditExperience,
    expertise: onEditExpertise,
    education: onEditEducation,
    linkedin: onEditLinkedIn,
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Profile Completion
        </h3>

        {/* Circular Progress with Click to Show Details */}
        <div className="relative flex items-center justify-center mb-6">
          <div
            className="relative cursor-pointer"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            {/* Circular Progress Ring */}
            <svg className="transform -rotate-90" width="180" height="180">
              {/* Background Circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress Circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                className={`transition-all duration-500 ${
                  completionPercentage >= 80
                    ? "text-green-600"
                    : "text-amber-500"
                }`}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition:
                    "stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease-in-out",
                }}
              />
            </svg>
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div
                className={`text-4xl font-bold ${completionPercentage >= 80 ? "text-green-600" : "text-amber-600"}`}
              >
                {completionPercentage}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {completedCount}/{totalSteps} Complete
              </div>
              {completionPercentage >= 80 && (
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-2" />
              )}
            </div>

            {/* Floating Details Panel - Click to Show */}
            {isDetailsOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">
                        Completion Steps
                      </h4>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDetailsOpen(false);
                      }}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Vertical Progress Indicator */}
                  <div className="flex gap-3 mb-4">
                    <div className="flex flex-col items-center gap-1 relative">
                      {/* Vertical Progress Bar Container with Step Markers */}
                      <div className="w-3 h-32 bg-gray-200 rounded-full relative overflow-hidden">
                        {/* Filled portion */}
                        <div
                          className={`w-3 rounded-full transition-all duration-500 absolute bottom-0 ${
                            completionPercentage >= 80
                              ? "bg-green-600"
                              : "bg-amber-500"
                          }`}
                          style={{ height: `${completionPercentage}%` }}
                        ></div>
                        {/* Step markers - each field is 20% */}
                        {checkEntries.map(([key, check], index) => {
                          const stepPosition = ((index + 1) / totalSteps) * 100;
                          const isStepCompleted = check.completed;

                          return (
                            <div
                              key={key}
                              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                              style={{ bottom: `${100 - stepPosition}%` }}
                            >
                              <div
                                className={`w-2 h-2 rounded-full border-2 ${
                                  isStepCompleted
                                    ? "bg-green-600 border-green-700"
                                    : "bg-white border-gray-400"
                                }`}
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Progress percentage label */}
                      <span
                        className={`text-xs font-bold ${completionPercentage >= 80 ? "text-green-600" : "text-amber-600"}`}
                      >
                        {completionPercentage}%
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      {checkEntries.map(([key, check], index) => {
                        const cumulativeProgress = getCumulativeProgress(index);
                        const editHandler = editHandlers[key];

                        return (
                          <div
                            key={key}
                            className={`flex items-start gap-2 p-2 rounded transition-colors ${
                              check.completed ? "bg-green-50" : "bg-amber-50"
                            }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {check.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-amber-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-sm font-medium ${check.completed ? "text-green-900" : "text-amber-900"}`}
                                  >
                                    {index + 1}. {check.label}
                                  </span>
                                  {editHandler && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        editHandler();
                                        setIsDetailsOpen(false);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-bold ${check.completed ? "text-green-600" : "text-amber-600"}`}
                                  >
                                    {check.percentage}%
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({cumulativeProgress}% total)
                                  </span>
                                </div>
                              </div>
                              {!check.completed && (
                                <p className="text-xs text-amber-700 mb-1">
                                  {check.description}
                                </p>
                              )}
                              {/* Mini progress bar */}
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div
                                  className={`h-1 rounded-full transition-all ${
                                    check.completed
                                      ? "bg-green-500"
                                      : "bg-amber-400"
                                  }`}
                                  style={{ width: `${check.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p
                      className={`text-xs font-medium ${completionPercentage >= 80 ? "text-green-700" : "text-amber-700"}`}
                    >
                      {completionPercentage >= 80 ? (
                        <>
                          ✓ Eligible to list as{" "}
                          {profileType === "service-partner"
                            ? "partner"
                            : profileType === "startup"
                              ? "startup"
                              : "mentor"}{" "}
                          (80%+ required)
                        </>
                      ) : (
                        <>
                          Complete {80 - completionPercentage}% more to become
                          eligible
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          {completionPercentage >= 80 ? (
            <p className="text-sm text-green-700 font-medium">
              ✓ You're eligible to list as a{" "}
              {profileType === "service-partner"
                ? "partner"
                : profileType === "startup"
                  ? "startup"
                  : "mentor"}
              ! (80%+ required)
            </p>
          ) : (
            <p className="text-sm text-amber-700 font-medium">
              Click the circle to see completion steps • Complete{" "}
              {80 - completionPercentage}% more to become eligible
            </p>
          )}
        </div>
      </div>

      {/* Listing Toggle */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isListed ? (
              <Eye className="w-5 h-5 text-green-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <h4 className="font-semibold text-gray-900">
                {isListed
                  ? `Listed as ${profileType === "service-partner" ? "Partner" : profileType === "startup" ? "Startup" : "Mentor"}`
                  : "Unlisted"}
              </h4>
              <p className="text-sm text-gray-600">
                {isListed
                  ? "Your profile is visible in the listing page"
                  : "Your profile is hidden from the listing page"}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isListed}
              onChange={handleToggleListing}
              disabled={!isEligible && completionPercentage < 80}
              className="sr-only peer"
            />
            <div
              className={`w-14 h-7 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${
                isListed
                  ? "bg-green-600"
                  : "bg-gray-200 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300`}
            ></div>
          </label>
        </div>
        {!isEligible && completionPercentage < 80 && (
          <p className="text-xs text-amber-600 mt-2">
            Complete 80% of your profile to enable listing
          </p>
        )}
      </div>
    </div>
  );
}
