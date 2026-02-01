import React, { useState, useMemo } from "react";
import PopupModal from "./PopupModal";
import "./TabsAndInvestment.css";
import "../../BeyincProfessional/BeyincProfessional";
import { Link, useNavigate } from "react-router-dom";
import EditProfessional from "../../EditProfessional";
import EditMentorProfessional from "../../EditMentorProfessional";

const TabsAndInvestment = ({
  role,
  selfProfile,
  setSelfProfile,
  profileData,
}) => {
  const [activeTab, setActiveTab] = useState("Industries");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleEditButtonClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Extract data based on role
  const extractedData = useMemo(() => {
    if (!profileData) return null;
    const userRole = profileData.role;
    if (userRole === "Individual/Entrepreneur" || userRole === "Mentor") {
      // Extract from mentorExpertise
      const mentorExpertise = profileData.mentorExpertise || [];
      const extractedIndustries = mentorExpertise.map((item) => item.industry);
      const extractedSkills = mentorExpertise.flatMap(
        (item) => item.skills || [],
      );
      const mentorRole = userRole === "Mentor" ? profileData.role_level : null;
      return {
        industries: extractedIndustries,
        skills: extractedSkills,
        mentorRole: mentorRole,
        role: userRole,
      };
    } else if (userRole === "Startup") {
      // Extract from startupProfile
      const startupProfile = profileData.startupProfile || {};
      return {
        industries: startupProfile.industries || [],
        targetMarket: startupProfile.targetMarket,
        stage: startupProfile.stage,
        role: userRole,
      };
    }
    return null;
  }, [profileData]);

  // console.log(profileData);
  // console.log("Extracted Data:", extractedData);
  // console.log(selfProfile);

  return (
    <div className="tabs-and-investment-container mt-0 bg-white">
      <div>
        <div className="inline-flex items-center justify-center bg-white rounded-[20px] p-2.5 gap-2.5 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div
            className={`px-5 py-2.5 rounded-[20px] text-sm font-medium cursor-pointer transition-all ${
              activeTab === "Industries"
                ? "text-[#4f55c7] shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={activeTab === "Industries" ? { background: "#E3E5FD" } : {}}
            onClick={() => handleTabClick("Industries")}
          >
            Industries
          </div>

          {extractedData?.role === "Startup" ? (
            <div
              className={`Ttab ${activeTab === "TargetMarket" ? "Tactive" : ""}`}
              onClick={() => handleTabClick("TargetMarket")}
            >
              Target Market
            </div>
          ) : (
            <div
              className={`Ttab ${activeTab === "Expertise" ? "Tactive" : ""}`}
              onClick={() => handleTabClick("Expertise")}
            >
              Expertise
            </div>
          )}

          {extractedData?.role === "Startup" && (
            <div
              className={`Ttab ${activeTab === "Stage" ? "Tactive" : ""}`}
              onClick={() => handleTabClick("Stage")}
            >
              Stage
            </div>
          )}

          {extractedData?.role === "Mentor" && (
            <div
              className={`Ttab ${activeTab === "Level" ? "Tactive" : ""}`}
              onClick={() => handleTabClick("Level")}
            >
              Level
            </div>
          )}

          <span>
            {selfProfile && (
              <i
                style={{ color: "var(--followBtn-bg)", cursor: "pointer" }}
                onClick={handleEditButtonClick}
                className="fas fa-pen"
              >
                {/* Edit icon */}
              </i>
            )}
          </span>
          {/* Edit Professional Modal */}
          {profileData.role === "Startup" && (
            <EditProfessional
              isOpen={isEditModalOpen}
              onClose={handleCloseModal}
              currentProfile={profileData}
            />
          )}

          {(profileData.role === "Mentor" ||
            profileData.role === "Individual/Entrepreneur") && (
            <EditMentorProfessional
              isOpen={isEditModalOpen}
              onClose={handleCloseModal}
              currentProfile={profileData}
            />
          )}
        </div>

        <div className="content-container">
          {/* Industries Tab */}
          {activeTab === "Industries" && (
            <p>
              <span className="font-semibold text-gray-700">
                {extractedData?.industries?.length
                  ? extractedData.industries.filter((ind) => ind).join(", ")
                  : "No industries added"}
              </span>
            </p>
          )}
          {/* Expertise Tab - For Individual/Entrepreneur and Mentor */}
          {(extractedData?.role === "Individual/Entrepreneur" ||
            extractedData?.role === "Mentor") &&
            activeTab === "Expertise" && (
              <p>
                <span className="font-semibold text-gray-700 text-sm">
                  {extractedData?.skills?.length
                    ? extractedData.skills.join(", ")
                    : "No skills added"}
                </span>
              </p>
            )}

          {/* Role Tab - For Mentor only */}
          {extractedData?.role === "Mentor" && activeTab === "Level" && (
            <p>
              <span className="font-semibold text-gray-700 text-sm">
                {extractedData?.mentorRole || "No role added"}
              </span>
            </p>
          )}

          {/* Target Market Tab - For Startup */}
          {extractedData?.role === "Startup" &&
            activeTab === "TargetMarket" && (
              <p>
                <span className="font-semibold text-gray-700">
                  {extractedData?.targetMarket || "No target market selected"}
                </span>
              </p>
            )}

          {/* Stage Tab - For Startup */}
          {extractedData?.role === "Startup" && activeTab === "Stage" && (
            <p>
              <span className="font-semibold text-gray-700 text-sm">
                {extractedData?.stage
                  ?.split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ") || "No stage selected"}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Use PopupModal Component */}
      <PopupModal
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title="Edit Information"
      >
        <p>You can edit your details here.</p>
      </PopupModal>
    </div>
  );
};

export default TabsAndInvestment;
