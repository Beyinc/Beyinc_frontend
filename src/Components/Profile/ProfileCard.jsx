import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { useEffect, useRef, useState } from "react";
import ReviewStars from "../LivePitches/ReviewStars";
import AddReviewStars from "../LivePitches/AddReviewStars";
import ProfileImageUpdate from "../Navbar/ProfileImageUpdate";
import { useParams } from "react-router-dom";
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
import FoundingTeamWidget from './FoundingTeam';
import ProfileCompletionStatus from "./ProfileCompletionStatus";
import {
  Camera,
  Pencil,
  Linkedin,
  MapPin,
  Twitter,
} from "lucide-react";

const ProfileCard = ({
  selfProfile,
  setSelfProfile,
  profileDataObj,
  profileRole,
}) => {
  const [profileData, setProfileData] = useState({});
  const [averageReview, setAverageReview] = useState(0);
  const [filledStars, setFilledStars] = useState(0);
  const [openEditPfp, setOpenEditPfp] = useState(false);
  const [isInputPopupVisible, setIsInputPopupVisible] = useState(false);
  const [singlelanguagesKnown, setSinglelanguagesKnown] = useState("");

  // --- NEW STATE FOR FOUNDING TEAM ---
  const [foundingTeam, setFoundingTeam] = useState([]); 

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

  const { id } = useParams();

  const { email, role, userName, image, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails,
  );

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  // --- EFFECT TO FETCH FOUNDING TEAM (For Owner) ---
  useEffect(() => {
    // Only fetch specifically via getFoundingTeam if it's the owner
    // Visitors will get this data via the main getProfile call below
    if (selfProfile && profileRole === "Startup") {
      const fetchTeam = async () => {
        try {
          const response = await ApiServices.getFoundingTeam();
          setFoundingTeam(response.cofounders || []);
        } catch (error) {
          console.error("Error fetching founding team:", error);
        }
      };
      fetchTeam();
    }
  }, [selfProfile, profileRole]);

  // ... (Follower/Unfollow logic remains the same) ...
  const followerController = async (e, id) => {
    // ... same as before
    console.log("Following user:", id);
    e.target.disabled = true;

    try {
      const response = await ApiServices.saveFollowers({
        followerReqBy: user_id,
        followerReqTo: id,
      });

      const updatedUser = response.data;

      setFollower(updatedUser.followers);
      setFollowing(updatedUser.following);

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
    // ... same as before
    console.log("Unfollowing user:", id);
    e.target.disabled = true;

    try {
      const response = await ApiServices.unfollowUser({
        unfollowReqBy: user_id,
        unfollowReqTo: id,
      });

      const updatedUser = response.data;

      setFollower(updatedUser.followers);
      setFollowing(updatedUser.following);

      socket.current.emit("sendFollowerNotification", {
        senderId: user_id,
        receiverId: id,
        type: "removing",
        _id: id,
      });

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

  const calculateAvgReview = (reviews) => {
    if (reviews && reviews.length > 0) {
      let avgR = 0;
      reviews.forEach((rev) => {
        avgR += rev.review;
      });
      const avgReview = avgR / reviews.length;
      setAverageReview(avgReview);
    } else {
      setAverageReview(0);
    }
  };

  const sendReview = async () => {
    try {
      const response = await ApiServices.addReview({
        userId: user_id,
        rating: filledStars,
      });
      if (response.data.success) {
        console.log("Review added successfully");
      }
    } catch (error) {
      console.error("Error posting review", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  };

  // --- MAIN PROFILE DATA FETCH ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = id
          ? await ApiServices.getProfile({ id })
          : await ApiServices.getProfile({ id: user_id });

        const profileData = profileResponse.data;
        setProfileData(profileData);


        if (!selfProfile && profileData.role === "Startup") {
            const teamData = profileData.cofounders || profileData.startupProfile?.cofounders || [];
            setFoundingTeam(teamData);
        } else if (selfProfile && profileData.cofounders) {
            // If self profile, we might also get it here initially before the specific useEffect runs
             setFoundingTeam(profileData.cofounders);
        }
        // ------------------------

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
          })
        );
      }
    };

    fetchProfileData();
  }, [email, id, user_id]); // Make sure dependencies are correct

  const trimHeadline = (text) => {
    const words = text.trim().split(/\s+/);
    return words.length > 4 ? words.slice(0, 4).join(" ") + " . . . ." : text;
  };

  return (
    <div className="h-auto pb-9 w-screen lg:w-[360px] flex flex-col items-center lg:rounded-3xl shadow-lg lg:bg-white relative">
      <div className="absolute lg:relative">
        <div className="relative group mt-4 flex items-center justify-center">
          <img
            className="size-28 lg:size-36 rounded-full m-0 bg-white p-3"
            src={
              formState?.image && formState.image !== ""
                ? formState.image.url
                : "/profile.png"
            }
          />
          {selfProfile && (
            <div
              onClick={() => setOpenEditPfp(true)}
              className="absolute flex items-center justify-center size-28 lg:size-36 ml-1 opacity-0 group-hover:bg-black/60 group-hover:opacity-100 group-hover:text-white group-hover:rounded-full cursor-pointer"
            >
              <Camera size={28} className="text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col items-center bg-white rounded-t-[40px] mt-24 lg:mt-4 pt-16 lg:pt-0">
        {/* Updated Name Container: Flex to align Name + Badge + Pen */}
<div className="flex items-center justify-center gap-2 font-bold text-xl mt-2">
  <span>
    {profileDataObj.role === "Startup"
      ? profileDataObj?.startupProfile?.startupName
      : formState?.fullName}
  </span>

  {/* Instagram-style Verification Badge */}
  {profileData?.verified && (
    <svg
      className="w-5 h-5 text-green-600"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* "Seal" shape with checkmark */}
      <path d="M23 12l-2.44-2.79.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.79-.34 3.68 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5l-4-4 1.41-1.41L13 14.17l7.59-7.59L22 8l-9 9z" />
    </svg>
  )}

  <span onClick={() => setIsInputPopupVisible(true)}>
    {selfProfile && <i className="fas fa-pen ml-1 cursor-pointer text-sm"></i>}
  </span>
</div> 


        <div className="flex justify-center">
          <div className="text-center">{trimHeadline(formState.headline)}</div>
        </div>
       {/* {(profileData.role==="Mentor"||profileData.role==="Startup") && (
          <div className="font-bold text-md text-amber-600" >
           Not Verified
          </div>
        )} */}
  
        {profileData?.verified === true && (
          <div className="flex items-center gap-2 font-bold text-md text-green-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Verified
          </div>
        )}





        {/* 3. Existing "Verification Pending" logic */}
        {profileData?.verified === false &&
          profileData?.beyincProfile.length === 0 &&
          profileData.role !== "Individual"&&
           (
            <div className="flex items-center gap-2 font-semibold text-md text-amber-600">
              Verification Pending
            </div>
          )}

        {/* 4. Existing "Will Verify Soon" logic */}
        {profileData.verified === false &&
          profileData?.beyincProfile?.length !== 0 &&
           profileData.role !== "Individual" && (
            <div className="flex items-center gap-2 font-semibold text-md text-amber-600">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Will Verify Soon
            </div>
          )}
        <div className="flex flex-col gap-4 mt-2 ">
          {!selfProfile && (
            <div className="flex items-center gap-2">
              <button
                className="rounded-full p-[7px_37px]"
                onClick={(e) => {
                  follower.some((follower) => follower._id === user_id)
                    ? unfollowHandler(e, id)
                    : followerController(e, id);
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

        <div className="flex flex-col mt-4 font-medium w-full">
          <div className="px-6 gap-4 flex flex-col">
            {/* Followers */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-900">Followers</span>
              <span className="font-semibold text-gray-700">
                {follower.length}
              </span>
            </div>

            {/* Following */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-900">Following</span>
              <span className="font-semibold text-gray-700">
                {following.length}
              </span>
            </div>

            {/* Mentor-only: LinkedIn + Years of Exp */}
            {profileRole === "Mentor" && (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">LinkedIn</span>
                  {profileData?.linkedinProfile ? (
                    <a
                      href={profileData.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Linkedin size={22} className="text-blue-600" />
                    </a>
                  ) : (
                    <Linkedin size={22} className="text-gray-400" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">
                    Years of Exp
                  </span>
                  <span className="font-semibold text-gray-700">
                    {profileData?.experienceYears
                      ? `${profileData.experienceYears}`
                      : "Not specified"}
                  </span>
                </div>
              </>
            )}

            {/* Startup profile info */}
            {profileRole === "Startup" && profileData.startupProfile && (
              <ProfileCardInfo
                profileData={profileData}
                profileRole={profileRole}
              />
            )}

            {/* Mentor / Individual profile info */}
            {(profileRole === "Mentor" ||
              profileRole === "Enterpreneur") && (
              <MentorCardInfo
                profileData={profileData}
                profileRole={profileRole}
              />
            )}

            {/* Location */}
            {country && (
              <div className="flex items-center gap-2">
                <MapPin size={22} className="text-blue-600 shrink-0" />
                <span className="font-medium text-gray-700">{country}</span>
              </div>
            )}

            {/* Twitter */}
            {formState.twitter && (
              <div className="flex items-center gap-2">
                <Twitter size={22} className="text-sky-500 shrink-0" />
                <a
                  href={formState.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-700 hover:text-sky-500 transition-colors"
                >
                  Twitter
                </a>
              </div>
            )}
          </div>

          {/* --- UPDATED FOUNDING TEAM WIDGET --- */}
          {/* Only render this section if it is a Startup Profile */}
          {profileRole === "Startup" && (
              <div className="px-6 mt-4">
                <FoundingTeamWidget 
                  userId={profileData?._id}
                  startupName={profileDataObj?.startupProfile?.startupName || formState.fullName}
                  initialTeam={foundingTeam}
                  // IMPORTANT: Pass isOwner so the widget knows if it can show edit buttons
                  isOwner={selfProfile} 
                />
              </div>
          )}

          {/* Profile Completion Status */}
          {selfProfile && (
            <ProfileCompletionStatus
              profileData={profileDataObj}
              profileType="Startup"
            />
          )}
        </div>

        <ProfileImageUpdate open={openEditPfp} setOpen={setOpenEditPfp} />
      </div>
    </div>
  );
};

export default ProfileCard;