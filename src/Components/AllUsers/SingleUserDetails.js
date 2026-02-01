import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setReceiverId } from "../../redux/Conversationreducer/ConversationReducer";
import { CalendarServices } from "../../Services/CalendarServices";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaStar,
  FaGlobe,
  FaTimes,
  FaChevronDown,
  FaClock,
  FaTags,
} from "react-icons/fa";
import RecommendedConnectButton from "../Posts/RecommendedConnectButton";

const SingleUserDetails = ({ user, connectStatus, viewMode }) => {
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const navigate = useNavigate();

  // --- Logic State ---
  const [averagereview, setAverageReview] = useState(0);
  const [requestPopup, setRequestPopup] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [session, setSession] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeTab, setActiveTab] = useState("Expertise");
  const [startupActiveTab, setStartupActiveTab] = useState("Industries");

  // --- TOGGLE FOR PRODUCTION ---
  const IS_FEATURE_LOCKED = true;

  // --- Effects ---
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        const { data } = await CalendarServices.getAvailabilityData({
          mentorId: user._id,
        });
        // Logging the availability data
        // console.log(
        //   "Availability data found here:",
        //   JSON.stringify(data.availability),
        // );
        setSession(data.availability.sessions);
        console.log("sessions are ", data.availability.sessions);
        // console.log("Sessions data:", data.availability.sessions);
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
    };
    if (user._id) fetchAvailabilityData();
  }, [user._id]);

  useEffect(() => {
    setAverageReview(0);
    if (user.review && user.review.length > 0) {
      let avgR = 0;
      user.review.forEach((rev) => {
        avgR += rev.review;
      });
      setAverageReview((avgR / user.review.length).toFixed(1));
    }
  }, [user]);

  // --- Handlers ---
  const openUser = () => {
    if (user_id === user._id) {
      navigate(`/editProfile`);
    } else {
      navigate(`/user/${user._id}`);
    }
  };

  const handleSendRequest = async () => {
    if (!requestMessage) {
      alert("Please fill all fields");
      return;
    }

    const requestPayload = {
      userId: user_id,
      mentorId: user._id,
      requestType: "session",
      requestMessage,
      amount: selectedSession?.amount,
      duration: selectedSession?.duration,
    };

    try {
      await CalendarServices.createRequest(requestPayload);
      alert("Request Sent Successfully!");
      setRequestPopup(false);
      setRequestMessage("");
    } catch (error) {
      console.error("Error sending request:", error.message);
      const errorMsg = error.response?.data?.message || error.message;
      alert("Failed to send request: " + errorMsg);
    }
  };

  // derive industries and expertise from mentorExpertise when available
  const industriesFromMentorExpertise =
    user?.mentorExpertise && Array.isArray(user.mentorExpertise)
      ? user.mentorExpertise.map((m) => m.industry).filter(Boolean)
      : [];

  const expertiseFromMentorExpertise =
    user?.mentorExpertise && Array.isArray(user.mentorExpertise)
      ? user.mentorExpertise
          .flatMap((m) => (Array.isArray(m.skills) ? m.skills : []))
          .filter(Boolean)
      : [];

  // NEW - derive industries, stage, seeking, AND target market from startupProfile
  const industriesFromStartup =
    user?.startupProfile?.industries &&
    Array.isArray(user.startupProfile.industries)
      ? user.startupProfile.industries.filter((ind) => ind !== "")
      : [];
  const stageFromStartup = user?.startupProfile?.stage || null;
  const seekingFromStartup =
    user?.seekingOptions && Array.isArray(user.seekingOptions)
      ? user.seekingOptions
      : [];
  const targetMarketFromStartup = user?.startupProfile?.targetMarket || null; // NEW

  const [recommendedUserTrigger, setRecommendedUserTrigger] = useState(false);
  return (
    <>
      {/* --- Main Card Container --- */}
      <div className="w-full bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:border-[#4f55c7]/30 hover:scale-[1.02] mb-6 ">
        {/* user details */}
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          {/* 1. Image Section */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4 w-full md:w-40">
            <div
              className="flex-shrink-0 group cursor-pointer"
              onClick={openUser}
            >
              <img
                src={
                  user.image?.url && user.image.url !== ""
                    ? user.image.url
                    : "/profile.png"
                }
                alt={user.userName}
                className="w-24 h-24 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110 shadow-sm"
              />
            </div>

            {(user.role === "Startup"|| user.beyincProfile==="Mentor") && (
              <RecommendedConnectButton
                id={user._id}
                viewMode={viewMode}
                handleFollower={() => {
                  setRecommendedUserTrigger(!recommendedUserTrigger);
                }}
              />
            )}
          </div>
          {/* 2. Middle Content Section */}
          <div className="flex-1 min-w-0 md:border-l md:border-gray-300 md:pl-6">
            {/* Header: Name & Verify */}
            <div className="flex items-center justify-start gap-3 mb-2">
              <h3
                className="text-xl font-bold text-gray-900 cursor-pointer hover:text-[#4f55c7] transition-colors"
                onClick={openUser}
              >
                {user?.role === "Startup"
                  ? (user?.startupProfile?.startupName ?? "Unnamed Startup")
                  : (user?.userName ?? "Unknown User")}
              </h3>
              {user?.role === "Startup" &&
                user?.startupProfile?.targetMarket && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {user.startupProfile.targetMarket}
                  </span>
                )}
              {/* <span className="text-[#4f55c7]">
                <img className="w-5 h-5" src="/verify.png" alt="Verified" />
              </span> */}
            </div>

            {/* Role */}
            <p className="text-sm font-medium text-[#4f55c7] mb-1">
              {user.beyincProfile || "Individual/Entrepreneur"}
            </p>

            {/* Headline */}

            {user?.headline && (
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {user.headline}
              </p>
            )}

            {/* Bio */}
            {user.beyincProfile === "Mentor" && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                {user.about || "No bio available."}
              </p>
            )}

            {/* Tabs - Conditional based on viewMode */}
            <div className="mb-3">
              <div className="flex flex-row justify-center items-center gap-2.5 mb-6 p-2.5 rounded-[20px] w-fit max-w-full bg-white border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                {user.beyincProfile === "Mentor" &&
                  viewMode === "mentors" &&
                  ["Expertise", "Industries"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2.5 rounded-[20px] text-sm font-semibold transition-all ${
                        activeTab === tab
                          ? "text-[#4f55c7] shadow-sm"
                          : "bg-transparent text-gray-800 hover:bg-gray-100"
                      }`}
                      style={activeTab === tab ? { background: '#E3E5FD' } : {}}
                    >
                      {tab}
                    </button>
                  ))}
                {user.role === "Startup" &&
                  viewMode === "startups" &&
                  ["Industries", "Stage", "Seeking"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStartupActiveTab(tab)}
                      className={`px-5 py-2.5 rounded-[20px] text-sm font-semibold transition-all ${
                        startupActiveTab === tab
                          ? "text-[#4f55c7] shadow-sm"
                          : "bg-transparent text-gray-800 hover:bg-gray-100"
                      }`}
                      style={startupActiveTab === tab ? { background: '#E3E5FD' } : {}}
                    >
                      {tab}
                    </button>
                  ))}
              </div>
              <p className="text-md text-gray-900 font-medium">
                {user.beyincProfile === "Mentor" && viewMode === "mentors" && (
                  <>
                    {activeTab === "Expertise" &&
                      (expertiseFromMentorExpertise.length > 0
                        ? expertiseFromMentorExpertise.map((item, index) => (
                            <span key={index}>
                              {item}
                              {index <
                                expertiseFromMentorExpertise.length - 1 &&
                                " • "}
                            </span>
                          ))
                        : "N/A")}
                    {activeTab === "Industries" &&
                      (industriesFromMentorExpertise.length > 0
                        ? industriesFromMentorExpertise.map((item, index) => (
                            <span key={index}>
                              {item}
                              {index <
                                industriesFromMentorExpertise.length - 1 &&
                                " • "}
                            </span>
                          ))
                        : "N/A")}
                  </>
                )}
                {user.role === "Startup" &&
                  (viewMode === "startups" || viewMode === "all") && (
                    <>
                      {startupActiveTab === "Industries" &&
                        (industriesFromStartup.length > 0
                          ? industriesFromStartup.map((item, index) => (
                              <span key={index}>
                                {item}
                                {index < industriesFromStartup.length - 1 &&
                                  " • "}
                              </span>
                            ))
                          : "N/A")}
                      {startupActiveTab === "Stage" &&
                        (stageFromStartup || "N/A")}
                      {startupActiveTab === "Seeking" &&
                        (seekingFromStartup.length > 0
                          ? seekingFromStartup.map((item, index) => (
                              <span key={index}>
                                {item}
                                {index < seekingFromStartup.length - 1 && " • "}
                              </span>
                            ))
                          : "N/A")}
                    </>
                  )}
              </p>
            </div>
            {/* Socials & Reviews */}
            <div className="flex flex-wrap gap-4 items-center mt-4">
              <div className="flex gap-2">
                <FaLinkedin
                  size={16}
                  className="text-gray-400 hover:text-[#0077b5] transition-all hover:scale-125 cursor-pointer"
                />
                <FaTwitter
                  size={16}
                  className="text-gray-400 hover:text-[#1da1f2] transition-all hover:scale-125 cursor-pointer"
                />
                <FaGithub
                  size={16}
                  className="text-gray-400 hover:text-gray-700 transition-all hover:scale-125 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FaStar
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                  <span className="font-semibold text-gray-700">
                    {averagereview > 0 ? averagereview : "New"}
                  </span>
                </div>
                <span className="text-gray-600 text-xs">
                  {user.review?.length || 0} Reviews •{" "}
                  {session.length > 0 ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Right Action Section */}
          {/* <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-40 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
            {user.beyincProfile === "Mentor" && (
              <>
              <button
                onClick={() => setRequestPopup(true)}
                disabled={session.length === 0}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg transition-all hover:shadow-lg active:scale-95 ${
                  session.length === 0
                    ? "bg-[#4f55c7]/60 cursor-not-allowed"
                    : "bg-[#4f55c7] hover:bg-[#3e44a8]"
                }`}
              >
                Request a Call
              </button>
              <div>services offered:
              {session.length === 0 ? (
                <span className="text-sm text-gray-500"> No sessions available</span>
              ) : (
                <div className="flex flex-col gap-2 mt-2 max-h-40 overflow-y-auto">
                  {session.map((s) => (
                    <div
                      key={s._id}
                      className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {s.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {s.duration} minutes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#4f55c7]">
                          ₹{s.amount}
                        </p>
                      </div>
                    </div>
                  ))} 
              </div>
              </>




            )}
            </div>


            {user.role === "Startup" && (
              <RecommendedConnectButton
                id={user._id}
                viewMode={viewMode}
                handleFollower={() => {
                  setRecommendedUserTrigger(!recommendedUserTrigger);
                }}
              />
            )}
            {user.role === "Mentor" && (
              <div className="text-center text-xs text-gray-600">
                <p className="mb-1">
                  {session.length > 0 ? "Starts from" : "Session info"}
                </p>
                <p className="font-bold text-lg text-[#4f55c7]">
                  {session.length > 0
                    ? `₹ ${Math.min(...session.map((s) => s.amount))}`
                    : "Not Listed"}
                </p>
              </div>
            )}
          </div> */}
          <div className="relative flex-shrink-0 flex flex-col gap-3 w-full md:w-[280px] md:min-w-0 lg:w-[420px] lg:min-w-[360px] border-t md:border-t-0 md:border-l md:border-gray-300 pt-4 md:pt-0 md:pl-6">
            {IS_FEATURE_LOCKED && user.beyincProfile === "Mentor" && (
              <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center text-center p-4 border border-gray-100 select-none">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <FaClock className="text-gray-400" />
                </div>
                <h4 className="text-gray-900 font-bold text-sm">
                  Feature Coming Soon
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Booking sessions will be available shortly.
                </p>
              </div>
            )}
            <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-[280px] md:min-w-0 lg:w-[420px] lg:min-w-[360px] border-t md:border-t-0 pt-4 md:pt-0">
              {user.beyincProfile === "Mentor" && (
                <>
                  <button
                    onClick={() => setRequestPopup(true)}
                    disabled={session.length === 0}
                    className={`w-full px-4 py-2 text-white font-medium rounded-lg transition-all hover:shadow-lg active:scale-95 ${
                      session.length === 0
                        ? "bg-[#4f55c7]/60 cursor-not-allowed"
                        : "bg-[#4f55c7] hover:bg-[#3e44a8]"
                    }`}
                  >
                    Request a Call
                  </button>

                  <div className="text-center text-xs text-gray-600">
                    <p className="mb-1">
                      {session.length > 0 ? "Starts from" : "Session info"}
                    </p>

                    <p className="font-bold text-xs text-[#4f55c7]">
                      {session.length > 0
                        ? `₹ ${Math.min(...session.map((s) => s.amount))}`
                        : "Not Listed"}
                    </p>
                  </div>

                  <div>
                    {session.length === 0 ? (
                      <span className="align-middle text-sm font-medium text-gray-700 text-center w-full block">
                        {" "}
                        No sessions available
                      </span>
                    ) : (
                      <div>
                        <span className="align-middle text-sm font-medium text-gray-700 text-center w-full block">
                          Services Offered:
                        </span>
                        <div className="flex flex-col gap-2 mt-2 max-h-40 overflow-y-auto scrollbar-hide">
                          {session.map((s) => (
                            <div
                              key={s._id}
                              className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {s.title}
                                </p>

                                <p className="text-gray-500">
                                  {s.duration} minutes
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="font-bold text-[#4f55c7]">
                                  ₹{s.amount}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                
                </>
              )}

                {user.role === "Startup" && (
                   <div className="flex flex-col min-w-0 w-full">
                    <h4 className="text-xl font-bold text-gray-900 flex-shrink-0 mb-2 md:mt-0">About</h4>
                    <div className="max-h-40 md:max-h-48 overflow-y-auto overflow-x-hidden scrollbar-hide rounded-lg min-w-0">
                      <p className="text-sm text-gray-600 leading-relaxed break-words whitespace-normal pr-1">
                        {user.about || "No bio available."}
                      </p>
                    </div>
                  </div>
                  )}
            </div>

            {/* {user.beyincProfile === "Mentor" && (
              <div className="text-center text-xs text-gray-600">
                <p className="mb-1">
                  {session.length > 0 ? "Starts from" : "Session info"}
                </p>

                <p className="font-bold text-lg text-[#4f55c7]">
                  {session.length > 0
                    ? `₹ ${Math.min(...session.map((s) => s.amount))}`
                    : "Not Listed"}
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* --- MODAL (Purple Theme Applied) --- */}
      {requestPopup && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Request a Call
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Book a 1:1 session with {user.userName}
                </p>
              </div>
              <button
                onClick={() => setRequestPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Session Type Selection */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                  Select Session Duration
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 pl-4 pr-10 focus:ring-2 focus:ring-[#4f55c7]/20 focus:border-[#4f55c7] outline-none transition-all cursor-pointer font-medium"
                    value={selectedSessionId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedSessionId(id);
                      const sessionData = session.find((s) => s._id === id);
                      setSelectedSession(sessionData);
                    }}
                  >
                    <option value="">Choose a duration...</option>
                    {session.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.duration} minutes (₹{s.amount})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaChevronDown size={12} />
                  </div>
                </div>
              </div>

              {/* Selected Session Summary */}
              {selectedSession && (
                <div className="bg-[#4f55c7]/5 border border-[#4f55c7]/20 rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4f55c7] shadow-sm">
                      <FaClock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {selectedSession.duration} Minutes
                      </p>
                      <p className="text-xs text-gray-500">
                        Video Consultation
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#4f55c7]">
                      ₹{selectedSession.amount}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                      Total
                    </p>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block flex justify-between">
                  <span>Message</span>
                  <span className="text-gray-300 font-normal normal-case">
                    Optional
                  </span>
                </label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#4f55c7]/20 focus:border-[#4f55c7] outline-none resize-none text-sm transition-all placeholder:text-gray-400"
                  rows="4"
                  placeholder="Hi! I'd like to discuss my project regarding..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-2">
              <button
                className="w-full bg-[#4f55c7] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#4f55c7]/20 hover:bg-[#3e44a8] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex justify-center items-center gap-2"
                onClick={handleSendRequest}
                disabled={!selectedSessionId}
              >
                <span>Send Request</span>
                <span className="text-white/60">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleUserDetails;