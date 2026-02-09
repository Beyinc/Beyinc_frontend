import {
  MessageSquare,
  User,
  Users,
  Eye,
  EyeOff,
  Lightbulb,
  Globe,
  Mail,
} from "lucide-react";


const ProfileCardInfo = ({ profileRole, profileData }) => {
  const getVisibilityIcon = (mode) => {
    switch (mode) {
      case "stealth":
        return <EyeOff size={18} />;
      case "idea-stage":
        return <Lightbulb size={18} />;
      default:
        return <Globe size={18} />;
    }
  };

  return (
    <div className="space-y-3 text-gray-600 text-sm">
      {/* Tagline */}
      {profileData.startupProfile.startupTagline && (
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-gray-400 shrink-0" />
          <span className="font-medium text-gray-600">Tagline:</span>
          <span className="font-semibold text-gray-700 italic">
            "{profileData.startupProfile.startupTagline}"
          </span>
        </div>
      )}

      {/* Founder Name */}
      {profileData.startupProfile.founderName && (
        <div className="flex items-center gap-2">
          <User size={18} className="text-gray-400 shrink-0" />
          <span className="font-medium text-gray-600">Founder:</span>
          <span className="font-semibold text-gray-700">
            {profileData.startupProfile.founderName}
          </span>
        </div>
      )}

      {/* Team Size */}
      <div className="flex items-center gap-2">
        <Users size={18} className="text-gray-400 shrink-0" />
        <span className="font-medium text-gray-600">Team:</span>
        <span className="font-semibold text-gray-700">
          {profileData.startupProfile.teamSize || "N/A"}
        </span>
      </div>

      {/* Visibility Mode */}
      {profileData.startupProfile.visibilityMode && (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-gray-400 shrink-0">
            {getVisibilityIcon(profileData.startupProfile.visibilityMode)}
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
          <Mail size={18} className="text-gray-400 shrink-0" />
          <span className="font-semibold text-gray-700">
            {profileData.startupProfile.startupEmail}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileCardInfo;