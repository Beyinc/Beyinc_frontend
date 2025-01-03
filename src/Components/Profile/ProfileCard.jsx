import { useDispatch, useSelector } from 'react-redux';
import { ApiServices } from '../../Services/ApiServices';
import { useEffect, useState } from 'react';
import ReviewStars from '../LivePitches/ReviewStars';
import AddReviewStars from '../LivePitches/AddReviewStars';
import ProfileImageUpdate from '../Navbar/ProfileImageUpdate';
import { useParams } from 'react-router-dom';
import CloseIcon from "@mui/icons-material/Close";
import {
  allLanguages,
  allsalutations,
  mentorcategories,
} from "../../Utils";
import { Country, State, City } from "country-state-city";
import { setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';

const ProfileCard = () => {
  const [profileData, setProfileData] = useState({}); // Initialize as an empty object
  const [averageReview, setAverageReview] = useState(0); // State to hold the average review
  const [filledStars, setFilledStars] = useState(0); // State to store the filled stars for the review
  const [openEditPfp, setOpenEditPfp] = useState(false);
  const [isInputPopupVisible, setIsInputPopupVisible] = useState(false);
  const [singlelanguagesKnown, setSinglelanguagesKnown] = useState("");

  const {id} = useParams();
  const {
    userName: loggedUserName,
    image: loggedImage,
  } = useSelector((store) => store.auth.loginDetails);

  const { email, role, userName, image, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );

  const handleEditButtonClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    }, 500); // Delay of 500 milliseconds
    if (id === undefined) {
      setIsInputPopupVisible(true);
    }
  };

  // Function to fetch profile data
  const getProfile = async () => {
    try {
      console.log("This is the user_id", user_id, role);
      const response = await ApiServices.getProfile({ id: user_id });
      console.log("This is the response: ", response.data);
      setProfileData(response.data);
      console.log("These are the followers:", response.data.followers.length);
      
      // Call calculateAvgReview to calculate the average review after fetching profile
      calculateAvgReview(response.data.reviews);

    } catch (error) {
      console.log("There was an error while fetching profile: ", error);
    }
  };

  // Function to calculate average review
  const calculateAvgReview = (reviews) => {
    if (reviews && reviews.length > 0) {
      let avgR = 0;
      reviews.forEach((rev) => {
        avgR += rev.review;
      });
      const avgReview = avgR / reviews.length;
      setAverageReview(avgReview); // Set the average review value in state
    } else {
      setAverageReview(0); // Set to 0 if no reviews
    }
  };

  // Function to send the review
  const sendReview = async () => {
    try {
      const response = await ApiServices.addReview({ userId: user_id, rating: filledStars });
      if (response.data.success) {
        // Optionally show a toast or feedback message
        console.log('Review added successfully');
      }
    } catch (error) {
      console.error('Error posting review', error);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    getProfile();
  }, [user_id]); // Adding user_id as dependency in case it changes

  const [formState, setFormState] = useState({
    fullName: "",
    mobileNumber: "",
    twitter: "",
    linkedin: "",
    country: "",
    state: "",
    town: "",
    languages: [],
  });

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  };

  
  const [languagesKnown, setlanguagesKnown] = useState([]);
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [town, settown] = useState("");
  const dispatch = useDispatch();

    useEffect(() => {
        ApiServices.getProfile({ id: user_id })
          .then((res) => {
            console.log(res.data);
            if (res.data.review !== undefined && res.data.review?.length > 0) {
              let avgR = 0;
              res.data.review?.map((rev) => {
                avgR += rev.review;
              });
              setAverageReview(avgR / res.data.review.length);
            }

            const countryCode = res.data.country?.split("-")[1] || "";
            const stateCode = res.data.state?.split("-")[1] || "";
            setInputs((prev) => ({
              ...prev,
              twitter: res.data.twitter,
              linkedin: res.data.linkedin,
              review: res.data.review,
              verification: res.data.verification,
              updatedAt: res.data.updatedAt,
              name: res.data.userName,
              mobile: res.data.phone,
              role: res.data.role,
              mobileVerified: res.data.phone?.length > 0 ? true : false,
              image: res.data.image?.url || "",
              email: res.data.email,
            }));

            setFormState((prevFormState) => ({
              ...prevFormState,
              country: res.data.country || "",
              state: res.data.state || "",
              town: res.data.town || "",
            }));

              setlanguagesKnown(res.data.languagesKnown || []);

              settown(res.data.town || "");
              setCountry(res.data.country || "");
              setState(res.data.state || "");
              setPlaces({
                country: Country.getAllCountries(),
                state: State.getStatesOfCountry(countryCode) || [],
                town: City.getCitiesOfState(countryCode, stateCode) || [],
              });
          
          })

          .catch((error) => {
            dispatch(
              setToast({
                message: error?.response?.data?.message,
                bgColor: ToastColors.failure,
                visible: "yes",
              })
            );
          });
  }, [email, id]);

  const [inputs, setInputs] = useState({
    twitter: null,
    linkedin: null,
    review: [],
    userName: null,
    mobile: null,
    name: null,
    role: null,
    image: null,
  });

  const {
    review,
    twitter,
    linkedin,
    mobile,
    mobileVerified
  } = inputs;

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const countryCode = selectedCountry.split("-")[1]; // Extract country code
    const states = State.getStatesOfCountry(countryCode) || [];
    setFormState((prevFormState) => ({
      ...prevFormState,
      country: selectedCountry, // Update the selected country
      state: "", // Reset state
      town: "", // Reset town
    }));
    setPlaces({
      ...places,
      state: states,
      town: [],
    });
    // No need to set `places` directly here, the `useEffect` will handle fetching states.
  };

  const [places, setPlaces] = useState({
    country: [],
    state: [],
    town: [],
  });

  // Handle state change
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const countryCode = formState.country.split("-")[1]; // Extract country code
    const stateCode = selectedState.split("-")[1]; // Extract state code
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

  // Handle town change
  const handleTownChange = (e) => {
    const selectedTown = e.target.value;
    setFormState((prevFormState) => ({
      ...prevFormState,
      town: selectedTown,
    }));
  };

  // Remove selected language
  const removeLanguage = (index) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      languages: prevFormState.languages.filter((_, i) => i !== index),
    }));
  };

  // Handle language selection
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
    console.log(formState);
    e.preventDefault();
    try {
      await ApiServices.InputFormData({...formState, "user_id" : user_id});
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("There was an error saving your data. Please try again.");
    }
  };

  return (
    <div className="h-auto pb-9 w-[360px] flex flex-col items-center rounded-lg shadow-lg bg-white">
      <div className="relative group mt-4">
        <img
          className="size-36 rounded-full"
          src={
            image !== undefined && image !== "" ? image : "/profile.png"
          }
        /><span>
        
      </span>
        <i 
        onClick={() => setOpenEditPfp(true)}
        className="fas fa-camera absolute top-0 bottom-[10px] left-[13px] p-[68px] opacity-0 group-hover:bg-black/60 group-hover:opacity-100 group-hover:text-white group-hover:rounded-full"></i>


      </div>
      <div className="font-bold text-xl ">
        {userName && userName[0]?.toUpperCase() + userName?.slice(1)}<i
          style={{ color: "var(--followBtn-bg)" }}
          onClick={handleEditButtonClick}
          className="fas fa-pen"
        ></i>
      </div>

      <div className="font-bold text-xl text-gray-500">{role}</div>

      <div className='flex flex-col gap-4 mt-2 '>
        <button className="rounded-full px-20">
          Follow
        </button>

        {isInputPopupVisible && (
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
                        document.getElementsByTagName(
                          "body"
                        )[0].style.overflowY = "scroll";
                        setIsInputPopupVisible(false);
                      }}
                    >
                      <i
                        style={{ color: "var(--followBtn-bg)" }}
                        class="fas fa-times"
                      ></i>
                    </div>
                  </div>
                  
                  <label className="Input-Label">Full Name</label>
                  <div className="Input_Fields">
                    <input
                      type="text"
                      name="fullName"
                      value={formState.fullName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <label className="Input-Label">Mobile Number</label>
                  <div className="Input_Fields">
                    <div>
                      <div>
                        <input
                          type="text"
                          className={
                            mobile &&
                            (mobile.length === 10 ? "valid" : "invalid")
                          }
                          name="mobileNumber"
                          id="mobile"
                          value={formState.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="Mobile Number"
                        />
                        {mobileVerified === true}
                      </div>
                    </div>
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
                  <div className="Location-details">
                    <h4>Location Info</h4>
                    <form className="update-form">
                      <div className="personal-container">
                        <div>
                          <div>
                            <label className="Input-Label">Country</label>
                          </div>
                          <select
                            name="country"
                            id=""
                            value={formState.country}
                            onChange={handleCountryChange}
                          >
                            <option value="">Select</option>
                            {places.country?.map((op) => (
                              <option
                                key={op.isoCode}
                                value={`${op.name}-${op.isoCode}`}
                                // selected={country?.split("-")[0] == op.name}
                              >
                                {op.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <div>
                            <label className="Input-Label">State</label>
                          </div>
                          <select
                            name="state"
                            id=""
                            value={formState.state}
                            onChange={handleStateChange}
                          >
                            <option value="">Select</option>
                            {places.state?.map((op) => (
                              <option
                                key={op.isoCode}
                                value={`${op.name}-${op.isoCode}`}
                                // selected={state?.split("-")[0] === op.name}
                              >
                                {op.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div>
                            <label className="Input-Label">Town/city</label>
                          </div>
                          <select
                            name="town"
                            id=""
                            value={formState.town}
                            onChange={handleTownChange}
                          >
                            <option value="">Select</option>
                            {places.town?.map((op) => (
                              <option
                                key={op.name}
                                value={op.name}
                                // selected={town?.split("-")[0] === op.name}
                              >
                                {op.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>

                    <div>
                      <div>
                        <label className="Input-Label">Languages Known</label>
                      </div>
                      <div>
                        {formState.languages?.length > 0 && (
                          <div className="listedTeam">
                            {formState.languages?.map((t, i) => (
                              <div className="singleMember" key={i}>
                                <div>{t}</div>
                                <div onClick={() => removeLanguage(i)}>
                                  <CloseIcon className="deleteMember" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          flexDirection: "column",
                        }}
                      >
                        <div className="skillsSelectBox">
                          <select
                            name="languagesKnown"
                            value={singlelanguagesKnown}
                            onChange={(e) =>
                              setSinglelanguagesKnown(e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {allLanguages.map((language) => (
                              <option key={language} value={language}>
                                {language}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          className="add-button"
                          onClick={handleAddLanguage}
                        >
                          Add Language
                        </button>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            className="add-button"
                            onClick={handleFormSubmit}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-4 font-bold w-full ">
        <div className="px-28 gap-4 flex flex-col">
          <div className="flex justify-between">
            <span>Followers</span> <span>{profileData.followers ? profileData.followers.length : 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Following</span> <span>{profileData.following ? profileData.following.length : 0}</span>
          </div>
          <div>
              {user_id == undefined ? (
                <ReviewStars  />
              ) : (
                <>
                  <AddReviewStars
                    
                  />{" "}
                  {/* <button className="reviewPostButton" onClick={sendReview}>
                    Post
                  </button> */}
                </>
              )}
            </div>
        </div>
      </div>
      <ProfileImageUpdate open={openEditPfp} setOpen={setOpenEditPfp} />
      
    </div>
  );
};

export default ProfileCard;
