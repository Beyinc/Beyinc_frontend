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

  return (
    <>
      <div className={"user-card-main-container"}>
        <div className="flex flex-col xl:flex-row justify-center items-center">
        <div className="user-card-details">
          <div className="user-card-img-rating-container">
            <div className="user-card-image" onClick={openUser}>
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
            <div className="user-card-rating space-y-2">
              <div cla ssName="rating-content">
                <i className="fas fa-star" style={{ color: "#4f55c7" }}></i>
                <span style={{ marginLeft: "3px" }}>
                  {averagereview.toFixed(1).split(".")[1] != "0"
                    ? averagereview.toFixed(1)
                    : averagereview.toFixed(0)}
                </span>
                <span className="ml-2 font-bold">Ratings</span>
              </div>
              <div className="rating-content">
                <i className="fas fa-comment" style={{ color: "#4f55c7" }}></i>
                <span style={{ marginLeft: "3px" }}>
                  {/*d.comments?.length*/}5
                </span>
              </div>
              <div>
                <span className="text-xs">62 Reviews/47 Sessions</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col h-auto">
            <div className="user-card-details-text">
              <div className="flex">
                <span className="user-name" onClick={openUser}>
                  {user.userName}
                </span>
                <span>
                  {/* {d.verification === "approved" && ( */}
                  <img
                    src="/verify.png"
                    alt=""
                    style={{
                      width: "15px",
                      height: "15px",
                      position: "absolute",
                      marginTop: "10px",
                    }}
                  />
                  {/* )} */}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-12 ">
                <span className="text-gray-500 font-semibold">{user.role}</span>
                <span className="text-gray-500 font-semibold flex">
                  <CiGlobe className="md:mr-3 text-lg" /> English,French
                </span>
              </div>

              {/* {d.educationDetails.length > 0 ? (
              <span>
                {d.educationDetails[0]?.grade} @{" "}
                {d.educationDetails[0]?.college}
              </span>
            ) : (
              <span
                style={{
                  color: "orange",
                  border: "1px dashed orange",
                  padding: "5px",
                  width: "136px",
                  whiteSpace: "noWrap",
                }}
              >
                Profile not updated
              </span>
            )} */}
              <span className="skills ">{user.skills?.join(", ")}</span>
              <span className="mt-2 2xl:w-[100%] lg:w-[60%] md:[60%] sm:[50%] w-[30%]">
                {user.bio ? user.bio.slice(0, 100) + " . . ." : "No bio available"}
              </span>
            </div>

            <div className="mt-4  tabsandinvestement">
              <div>
                <div className=" tabs-container">
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
                  <div
                    className={`Ttab ${
                      activeTab === "Stages" ? "Tactive" : ""
                    }`}
                    onClick={() => handleTabClick("Stages")}
                  >
                    Stages
                  </div>
                </div>
                <div className="content-container">
                  {activeTab === "Expertise" && (
                    <p>{user.expertise?.join(", ")}</p>
                  )}
                  {activeTab === "Industries" && (
                    <p>{user.industries?.join(", ")}</p>
                  )}
                  {activeTab === "Stages" && <p>{user.stages?.join(", ")}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-px h-72 bg-neutral-300 relative right-10 hidden md:hidden lg:hidden xl:hidden 2xl:block"></div>

        <div className="user-card-actions">
          <div className="mt-10">
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
                <span className="mr-3">45 minutes</span>{" "}
                {/* Adds margin-right */}
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
                <span className="mr-3">45 minutes</span>{" "}
                {/* Adds margin-right */}
                <span>$200 per month</span>
              </div>
            </div>
          </div>

          {/* {
             !isCurrentUser  &&
              (connectStatus[user._id]?.status === "pending" ? (
                <button className="pending-color">Pending</button>
              ) : connectStatus[user._id]?.status === "approved" ? (
                <button className="approved-color" onClick={openChat}>
                  Chat
                </button>
              ) : (
                <button
                  className="connect-color"
                  onClick={() => {
                    setPitchSendTo(user._id);
                    setreceiverRole(user.role);
                    setIsAdmin(user.email == process.env.REACT_APP_ADMIN_MAIL);
                  }}
                >
                  Connect
                </button>
              ))
          } */}
        </div>
        </div>
      </div>
    </>
  );
};

export default SingleUserDetails;
