import { useState, useEffect } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import {
  allLanguages,
  STARTUP_VISIBILITY_MODES,
  STARTUP_TEAM_SIZES,
} from "../../Utils";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfileCardPopup = ({ setIsInputPopupVisible, profileData }) => {
  const [singlelanguagesKnown, setSinglelanguagesKnown] = useState("");
  const dispatch = useDispatch();

  const { email, role, userName, image, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails,
  );

  const navigate = useNavigate();
  const [places, setPlaces] = useState({
    country: Country.getAllCountries(),
    state: [],
    town: [],
  });

  const [formState, setFormState] = useState({
    fullName: "",
    headline: "",
    mobileNumber: "",
    twitter: "",
    linkedin: "",
    country: "",
    state: "",
    town: "",
    languages: [],
    startupName: "",
    founderName: "",
    startupTagline: "",
    contactEmail: "",
    teamSize: "",
    visibilityMode: "",
  });

  useEffect(() => {
    if (!profileData) return;

    setFormState({
      fullName: profileData.fullName || "",
      headline: profileData.headline || "",
      mobileNumber: profileData.mobileNumber || "",
      twitter: profileData.twitter || "",
      linkedin: profileData.linkedin || "",
      country: profileData.country || "",
      state: profileData.state || "",
      town: profileData.town || "",
      languages: profileData.languages || [],
      startupName: profileData.startupProfile?.startupName || "",
      founderName: profileData.startupProfile?.founderName || "",
      startupTagline: profileData.startupProfile?.startupTagline || "",
      contactEmail: profileData.startupProfile?.startupEmail || "",
      teamSize: profileData.startupProfile?.teamSize || "",
      visibilityMode: profileData.startupProfile?.visibilityMode || "",
    });
  }, [profileData]);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const countryCode = selectedCountry.split("-")[1];
    const states = State.getStatesOfCountry(countryCode) || [];
    setFormState((prevFormState) => ({
      ...prevFormState,
      country: selectedCountry,
      state: "",
      town: "",
    }));
    setPlaces({
      ...places,
      state: states,
      town: [],
    });
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const countryCode = formState.country.split("-")[1];
    const stateCode = selectedState.split("-")[1];
    const towns = City.getCitiesOfState(countryCode, stateCode) || [];
    setFormState((prevFormState) => ({
      ...prevFormState,
      state: selectedState,
      town: "",
    }));
    setPlaces({
      ...places,
      town: towns,
    });
  };

  const handleTownChange = (e) => {
    const selectedTown = e.target.value;
    setFormState((prevFormState) => ({
      ...prevFormState,
      town: selectedTown,
    }));
  };

  const removeLanguage = (index) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      languages: prevFormState.languages.filter((_, i) => i !== index),
    }));
  };

  const handleAddLanguage = () => {
    if (
      singlelanguagesKnown &&
      !formState.languages.includes(singlelanguagesKnown)
    ) {
      setFormState((prevFormState) => ({
        ...prevFormState,
        languages: [...prevFormState.languages, singlelanguagesKnown],
      }));
      setSinglelanguagesKnown("");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formState);
    try {
      // Save personal and location data
      await ApiServices.InputFormData({
        fullName: formState.fullName,
        headline: formState.headline,
        mobileNumber: formState.mobileNumber,
        twitter: formState.twitter,
        linkedin: formState.linkedin,
        country: formState.country,
        state: formState.state,
        town: formState.town,
        languages: formState.languages,
        user_id: user_id,
      });

      if (profileData?.role === "Startup") {
        // Save startup data separately
        await ApiServices.StartupEntryData({
          startupName: formState.startupName,
          startupTagline: formState.startupTagline,
          founderName: formState.founderName,
          startupEmail: formState.contactEmail,
          visibilityMode: formState.visibilityMode,
          startupTeamSize: formState.teamSize,
        });
      }

      alert("Data saved successfully!");
      handleClose();

      // window.location.href = "/editProfile";

      navigate("/editProfile");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("There was an error saving your data. Please try again.");
    }
  };

  const handleClose = () => {
    document.getElementsByTagName("body")[0].style.overflowY = "scroll";
    setIsInputPopupVisible(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData &&
                (profileData.role === "Enterpreneur" ||
                  profileData.role === "Mentor") && (
                  <div>
                    <div>
                      <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formState.fullName}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    {profileData?.role === "Enterpreneur" && (
                      <div>
                        <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                          Headline
                        </label>
                        <input
                          type="text"
                          name="headline"
                          value={formState.headline}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    )}
                  </div>
                )}
              <div>
                <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formState.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  className={`border rounded-md p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    formState.mobileNumber
                      ? formState.mobileNumber.length === 10
                        ? "border-green-500"
                        : "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                  Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formState.twitter}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              {/* <div> */}
              {/*   <label className="block text-sm font-semibold text-blue-600 mb-1.5"> */}
              {/*     LinkedIn */}
              {/*   </label> */}
              {/*   <input */}
              {/*     type="text" */}
              {/*     name="linkedin" */}
              {/*     value={formState.linkedin} */}
              {/*     onChange={handleInputChange} */}
              {/*     placeholder="linkedin.com/in/username" */}
              {/*     className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" */}
              {/*   /> */}
              {/* </div> */}
            </div>
          </div>

          {/* Startup Information Section */}
          {profileData.role === "Startup" && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">
                Startup Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                    Startup Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="startupName"
                    value={formState.startupName}
                    onChange={handleInputChange}
                    placeholder="e.g. TechVenture"
                    className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                    Founder/Co-founder Name(s){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="founderName"
                    value={formState.founderName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe, Jane Smith"
                    className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                    Tagline
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      (Max 100 characters)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="startupTagline"
                    value={formState.startupTagline}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        startupTagline: e.target.value.slice(0, 100),
                      }))
                    }
                    placeholder="e.g. Revolutionizing healthcare through AI"
                    maxLength={100}
                    className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formState.startupTagline.length}/100 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formState.contactEmail}
                    onChange={handleInputChange}
                    placeholder="contact@startup.com"
                    className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Team Size */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-blue-600 mb-3">
                  Team Size <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {STARTUP_TEAM_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setFormState((prev) => ({ ...prev, teamSize: size }))
                      }
                      className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                        formState.teamSize === size
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{size}</span>
                        {formState.teamSize === size && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility Mode */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-blue-600 mb-3">
                  Visibility Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {STARTUP_VISIBILITY_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() =>
                        setFormState((prev) => ({
                          ...prev,
                          visibilityMode: mode.id,
                        }))
                      }
                      className={`p-4 rounded-lg text-left transition-all border-2 ${
                        formState.visibilityMode === mode.id
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{mode.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`font-semibold text-sm ${formState.visibilityMode === mode.id ? "text-white" : "text-gray-800"}`}
                            >
                              {mode.label}
                            </span>
                            {formState.visibilityMode === mode.id && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <p
                            className={`text-xs mt-1 ${formState.visibilityMode === mode.id ? "text-indigo-100" : "text-gray-500"}`}
                          >
                            {mode.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location Information Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              Location Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                  Country
                </label>
                <select
                  name="country"
                  value={formState.country}
                  onChange={handleCountryChange}
                  className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select Country</option>
                  {places.country?.map((op) => (
                    <option key={op.isoCode} value={`${op.name}-${op.isoCode}`}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                  State
                </label>
                <select
                  name="state"
                  value={formState.state}
                  onChange={handleStateChange}
                  className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select State</option>
                  {places.state?.map((op) => (
                    <option key={op.isoCode} value={`${op.name}-${op.isoCode}`}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-600 mb-1.5">
                  Town/City
                </label>
                <select
                  name="town"
                  value={formState.town}
                  onChange={handleTownChange}
                  className="border border-gray-300 rounded-md p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select City</option>
                  {places.town?.map((op) => (
                    <option key={op.name} value={op.name}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-blue-600 mb-2">
                Languages Known
              </label>
              {formState.languages?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formState.languages.map((t, i) => (
                    <div
                      key={`${t}-${i}`}
                      className="bg-blue-100 px-3 py-1.5 flex items-center text-sm gap-2 rounded-full"
                    >
                      <span className="text-blue-800">{t}</span>
                      <button
                        onClick={() => removeLanguage(i)}
                        className="ml-1 text-red-500 hover:text-red-700 font-bold text-base leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <select
                  name="languagesKnown"
                  value={singlelanguagesKnown}
                  onChange={(e) => setSinglelanguagesKnown(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select Language</option>
                  {[...new Set(allLanguages)].map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleFormSubmit}
            className="px-6 py-2.5 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileCardPopup;
