import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setReceiverId } from "../../redux/Conversationreducer/ConversationReducer";
import { CalendarServices } from "../../Services/CalendarServices";
import SessionSelector from "../AllUsers/SessionSelector";
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
  const [sessionTitle, setSessionTitle] = useState("");
  // useEffect(() => {
  //   console.log("mentor data coming", user);
  // });
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
        console.log("Availability sessions:", data.availability.sessions);
        setSession(data.availability.sessions);
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
      title: sessionTitle,
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
        <div className="flex flex-col md:flex-row gap-6">
          {/* 1. Image Section */}
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

          {/* 2. Middle Content Section */}
          <div className="flex-1">
            {/* Header: Name & Verify */}
            <div className="flex items-center justify-start mb-2">
              <h3
                className="text-xl font-bold text-gray-900 cursor-pointer hover:text-[#4f55c7] transition-colors"
                onClick={openUser}
              >
                {user?.role === "Startup"
                  ? user?.startupProfile?.startupName ?? "Unnamed Startup"
                  : user?.userName ?? "Unknown User"}
              </h3>
              {user?.role === "Startup" &&
                user?.startupProfile?.targetMarket && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {user.startupProfile.targetMarket}
                  </span>
                )}
              <span className="text-[#4f55c7]">
                <img className="w-5 h-5" src="/verify.png" alt="Verified" />
              </span>
            </div>

            {/* Role */}
            <p className="text-sm font-medium text-[#4f55c7] mb-1">
              {user.role || "Individual/Entrepreneur"}
            </p>

            {/* Headline */}

            {user?.headline && (
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {user.headline}
              </p>
            )}

            {/* Bio */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
              {user.about || "No bio available."}
            </p>

            {/* Tabs - Conditional based on viewMode */}
            <div className="mb-3">
              <div className="flex gap-2 mb-6 p-1 shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-gray-100 rounded-full w-fit border border-gray-400">
                {user.role === "Mentor" &&
                  viewMode === "mentors" &&
                  ["Expertise", "Industries"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all hover:text-white ${
                        activeTab === tab
                          ? "bg-white text-[#4f55c7] shadow-sm"
                          : "bg-transparent text-black "
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                {user.role === "Startup" &&
                  viewMode === "startups" &&
                  ["Industries", "Stage", "Seeking"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all hover:text-white ${
                        activeTab === tab
                          ? "bg-white text-[#4f55c7] shadow-sm"
                          : "bg-transparent text-black "
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
              </div>
              <p className="text-md text-gray-900 font-medium">
                {user.role === "Mentor" && viewMode === "mentors" && (
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
                      {activeTab === "Industries" &&
                        (industriesFromStartup.length > 0
                          ? industriesFromStartup.map((item, index) => (
                              <span key={index}>
                                {item}
                                {index < industriesFromStartup.length - 1 &&
                                  " • "}
                              </span>
                            ))
                          : "N/A")}
                      {activeTab === "Stage" && (stageFromStartup || "N/A")}
                      {activeTab === "Seeking" &&
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
          <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-40 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">

  {(user.role === "Mentor" || user.beyincProfile === "Mentor") && (
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
  )}

  {user.role === "Startup" && (
    <RecommendedConnectButton
      id={user._id}
      viewMode={viewMode}
      handleFollower={() => {
        setRecommendedUserTrigger(!recommendedUserTrigger);
      }}
    />
  )}

  {(user.role === "Mentor" || user.beyincProfile === "Mentor") && (
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
<SessionSelector
  session={session}
  selectedSessionId={selectedSessionId}
  setSelectedSessionId={setSelectedSessionId}
  setSelectedSession={setSelectedSession}
  setSessionTitle={setSessionTitle}
/>


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
