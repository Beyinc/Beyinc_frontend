const ProfileCardInfo = ({ profileRole, profileData }) => {
  return (
    <div className="space-y-3 text-gray-600 text-sm">
      {/* Startup Name */}
      {profileData.startupProfile.startupName && (
        <div className="flex items-center gap-2">
          <span className="text-lg">🏢</span>
          <span className="font-medium text-gray-600">Startup:</span>
          <span className="font-semibold text-gray-700">
            {profileData.startupProfile.startupName}
          </span>
        </div>
      )}

      {/* Tagline */}
      {profileData.startupProfile.startupTagline && (
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <span className="font-medium text-gray-600">Tagline:</span>
          <span className="font-semibold text-gray-700 italic">
            "{profileData.startupProfile.startupTagline}"
          </span>
        </div>
      )}

      {/* Founder Name */}
      {profileData.startupProfile.founderName && (
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <span className="font-medium text-gray-600">Founder:</span>
          <span className="font-semibold text-gray-700">
            {profileData.startupProfile.founderName}
          </span>
        </div>
      )}

      {/* Stage */}
      <div className="flex items-center gap-2 w-full whitespace-nowrap">
        <span className="text-lg">🚀</span>
        <span className="font-medium text-gray-600">Stage:</span>
        <span className="font-semibold text-gray-700 text-sm">
          {profileData.startupProfile.stage
            ?.split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") || "N/A"}
        </span>
      </div>

      {/* Team Size */}
      <div className="flex items-center gap-2">
        <span className="text-lg">👥</span>
        <span className="font-medium text-gray-600">Team:</span>
        <span className="font-semibold text-gray-700">
          {profileData.startupProfile.teamSize || "N/A"}
        </span>
      </div>

      {/* Visibility Mode */}
      {profileData.startupProfile.visibilityMode && (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-lg">
            {profileData.startupProfile.visibilityMode === "stealth"
              ? "🕵️"
              : profileData.startupProfile.visibilityMode === "idea-stage"
                ? "💭"
                : "🌐"}
          </span>
          <span className="font-medium text-gray-600">Mode:</span>
          <span className="font-semibold text-gray-700">
            {profileData.startupProfile.visibilityMode
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </div>
      )}

      {/* Target Market */}
      {profileData.startupProfile.targetMarket && (
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-medium text-gray-600">Market:</span>
          <span className="font-semibold text-gray-700">
            {profileData.startupProfile.targetMarket}
          </span>
        </div>
      )}

      {/* Email */}
      {profileData.startupProfile.startupEmail && (
        <div className="flex items-center gap-2">
          <span className="text-lg">✉️</span>
          <span className="font-semibold text-gray-700">
            {profileData.startupProfile.startupEmail}
          </span>
        </div>
      )}

      {/* Industries */}
      {profileData.startupProfile.industries &&
        profileData.startupProfile.industries.filter((ind) => ind.trim() !== "")
          .length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-lg mt-0.5">🏭</span>
            <div className="flex-1">
              <span className="font-medium text-gray-600 block mb-2">
                Industries:
              </span>
              <div className="flex flex-wrap gap-2">
                {profileData.startupProfile.industries
                  .filter((industry) => industry.trim() !== "")
                  .map((industry, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                    >
                      {industry}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProfileCardInfo;
