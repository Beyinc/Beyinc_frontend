import React, { useState } from "react";
import "./TabsAndInvestment.css";

const TabsAndInvestment = () => {
  const [activeTab, setActiveTab] = useState("Expertise");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
          <div
            className={`Ttab ${activeTab === "Stages" ? "Tactive" : ""}`}
            onClick={() => handleTabClick("Stages")}
          >
            Stages
          </div>
        </div>
        <div className="content-container">
          {activeTab === "Expertise" && (
            <p>B2C Sales • Growth Marketing • Product Marketing</p>
          )}
          {activeTab === "Industries" && <p>Industry details go here.</p>}
          {activeTab === "Stages" && <p>Stages details go here.</p>}
        </div>
      </div>
      <div className="investment-range-container">
        <div className="investment-range-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17.414 10.414C18 9.828 18 8.886 18 7c0-1.886 0-2.828-.586-3.414m0 6.828C16.828 11 15.886 11 14 11h-4c-1.886 0-2.828 0-3.414-.586m10.828 0Zm0-6.828C16.828 3 15.886 3 14 3h-4c-1.886 0-2.828 0-3.414.586m10.828 0Zm-10.828 0C6 4.172 6 5.114 6 7c0 1.886 0 2.828.586 3.414m0-6.828Zm0 6.828ZM13 7a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z" />
              <path
                stroke-linecap="round"
                d="M18 6a3 3 0 0 1-3-3m3 5a3 3 0 0 0-3 3M6 6a3 3 0 0 0 3-3M6 8a3 3 0 0 1 3 3m-4 9.388h2.26c1.01 0 2.033.106 3.016.308a14.85 14.85 0 0 0 5.33.118c.868-.14 1.72-.355 2.492-.727c.696-.337 1.549-.81 2.122-1.341c.572-.53 1.168-1.397 1.59-2.075c.364-.582.188-1.295-.386-1.728a1.887 1.887 0 0 0-2.22 0l-1.807 1.365c-.7.53-1.465 1.017-2.376 1.162c-.11.017-.225.033-.345.047m0 0a8.176 8.176 0 0 1-.11.012m.11-.012a.998.998 0 0 0 .427-.24a1.492 1.492 0 0 0 .126-2.134a1.9 1.9 0 0 0-.45-.367c-2.797-1.669-7.15-.398-9.779 1.467m9.676 1.274a.524.524 0 0 1-.11.012m0 0a9.274 9.274 0 0 1-1.814.004"
              />
              <rect width="3" height="8" x="2" y="14" rx="1.5" />
            </g>
          </svg>
        </div>
        <div className="investment-range-text">
          <p className="investment-label">Investment Range</p>
          <p className="investment-value">₹ 1,00,000 - ₹ 5,00,000</p>
        </div>
      </div>
    </div>
  );
};

export default TabsAndInvestment;
