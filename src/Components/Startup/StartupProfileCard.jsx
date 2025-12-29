import { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";

const StartupProfileCard = ({ userId }) => {
  const [profileData, setProfileData] = useState({
    expertise: [],
    industries: [],
    stages: [],
  });

  const [activeTopTab, setActiveTopTab] = useState("industries");

  // 🔽 FETCH IMPLEMENTATION (ONLY ADDITION)
  useEffect(() => {
    const fetchStartupProfile = async () => {
      try {
        const res = await ApiServices.GetStartupProfileData(userId);

        if (res?.data?.success) {
          const { industries, targetMarket, stage } = res.data.data;

          setProfileData({
            industries: (industries || []).filter(Boolean), // removes ""
            expertise: targetMarket ? [targetMarket] : [],
            stages: stage ? [stage] : [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch startup profile", err);
      }
    };

    if (userId) fetchStartupProfile();
  }, [userId]);
  // 🔼 FETCH IMPLEMENTATION ENDS

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTopTab("industries")}
              className={`pb-3 px-4 font-semibold transition-colors bg-transparent ${
                activeTopTab === "industries"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Industries
            </button>
            <button
              type="button"
              onClick={() => setActiveTopTab("expertise")}
              className={`pb-3 px-4 font-semibold transition-colors bg-transparent ${
                activeTopTab === "expertise"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Expertise
            </button>
            <button
              type="button"
              onClick={() => setActiveTopTab("stages")}
              className={`pb-3 px-4 font-semibold transition-colors bg-transparent ${
                activeTopTab === "stages"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Stages
            </button>
          </div>
        </div>

        {/* Tab Content — UNCHANGED */}
        <div className="mb-6">
          {activeTopTab === "industries" && (
            <div className="flex flex-wrap gap-2">
              {profileData.industries.map((industry, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          )}

          {activeTopTab === "expertise" && (
            <div className="flex flex-wrap gap-2">
              {profileData.expertise.map((item, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {activeTopTab === "stages" && (
            <div className="flex flex-wrap gap-2">
              {profileData.stages.map((stage, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {stage}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StartupProfileCard;
