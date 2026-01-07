import { useState } from "react";
import { Edit2, Target, Rocket, DollarSign } from "lucide-react";

const MainContent = ({
  profileData,
  // onEditSeeking,
}) => {
  const [activeContentTab, setActiveContentTab] = useState("about");

  return (
    <div className="bg-white rounded-lg shadow-lg border border-border p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveContentTab("about")}
          className={`pb-3 px-4 font-semibold transition-colors bg-transparent ${
            activeContentTab === "about"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          About
        </button>

        <button
          type="button"
          onClick={() => setActiveContentTab("reviews")}
          className={`pb-3 px-4 font-semibold transition-colors bg-transparent ${
            activeContentTab === "reviews"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Reviews ({profileData.reviews || "12"})
        </button>
      </div>

      {/* ABOUT */}
      {activeContentTab === "about" && (
        <div className="space-y-6">
          {/* Bio */}
          <div className="flex items-start justify-between">
            <p className="text-gray-700 leading-relaxed flex-1">
              {profileData.bio ||
                "TechVenture is an early-stage startup focused on revolutionizing healthcare through AI. We're building innovative solutions to help healthcare providers deliver better patient care."}
            </p>
            <button
              type="button"
              // onClick={onEditAbout}
              className="ml-4 flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 "
            >
              <Edit2 size={16} />
              Edit
            </button>
          </div>
          {/* Problem Statement */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target size={20} />
              Problem Statement
            </h3>
            <p className="text-gray-700">
              {profileData.problemStatement ||
                "Healthcare providers struggle with inefficient patient data management and diagnosis accuracy."}
            </p>
          </div>
          {/* What We're Building */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Rocket size={20} />
              What We're Building
            </h3>
            <p className="text-gray-700">
              {profileData.whatBuilding ||
                "We're building an AI-powered platform that helps healthcare providers manage patient data more efficiently and improve diagnosis accuracy through machine learning algorithms."}
            </p>
          </div>
          {/* Value Proposition */}
          <div>
            <h3 className="text-lg font-bold mb-4">Value Proposition</h3>
            <p className="text-gray-700">
              {profileData.valueProposition ||
                "Our platform reduces administrative burden by 60% and improves diagnosis accuracy by 40%."}
            </p>
          </div>
          {/* Seeking */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">What We're Seeking</h3>
              <button
                type="button"
                // onClick={onEditSeeking}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit2 size={16} />
                Edit
              </button>
            </div>

            {profileData.seeking && profileData.seeking.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileData.seeking.map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {["Mentorship", "Investors/Funding", "Technical Talent"].map(
                  (item, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            )}
          </div>
          {/* Funding */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <DollarSign size={20} />
              Funding Status
            </h3>
            <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              {profileData.fundingStatus || "Pre-Seed"}
            </span>
            <p className="text-sm text-gray-600 mt-2">
              Seeking:{" "}
              <strong>{profileData.fundingAmount || "500K - 1M"}</strong>
            </p>
          </div>
        </div>
      )}

      {/* REVIEWS */}
      {activeContentTab === "reviews" && (
        <div className="text-center py-12 text-gray-500">
          <p>Reviews section coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
