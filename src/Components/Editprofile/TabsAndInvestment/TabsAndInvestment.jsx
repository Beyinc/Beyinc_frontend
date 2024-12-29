import React, { useState } from "react";
import PopupModal from "./PopupModal";
import "./TabsAndInvestment.css";

const TabsAndInvestment = ({ industries, stages, expertise }) => {
  const [activeTab, setActiveTab] = useState("Expertise");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleEditButtonClick = () => {
    setIsPopupOpen(true); // Show popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Hide popup
  };

  return (
    <div className="tabs-and-investment-container">
      <div>
        <div className="tabs-container">
          <div
            className={`Ttab ${activeTab === "Expertise" ? "Tactive" : ""}`}
            onClick={() => handleTabClick("Expertise")}
          >
            Expertise
          </div>
          <div
            className={`Ttab ${activeTab === "Industries" ? "Tactive" : ""}`}
            onClick={() => handleTabClick("Industries")}
          >
            Industries
          </div>
          <span>
            <i
              style={{ color: "var(--followBtn-bg)", cursor: "pointer" }}
              onClick={handleEditButtonClick}
              className="fas fa-pen"
            ></i>
          </span>
        </div>

        <div className="content-container">
          {activeTab === "Expertise" && <p>{expertise.join(", ")}</p>}
          {activeTab === "Industries" && <p>{industries.join(", ")}</p>}
          {activeTab === "Stages" && <p>{stages.join(", ")}</p>}
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