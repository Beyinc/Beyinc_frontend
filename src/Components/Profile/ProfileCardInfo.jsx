const ProfileCardInfo = ({ profileRole, profileData }) => {
  return (
    <div className="space-y-3 text-gray-600 text-sm">
      {/* Startup Name */}
      {/* {profileData.startupProfile.startupName && ( */}
      {/*   <div className="flex items-center gap-2"> */}
      {/*     <span className="text-lg">🏢</span> */}
      {/*     <span className="font-medium text-gray-600">Startup:</span> */}
      {/*     <span className="font-semibold text-gray-700"> */}
      {/*       {profileData.startupProfile.startupName} */}
      {/*     </span> */}
      {/*   </div> */}
      {/* )} */}

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

      {/* Email */}
      {profileData.startupProfile.startupEmail && (
        <div className="flex items-center gap-2">
          <span className="text-lg">✉️</span>
          <span className="font-semibold text-gray-700">
            {profileData.startupProfile.startupEmail}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileCardInfo;
