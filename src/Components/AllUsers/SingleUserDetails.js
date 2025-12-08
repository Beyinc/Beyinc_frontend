import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";

// import Typography from "@mui/material/Typography";
// import AddPitch from "../Common/AddPitch";
import { setReceiverId } from "../../redux/Conversationreducer/ConversationReducer";
import { CiGlobe } from "react-icons/ci";
import { BsCircleFill } from "react-icons/bs";
import { CalendarServices } from "../../Services/CalendarServices";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

const SingleUserDetails = ({
  // d,
  user,
  setIsAdmin,
  connectStatus,
  setPitchSendTo,
  pitchSendTo,
  receiverRole,
  setreceiverRole,
}) => {
  // console.log(d);
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const dispatch = useDispatch();

  const [averagereview, setAverageReview] = useState(0);
  const navigate = useNavigate();

  const [requestPopup, setRequestPopup] = useState(false);
const [requestType, setRequestType] = useState("");
const [requestMessage, setRequestMessage] = useState("");

  //   useEffect(() => {
  //     const fetchAvailabilityData = async () => {
  //         try {
  //             const { data } = await CalendarServices.getAvailabilityData({ mentorId:id });
  //             // Logging the availability data
  //             console.log('Availability data:', JSON.stringify(data.availability));
  //             setService(data.availability.sessions)
  //             const availabilityData = data.availability;
  //             // Perform additional operations with availabilityData here
  //         } catch (error) {
  //             console.error("Error fetching availability data:", error);
  //         }
  //     };

  //     fetchAvailabilityData();
  // }, [id]); // Add dependencies if required

  useEffect(() => {
    setAverageReview(0);
    if (user.review !== undefined && user.review.length > 0) {
      let avgR = 0;
      user.review?.map((rev) => {
        avgR += rev.review;
      });
      setAverageReview(avgR / user.review.length);
    }
  }, [user]);

  const openUser = () => {
    if (user_id === user._id) {
      navigate(`/editProfile`);
    } else {
      navigate(`/user/${user._id}`);
    }
  };

  const isCurrentUser = email === user.email;

  const openChat = async (e) => {
    // await ApiServices.getProfile({ email: a.members.filter((f) => f.email !== email)[0].email }).then((res) => {
    dispatch(setReceiverId(user));
    // })
    navigate(`/conversations/${connectStatus[user._id]?.id}`);
  };

  const [activeTab, setActiveTab] = useState("Expertise");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSendRequest = async () => {
  if (!requestType || !requestMessage) {
    alert("Please fill all fields");
    return;
  }

  const requestPayload = {
    userId: user_id,
    mentorId: user._id,
    requestType,
    requestMessage,
  };

  try {

    await console.log("frontend data",requestPayload);
    const response = await CalendarServices.createRequest(requestPayload);

    console.log("Request Sent:", response);
    alert("Request Sent Successfully!");

    setRequestPopup(false);
    setRequestType("");
    setRequestMessage("");

  } catch (error) {
    console.error("Error sending request:", error.message);
    // alert("Failed to send request",error.message);
    alert("Failed to send request: " + error.response.data.message);

  }
};

// useEffect(()=>{
//   console.log("card details",user._id);
// })

  return (
    <>
      <div className="user-card-main-container flex-col">
        <div>
          <div className="flex flex-col xl:flex-row justify-center items-center p-5">
            {/* New Container Wrap */}
            <div className="container flex flex-col xl:flex-row w-full gap-7">
              {/* Left Side Content */}
              <div className="flex flex-col w-full xl:w-2/3">
                <div className="w-full">
                  <div className="flex flex-col xl:flex-row xl:gap-7">
                    <div className="user-card-image mt-4" onClick={openUser}>
                      <img
                        alt="user-pic"
                        src={
                          user.image !== "" &&
                          user.image !== undefined &&
                          user.image.url !== ""
                            ? user.image.url
                            : "/profile.png"
                        }
                      />
                    </div>
                    <div className="user-card-details-text pt-2">
                      <div className="flex items-center justify-between w-full max-w-[550px]">
                        <div className="flex">
                          <h2
                            className="text-black font-bold text-l"
                            onClick={openUser}
                          >
                            {user.userName}
                          </h2>
                          <span className="">
                            <img
                              className="size-5 xl:size-5 mt-2 "
                              src="/verify.png"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:space-x-12">
                        <span className="text-gray-500 font-semibold">
                          {user.role}
                        </span>
                        {user.languagesKnown.length > 0 && (
                          <span className="text-gray-500 font-semibold flex">
                            <CiGlobe className="md:mr-3 text-lg" />{" "}
                            {user.languagesKnown?.join(", ")}
                          </span>
                        )}
                      </div>
                      {user.beyincProfile && (
                        <h5
                          className="text-neutral-600 mt-1"
                          style={{ color: "#4F55C7" }}
                        >
                          {user.beyincProfile} at Beyinc
                        </h5>
                      )}
                      <p>{user.headline}</p>
                      <span
                        className="mt-2 break-words text-ellipsis overflow-hidden 2xl:w-full lg:w-3/5 md:w-3/5 sm:w-1/2 w-1/3"
                        style={{
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {user.about
                          ? user.about.slice(0, 150) + " . . ."
                          : "No bio available"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col h-auto mt-4 ml-3">
                    <div>
                      <div className="mt-4 max-w-[650px] tabsandinvestement">
                        <div>
                          <div className="tabs-container">
                            <div
                              className={`Ttab ${
                                activeTab === "Expertise" ? "Tactive" : ""
                              }`}
                              onClick={() => handleTabClick("Expertise")}
                            >
                              Expertise
                            </div>
                            <div
                              className={`Ttab ${
                                activeTab === "Industries" ? "Tactive" : ""
                              }`}
                              onClick={() => handleTabClick("Industries")}
                            >
                              Industries
                            </div>
                          </div>
                          <div className="content-container">
                            {activeTab === "Expertise" && (
                              <p>{user.expertise?.join(", ")}</p>
                            )}
                            {activeTab === "Industries" && (
                              <p>{user.industries?.join(", ")}</p>
                            )}
                            {activeTab === "Stages" && (
                              <p>{user.stages?.join(", ")}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="w-px h-72 bg-neutral-300 hidden xl:block"></div>

              {/* Right Side Content */}
              <div className="user-card-actions mt-2 lg:mt-0 w-full xl:w-1/3">
                <div className="w-full">
                  <div className="font-bold text-lg">Book a session</div>
                  <div className="mt-5">
                    <div className="flex">
                      <BsCircleFill
                        className="mr-4 mt-1"
                        style={{ fontSize: "7px" }}
                      />
                      Introduction
                    </div>
                    <div className="mt-3 text-neutral-500 ml-5">
                      <span className="mr-3">45 minutes</span>
                      <span>$200 per month</span>
                    </div>
                  </div>
                  <hr className="border-gray-300 my-4" />
                  <div className="mt-5">
                    <div className="flex">
                      <BsCircleFill
                        className="mr-4 mt-1"
                        style={{ fontSize: "7px" }}
                      />
                      Introduction
                    </div>
                    <div className="mt-3 text-neutral-500 ml-5">
                      <span className="mr-3">45 minutes</span>
                      <span>$200 per month</span>
                    </div>

                    <div className="request div">
                      <button onClick={()=>{
                        setRequestPopup(true)
                      }}>
                        Request a call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="user-card-rating space-y-2 mx-9">
            <span className="text-xs">62 Reviews/47 Sessions</span>
          </div>
        </div>
      </div>

     {requestPopup && (
  <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center">
    <div className="bg-white w-[400px] rounded-lg shadow-lg p-6 relative">

      {/* Close Icon */}
      <div
        className="absolute top-3 right-3 text-gray-500 cursor-pointer"
        onClick={() => {
          document.body.style.overflowY = "scroll";
          setRequestPopup(false);
        }}
      >
        <i className="fas fa-times text-blue-600"></i>
      </div>

      <h2 className="text-xl font-semibold text-center mb-4">Request a Call</h2>

      {/* Dropdown */}
      <label className="text-sm font-semibold text-blue-600">Request Type</label>
      <select
        className="border border-gray-300 rounded-md p-2 w-full mt-1"
        value={requestType}
        onChange={(e) => setRequestType(e.target.value)}
      >
        <option value="">Select Request Type</option>
        <option value="session">Session</option>
        <option value="webinar">Webinar</option>
        <option value="priority_dm">Priority DM</option>
      </select>

      {/* Message Box */}
      <div className="mt-4">
        <label className="text-sm font-semibold text-blue-600">Message</label>
        <textarea
          className="border border-gray-300 rounded-md w-full p-2 mt-1"
          rows="4"
          placeholder="Describe your request..."
          value={requestMessage}
          onChange={(e) => setRequestMessage(e.target.value)}
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
        onClick={handleSendRequest}
      >
        Send Request
      </button>
    </div>
  </div>
)}

    </>
  );
};

export default SingleUserDetails;
