// InputPopup.jsx
import React from "react";
import CloseIcon from "@mui/icons-material/Close"; // if you're using this icon

const InputPopup = ({
  isVisible,
  setIsVisible,
  formState,
  setFormState,
  handleFormSubmit,
  handleInputChange,
  role,
  allsalutations,
  mentorcategories,
  places,
  handleCountryChange,
  handleStateChange,
  handleTownChange,
  formStateLanguages,
  removeLanguage,
  allLanguages,
  singlelanguagesKnown,
  setSinglelanguagesKnown,
  handleAddLanguage,
  mobile,
  mobileVerified,
}) => {
  if (!isVisible) return null;

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="Inputs-Container">
          <div className="Input_Wrapper">
            <div
              className="popup-header"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h3>Personal Information</h3>
              <div
                className="close-icon"
                onClick={() => {
                  document.getElementsByTagName("body")[0].style.overflowY =
                    "scroll";
                  setIsVisible(false);
                }}
              >
                <i
                  style={{ color: "var(--followBtn-bg)" }}
                  className="fas fa-times"
                ></i>
              </div>
            </div>

            {role === "Mentor" && (
              <div>
                <label className="Input-Label">Salutation</label>
                <select
                  name="salutation"
                  value={formState.salutation}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {allsalutations.map((op, i) => (
                    <option key={i} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <label className="Input-Label">Full Name</label>
            <div className="Input_Fields">
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={handleInputChange}
              />
            </div>

            {role === "Mentor" && (
              <div>
                <label className="Input-Label">Mentor Categories</label>
                <select
                  name="mentorCategories"
                  value={formState.mentorCategories}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {mentorcategories.map((op, i) => (
                    <option key={i} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <label className="Input-Label">Mobile Number</label>
            <div className="Input_Fields">
              <input
                type="text"
                className={
                  mobile && (mobile.length === 10 ? "valid" : "invalid")
                }
                name="mobileNumber"
                value={formState.mobileNumber}
                onChange={handleInputChange}
                placeholder="Mobile Number"
              />
              {mobileVerified === true}
            </div>

            <label className="Input-Label">Twitter</label>
            <div className="Input_Fields">
              <input
                type="text"
                name="twitter"
                value={formState.twitter}
                onChange={handleInputChange}
              />
            </div>

            <label className="Input-Label">Linkedin</label>
            <div className="Input_Fields">
              <input
                type="text"
                name="linkedin"
                value={formState.linkedin}
                onChange={handleInputChange}
              />
            </div>

            <h4>Location Info</h4>
            <div className="personal-container">
              <div>
                <label className="Input-Label">Country*</label>
                <select
                  name="country"
                  value={formState.country}
                  onChange={handleCountryChange}
                >
                  <option value="">Select</option>
                  {places.country?.map((op) => (
                    <option
                      key={op.isoCode}
                      value={`${op.name}-${op.isoCode}`}
                    >
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="Input-Label">State*</label>
                <select
                  name="state"
                  value={formState.state}
                  onChange={handleStateChange}
                >
                  <option value="">Select</option>
                  {places.state?.map((op) => (
                    <option
                      key={op.isoCode}
                      value={`${op.name}-${op.isoCode}`}
                    >
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="Input-Label">Town/City*</label>
                <select
                  name="town"
                  value={formState.town}
                  onChange={handleTownChange}
                >
                  <option value="">Select</option>
                  {places.town?.map((op) => (
                    <option key={op.name} value={op.name}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="Input-Label">Languages Known</label>
            {formStateLanguages.length > 0 && (
              <div className="listedTeam">
                {formStateLanguages.map((t, i) => (
                  <div className="singleMember" key={i}>
                    <div>{t}</div>
                    <div onClick={() => removeLanguage(i)}>
                      <CloseIcon className="deleteMember" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="skillsSelectBox">
              <select
                name="languagesKnown"
                value={singlelanguagesKnown}
                onChange={(e) => setSinglelanguagesKnown(e.target.value)}
              >
                <option value="">Select</option>
                {allLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="add-button" onClick={handleAddLanguage}>
              Add Language
            </button>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="add-button"
                type="button"
                onClick={() => {
                  console.log("button Clicked");
                  handleFormSubmit();
                  setIsVisible(false);
                }}
              >
                Save
              </button>
              <button
                style={{ position: "relative", zIndex: 9999 }}
                onClick={() => console.log("Clicked")}
              >
                Test Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPopup;
