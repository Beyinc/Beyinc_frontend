import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { useEffect, useRef, useState } from "react";
import ReviewStars from "../LivePitches/ReviewStars";
import AddReviewStars from "../LivePitches/AddReviewStars";
import ProfileImageUpdate from "../Navbar/ProfileImageUpdate";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { allLanguages } from "../../Utils";
import { Country, State, City } from "country-state-city";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { socket_io, postTypes } from "../../Utils";
import { io } from "socket.io-client";
import RecommendedConnectButton from "../Posts/RecommendedConnectButton";
import ProfileCardInfo from "./ProfileCardInfo";
import MentorCardInfo from "./MentorCardInfo";
import EditProfileCardPopup from "./EditProfileCardPopup";
import ProfileCompletionStatus from "./ProfileCompletionStatus";

const ProfileCard = ({
  selfProfile,
  setSelfProfile,
  profileDataObj,
  profileRole,
}) => {
  const [profileData, setProfileData] = useState({}); // Initialize as an empty object
  const [averageReview, setAverageReview] = useState(0); // State to hold the average review
  const [filledStars, setFilledStars] = useState(0); // State to store the filled stars for the review
  const [openEditPfp, setOpenEditPfp] = useState(false);
  const [isInputPopupVisible, setIsInputPopupVisible] = useState(false);
  const [singlelanguagesKnown, setSinglelanguagesKnown] = useState("");

  const [languagesKnown, setlanguagesKnown] = useState([]);
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [town, settown] = useState("");
  const dispatch = useDispatch();
  const [places, setPlaces] = useState({
    country: [],
    state: [],
    town: [],
  });

  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);

  const [formState, setFormState] = useState({
    fullName: "",
    headline: "",
    role: null,
    image: null,
    mobileNumber: "",
    twitter: "",
    linkedin: "",
    country: "",
    state: "",
    town: "",
    languages: [],
  });

  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);

  const handleToggleListing = (isListed) => {
    setProfileData({ ...profileData, isListed });
  };
  const { id } = useParams();

  const { email, role, userName, image, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails,
  );

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const followerController = async (e, id) => {
    console.log("Following user:", id);
    console.log("Current userId:", user_id);

    e.target.disabled = true;

    try {
      const response = await ApiServices.saveFollowers({
        followerReqBy: user_id,
        followerReqTo: id,
      });

      const updatedUser = response.data;

      // Update the state with the latest data
      setFollower(updatedUser.followers);
      setFollowing(updatedUser.following);

      // Emit socket notifications
      socket.current.emit("sendNotification", {
        senderId: user_id,
        receiverId: id,
      });
      socket.current.emit("sendFollowerNotification", {
        senderId: user_id,
        receiverId: id,
        type: "adding",
        image: updatedUser.image,
        role: updatedUser.role,
        _id: id,
        userName: updatedUser.userName,
      });

      console.log("Follow successful, updated user data:", updatedUser);
    } catch (err) {
      console.error("Error in followerController:", err);
      dispatch(
        setToast({
          message: "Error in following user",
          bgColor: ToastColors.failure,
          visible: "yes",
        }),
      );
    } finally {
      e.target.disabled = false;
    }
  };

  const unfollowHandler = async (e, id) => {
    console.log("Unfollowing user:", id);
    console.log("Current userId:", user_id);

    e.target.disabled = true;

    try {
      const response = await ApiServices.unfollowUser({
        unfollowReqBy: user_id,
        unfollowReqTo: id,
      });

      const updatedUser = response.data;

      // Update the state with the latest data
      setFollower(updatedUser.followers);
      setFollowing(updatedUser.following);

      // Emit socket notifications
      socket.current.emit("sendFollowerNotification", {
        senderId: user_id,
        receiverId: id,
        type: "removing",
        _id: id,
      });

      console.log("Unfollow successful, updated user data:", updatedUser);
    } catch (err) {
      console.error("Error in unfollowHandler:", err);
      dispatch(
        setToast({
          message: "Error while trying to unfollow",
          bgColor: ToastColors.failure,
          visible: "yes",
        }),
      );
    } finally {
      e.target.disabled = false;
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
      const response = await ApiServices.addReview({
        userId: user_id,
        rating: filledStars,
      });
      if (response.data.success) {
        // Optionally show a toast or feedback message
        console.log("Review added successfully");
      }
    } catch (error) {
      console.error("Error posting review", error);
    }
  };

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch profile data using id if present, otherwise use user_id
        const profileResponse = id
          ? await ApiServices.getProfile({ id })
          : await ApiServices.getProfile({ id: user_id });

        const profileData = profileResponse.data;
        // console.log("profiledata", profileData);
        setProfileData(profileData);

        if (profileData.review !== undefined && profileData.review.length > 0) {
          let avgR = 0;
          profileData.review.forEach((rev) => {
            avgR += rev.review;
          });
          setAverageReview(avgR / profileData.review.length);
        }

        const countryCode = profileData.country?.split("-")[1] || "";
        const stateCode = profileData.state?.split("-")[1] || "";

        setFormState((prevFormState) => ({
          ...prevFormState,
          fullName: profileData.userName,
          headline: profileData.headline || "",
          country: profileData.country || "",
          state: profileData.state || "",
          town: profileData.town || "",
          role: profileData.role || "",
          image: profileData.image || "",
          mobileNumber: profileData.mobileNumber || "",
          twitter: profileData.twitter || "",
          linkedin: profileData.linkedin || "",
        }));

        setFollower(profileData.followers || []);
        setFollowing(profileData.following || []);
        setlanguagesKnown(profileData.languagesKnown || []);

        settown(profileData.town || "");
        setCountry(profileData.country || "");
        setState(profileData.state || "");
        setPlaces({
          country: Country.getAllCountries(),
          state: State.getStatesOfCountry(countryCode) || [],
          town: City.getCitiesOfState(countryCode, stateCode) || [],
        });
      } catch (error) {
        dispatch(
          setToast({
            message: error?.response?.data?.message,
            bgColor: ToastColors.failure,
            visible: "yes",
          }),
        );
      }
    };

    fetchProfileData();
  }, [email, id, user_id]); // Include user_id in the dependencies

  const trimHeadline = (text) => {
    const words = text.trim().split(/\s+/);
    return words.length > 4 ? words.slice(0, 4).join(" ") + " . . . ." : text;
  };
  return (
    <div className="  h-auto pb-9 w-screen lg:w-[360px] flex flex-col items-center lg:rounded-3xl shadow-lg lg:bg-white relative">
      <div className="absolute lg:relative">
        <div className="relative group mt-4 flex items-center justify-center">
          <img
            className="size-28 lg:size-36 rounded-full m-0 bg-white p-3"
            // src={image !== undefined && image !== "" ? image : "/profile.png"}
            src={
              formState?.image && formState.image !== ""
                ? formState.image.url
                : "/profile.png"
            }
          />
          <i
            onClick={() => setOpenEditPfp(true)}
            className="fas fa-camera absolute flex items-center justify-center size-28 lg:size-36 ml-1 opacity-0 group-hover:bg-black/60 group-hover:opacity-100 group-hover:text-white group-hover:rounded-full"
          ></i>
        </div>
      </div>

      <div className="w-full flex flex-col items-center bg-white rounded-t-[40px] mt-20 lg:mt-0 pt-16 lg:pt-0">
        <div className="font-bold text-xl ml-3">
          {/* {userName && userName[0]?.toUpperCase() + userName?.slice(1)} */}
          {profileDataObj.role === "Startup"
            ? profileDataObj?.startupProfile?.startupName
            : formState?.fullName}
          <span onClick={() => setIsInputPopupVisible(true)}>
            {selfProfile && <i className="fas fa-pen"></i>}
          </span>
        </div>
        <div className="font-bold text-sm text-gray-500">{formState?.role}</div>
        {/* <div>{formState.headline}</div> */}
        <div className="flex justify-center">
          <div className="text-center">{trimHeadline(formState.headline)}</div>
        </div>
        {profileData?.beyincProfile && (
          <div className="font-bold text-md" style={{ color: "#4F55C7" }}>
            {profileData.beyincProfile} at Beyinc
          </div>
        )}
        <div className="flex flex-col gap-4 mt-2 ">
          {!selfProfile && (
            <div className="flex items-center gap-2">
              <button
                className="rounded-full p-[7px_37px]"
                onClick={(e) => {
                  follower.some((follower) => follower._id === user_id)
                    ? unfollowHandler(e, id) // Call unfollowHandler if "Unfollow"
                    : followerController(e, id); // Call followerController if "Follow"
                }}
              >
                {follower.some((follower) => follower._id === user_id)
                  ? "Unfollow"
                  : "Follow"}
              </button>
              <RecommendedConnectButton id={id} btnClassname="!p-[7px_37px]" />
            </div>
          )}

          {isInputPopupVisible && (
            <EditProfileCardPopup
              setIsInputPopupVisible={setIsInputPopupVisible}
              profileData={profileData}
            />
          )}
        </div>
        <div
          className="flex flex-col mt-4 font-medium
          w-full"
        >
          <div className="px-4 lg:px-28 gap-4 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Followers</span>
              <span className="font-semibold text-gray-700">
                {follower.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Following</span>
              <span className="font-semibold text-gray-700">
                {following.length}
              </span>
            </div>
            {/* startup profile info detils for other fields */}
            {profileRole === "Startup" && profileData.startupProfile && (
              <ProfileCardInfo
                profileData={profileData}
                profileRole={profileRole}
              />
            )}

            {/* mentor/Individual profile info detils for other fields */}
            {(profileRole === "Mentor" ||
              profileRole === "Individual/Entrepreneur") && (
              <MentorCardInfo
                profileData={profileData}
                profileRole={profileRole}
              />
            )}
            {country && (
              <div className="locationdetails">
                <div>
                  <svg
                    className="mt-3"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.3204 15.0939C21.0019 13.8147 21.3571 12.3871 21.3542 10.9377C21.3542 6.04756 17.3902 2.0835 12.5001 2.0835C7.60995 2.0835 3.64589 6.04756 3.64589 10.9377C3.64221 13.0264 4.38055 15.0485 5.72922 16.6434L5.73964 16.6564L5.74901 16.6668H5.72922L10.9834 22.245C11.1782 22.4517 11.4132 22.6164 11.6739 22.729C11.9347 22.8416 12.2157 22.8997 12.4998 22.8997C12.7838 22.8997 13.0649 22.8416 13.3257 22.729C13.5864 22.6164 13.8214 22.4517 14.0162 22.245L19.2709 16.6668H19.2511L19.2594 16.6569L19.2605 16.6559C19.298 16.6111 19.3353 16.566 19.3724 16.5205C19.7338 16.0765 20.0513 15.5991 20.3204 15.0939ZM12.5027 14.3226C11.6739 14.3226 10.879 13.9933 10.2929 13.4073C9.7069 12.8212 9.37766 12.0264 9.37766 11.1976C9.37766 10.3688 9.7069 9.5739 10.2929 8.98785C10.879 8.4018 11.6739 8.07256 12.5027 8.07256C13.3315 8.07256 14.1263 8.4018 14.7124 8.98785C15.2984 9.5739 15.6277 10.3688 15.6277 11.1976C15.6277 12.0264 15.2984 12.8212 14.7124 13.4073C14.1263 13.9933 13.3315 14.3226 12.5027 14.3226Z"
                      fill="var(--followBtn-bg)"
                    />
                  </svg>
                </div>
                <div className="mt-2">{country}</div>
              </div>
            )}
            {formState.linkedin && (
              <div className="locationdetails">
                <div>
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.0417 14.5835C17.125 13.896 17.1875 13.2085 17.1875 12.5002C17.1875 11.7918 17.125 11.1043 17.0417 10.4168H20.5625C20.7292 11.0835 20.8334 11.7814 20.8334 12.5002C20.8334 13.2189 20.7292 13.9168 20.5625 14.5835M15.198 20.3752C15.823 19.2189 16.3021 17.9689 16.6355 16.6668H19.7084C18.6992 18.4046 17.0981 19.721 15.198 20.3752ZM14.9375 14.5835H10.0625C9.95837 13.896 9.89587 13.2085 9.89587 12.5002C9.89587 11.7918 9.95837 11.0939 10.0625 10.4168H14.9375C15.0313 11.0939 15.1042 11.7918 15.1042 12.5002C15.1042 13.2085 15.0313 13.896 14.9375 14.5835ZM12.5 20.7918C11.6355 19.5418 10.9375 18.1564 10.5105 16.6668H14.4896C14.0625 18.1564 13.3646 19.5418 12.5 20.7918ZM8.33337 8.3335H5.29171C6.29029 6.59082 7.89031 5.27229 9.79171 4.62516C9.16671 5.78141 8.69796 7.03141 8.33337 8.3335ZM5.29171 16.6668H8.33337C8.69796 17.9689 9.16671 19.2189 9.79171 20.3752C7.89407 19.7213 6.29618 18.4045 5.29171 16.6668ZM4.43754 14.5835C4.27087 13.9168 4.16671 13.2189 4.16671 12.5002C4.16671 11.7814 4.27087 11.0835 4.43754 10.4168H7.95837C7.87504 11.1043 7.81254 11.7918 7.81254 12.5002C7.81254 13.2085 7.87504 13.896 7.95837 14.5835M12.5 4.19808C13.3646 5.44808 14.0625 6.84391 14.4896 8.3335H10.5105C10.9375 6.84391 11.6355 5.44808 12.5 4.19808ZM19.7084 8.3335H16.6355C16.3089 7.04351 15.8262 5.79819 15.198 4.62516C17.1146 5.28141 18.7084 6.60433 19.7084 8.3335ZM12.5 2.0835C6.73962 2.0835 2.08337 6.771 2.08337 12.5002C2.08337 15.2628 3.18084 17.9124 5.13435 19.8659C6.10162 20.8331 7.24995 21.6004 8.51375 22.1239C9.77756 22.6474 11.1321 22.9168 12.5 22.9168C15.2627 22.9168 17.9122 21.8194 19.8657 19.8659C21.8192 17.9124 22.9167 15.2628 22.9167 12.5002C22.9167 11.1322 22.6473 9.77769 22.1238 8.51388C21.6003 7.25007 20.833 6.10174 19.8657 5.13447C18.8985 4.16719 17.7501 3.3999 16.4863 2.87642C15.2225 2.35293 13.868 2.0835 12.5 2.0835Z"
                      fill="var(--followBtn-bg)"
                    />
                  </svg>
                </div>
                <a href={formState.linkedin} target="_blank">
                  Linkedin
                </a>
              </div>
            )}
            {formState.twitter && (
              <div className="locationdetails">
                <div>
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.0417 14.5835C17.125 13.896 17.1875 13.2085 17.1875 12.5002C17.1875 11.7918 17.125 11.1043 17.0417 10.4168H20.5625C20.7292 11.0835 20.8334 11.7814 20.8334 12.5002C20.8334 13.2189 20.7292 13.9168 20.5625 14.5835M15.198 20.3752C15.823 19.2189 16.3021 17.9689 16.6355 16.6668H19.7084C18.6992 18.4046 17.0981 19.721 15.198 20.3752ZM14.9375 14.5835H10.0625C9.95837 13.896 9.89587 13.2085 9.89587 12.5002C9.89587 11.7918 9.95837 11.0939 10.0625 10.4168H14.9375C15.0313 11.0939 15.1042 11.7918 15.1042 12.5002C15.1042 13.2085 15.0313 13.896 14.9375 14.5835ZM12.5 20.7918C11.6355 19.5418 10.9375 18.1564 10.5105 16.6668H14.4896C14.0625 18.1564 13.3646 19.5418 12.5 20.7918ZM8.33337 8.3335H5.29171C6.29029 6.59082 7.89031 5.27229 9.79171 4.62516C9.16671 5.78141 8.69796 7.03141 8.33337 8.3335ZM5.29171 16.6668H8.33337C8.69796 17.9689 9.16671 19.2189 9.79171 20.3752C7.89407 19.7213 6.29618 18.4045 5.29171 16.6668ZM4.43754 14.5835C4.27087 13.9168 4.16671 13.2189 4.16671 12.5002C4.16671 11.7814 4.27087 11.0835 4.43754 10.4168H7.95837C7.87504 11.1043 7.81254 11.7918 7.81254 12.5002C7.81254 13.2085 7.87504 13.896 7.95837 14.5835M12.5 4.19808C13.3646 5.44808 14.0625 6.84391 14.4896 8.3335H10.5105C10.9375 6.84391 11.6355 5.44808 12.5 4.19808ZM19.7084 8.3335H16.6355C16.3089 7.04351 15.8262 5.79819 15.198 4.62516C17.1146 5.28141 18.7084 6.60433 19.7084 8.3335ZM12.5 2.0835C6.73962 2.0835 2.08337 6.771 2.08337 12.5002C2.08337 15.2628 3.18084 17.9124 5.13435 19.8659C6.10162 20.8331 7.24995 21.6004 8.51375 22.1239C9.77756 22.6474 11.1321 22.9168 12.5 22.9168C15.2627 22.9168 17.9122 21.8194 19.8657 19.8659C21.8192 17.9124 22.9167 15.2628 22.9167 12.5002C22.9167 11.1322 22.6473 9.77769 22.1238 8.51388C21.6003 7.25007 20.833 6.10174 19.8657 5.13447C18.8985 4.16719 17.7501 3.3999 16.4863 2.87642C15.2225 2.35293 13.868 2.0835 12.5 2.0835Z"
                      fill="var(--followBtn-bg)"
                    />
                  </svg>
                </div>
                <a href={formState.twitter} target="_blank">
                  twitter
                </a>
              </div>
            )}

            {/* Profile Completion Status */}
            <ProfileCompletionStatus
              profileData={profileDataObj}
              profileType="Startup"
              onToggleListing={handleToggleListing}
            />
            {/* <div>
              {user_id == undefined ? (
                <ReviewStars />
              ) : (
                <>
                  <AddReviewStars />{" "}
                 
                </>
              )}
            </div>
            <div className="reviewSessionText">
              <b>{formState.review?.length}</b> Reviews / 0 Sessions
            </div> */}
          </div>
        </div>
        <ProfileImageUpdate open={openEditPfp} setOpen={setOpenEditPfp} />
      </div>
    </div>
  );
};

export default ProfileCard;
