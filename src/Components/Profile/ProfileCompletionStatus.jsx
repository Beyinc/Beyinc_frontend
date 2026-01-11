import { CheckCircle2, XCircle, Eye, EyeOff, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { ApiServices } from "../../Services/ApiServices";

export default function ProfileCompletionStatus({
  profileData,
  profileType = "Startup",
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Define the completion checks based on role
  const getCompletionChecks = () => {
    const role = profileData?.role;

    // For Startup
    if (role === "Startup") {
      const startupProfile = profileData?.startupProfile || {};

      return [
        {
          key: "about",
          label: "About",
          completed: !!(
            profileData?.about && profileData.about.trim().length > 0
          ),
          fieldValue: profileData?.about,
        },
        {
          key: "industries",
          label: "Industries",
          completed: !!(
            startupProfile.industries &&
            startupProfile.industries.filter((i) => i && i.trim()).length > 0
          ),
          fieldValue: startupProfile.industries,
        },
        {
          key: "targetMarket",
          label: "Target Market",
          completed: !!(
            startupProfile.targetMarket &&
            startupProfile.targetMarket.trim().length > 0
          ),
          fieldValue: startupProfile.targetMarket,
        },
        {
          key: "stage",
          label: "Stage",
          completed: !!(
            startupProfile.stage && startupProfile.stage.trim().length > 0
          ),
          fieldValue: startupProfile.stage,
        },
      ];
    }

    // For Mentor or Individual/Entrepreneur
    if (role === "Mentor" || role === "Individual/Entrepreneur") {
      return [
        {
          key: "about",
          label: "About",
          completed: !!(
            profileData?.about && profileData.about.trim().length > 0
          ),
          fieldValue: profileData?.about,
        },
        {
          key: "mentorExpertise",
          label: "Industry",
          completed: !!(
            profileData?.mentorExpertise &&
            profileData.mentorExpertise.length > 0 &&
            profileData.mentorExpertise.some(
              (exp) => exp.industry && exp.industry.trim().length > 0,
            )
          ),
          fieldValue: profileData?.mentorExpertise,
        },

        {
          key: "skills",
          label: "Skills",
          completed:
            Array.isArray(profileData?.mentorExpertise) &&
            profileData.mentorExpertise.some(
              (item) =>
                Array.isArray(item?.skills) &&
                item.skills.some(
                  (skill) =>
                    typeof skill === "string" && skill.trim().length > 0,
                ),
            ),
          fieldValue: profileData?.mentorExpertise,
        },
      ];
    }

    // Default fallback (shouldn't reach here)
    return [];
  };

  const checks = getCompletionChecks();
  const completedCount = checks.filter((c) => c.completed).length;
  const totalSteps = checks.length;
  const completionPercentage = Math.round((completedCount / totalSteps) * 100);

  const [forceDisable, setForceDisable] = useState(() => {
    // Initialize based on database value
    return profileData.beyincProfile === "";
  });

  const isEligible = completionPercentage >= 80;
  const isListed = isEligible && !forceDisable;

  const updateBeyincProfile = async (newValue) => {
    try {
      console.log("update calling");
      await ApiServices.UpdateBeyincProfile({
        beyincProfile: newValue,
      });
    } catch (error) {
      console.error("Error updating beyincProfile:", error);
    }
  };

  const handleForceToggle = async () => {
    const newForceDisable = !forceDisable;
    setForceDisable(newForceDisable);

    if (newForceDisable) {
      // User explicitly disables listing
      await updateBeyincProfile("");
    } else {
      // User enables listing
      await updateBeyincProfile("Startup");
    }
  };

  // Sync with database when profileData changes (from About component save or page refresh)
  useEffect(() => {
    setForceDisable(profileData.beyincProfile === "");
  }, [profileData.beyincProfile]);
  // Calculate circumference for SVG circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl  p-6 ">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
          Profile Completion
        </h3>

        {/* Circular Progress with Hover Details */}
        <div className="relative flex items-center justify-center mb-6">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
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
            {/* Hover Tooltip - Completion Steps */}
            {isHovered && (
              <div
                className="absolute left-full ml-4 top-0 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 w-80 z-10 transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">
                    Completion Steps
                  </h4>
                </div>

                {/* Progress indicator at top */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Overall Progress
                    </span>
                    <span
                      className={`text-sm font-bold ${completionPercentage >= 80 ? "text-green-600" : "text-amber-600"}`}
                    >
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        completionPercentage >= 80
                          ? "bg-green-600"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Completion Steps with Checkboxes */}
                <div className="space-y-3">
                  {checks.map((check, index) => {
                    const fieldPercentage = Math.round((1 / totalSteps) * 100);

                    return (
                      <div
                        key={check.key}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          check.completed ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {check.completed ? (
                            <div className="w-5 h-5 rounded border-2 border-green-600 bg-green-600 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-sm font-medium ${
                                check.completed
                                  ? "text-green-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {index + 1}. {check.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  check.completed
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {check.completed ? "100%" : "0%"}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({fieldPercentage}% total)
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                check.completed ? "bg-green-500" : "bg-gray-300"
                              }`}
                              style={{ width: check.completed ? "100%" : "0%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p
                    className={`text-xs font-medium ${
                      completionPercentage >= 80
                        ? "text-green-700"
                        : "text-amber-700"
                    }`}
                  >
                    {completionPercentage >= 80 ? (
                      <>
                        ✓ Eligible to list as{" "}
                        {profileType === "service-partner"
                          ? "partner"
                          : profileType === "Startup"
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
            )}
          </div>
        </div>

        {/* Status Message */}
        {profileData.role === "Startup" && (
          <div className="text-center">
            {completionPercentage >= 80 ? (
              <p className="text-sm text-green-700 font-medium">
                ✓ You're eligible to list as a{" "}
                {profileType === "service-partner"
                  ? "partner"
                  : profileType === "Startup"
                    ? "startup"
                    : "mentor"}
                ! (80%+ required)
              </p>
            ) : (
              <p className="text-sm text-amber-700 font-medium">
                Hover over the circle to see steps • Complete{" "}
                {80 - completionPercentage}% more to become eligible
              </p>
            )}
          </div>
        )}
      </div>

      {/* Listing Toggle */}
      {profileData.role === "Startup" && (
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
                    ? `Listed as ${profileType === "service-partner" ? "Partner" : profileType === "Startup" ? "Startup" : "Mentor"}`
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
                checked={isListed} // Changed: use isListed directly
                disabled={!isEligible}
                onChange={handleForceToggle}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-checked:bg-green-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
            </label>
          </div>
          {!isEligible && (
            <p className="text-xs text-amber-600 mt-2">
              Complete 80% of your profile to enable listing
            </p>
          )}
        </div>
      )}
    </div>
  );
}
