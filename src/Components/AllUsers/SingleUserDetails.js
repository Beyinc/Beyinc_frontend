import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setReceiverId } from "../../redux/Conversationreducer/ConversationReducer";
import { CalendarServices } from "../../Services/CalendarServices";
import { FaLinkedin, FaTwitter, FaGithub, FaStar, FaGlobe, FaTimes, FaChevronDown, FaClock, FaTags } from "react-icons/fa";

const SingleUserDetails = ({ user, connectStatus }) => {
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

  // --- Effects ---
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        const { data } = await CalendarServices.getAvailabilityData({
          mentorId: user._id,
        });
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

  return (
    <>
      {/* --- Main Card Container --- */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:border-[#4f55c7]/30 hover:-translate-y-1 mb-6 relative overflow-hidden flex flex-col h-full min-h-[280px]">
        
        <div className="flex flex-col xl:flex-row gap-6 h-full flex-grow">
          
          {/* 1. Image Section */}
          <div className="flex-shrink-0 group cursor-pointer" onClick={openUser}>
            <div className="relative">
              <img
                src={
                  user.image?.url && user.image.url !== ""
                    ? user.image.url
                    : "/profile.png"
                }
                alt={user.userName}
                className="w-24 h-24 xl:w-32 xl:h-32 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105 border border-gray-100 shadow-sm"
              />
            </div>
          </div>

          {/* 2. Middle Content Section */}
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-xl font-bold text-gray-900 cursor-pointer hover:text-[#4f55c7] transition-colors"
                  onClick={openUser}
                >
                  {user.userName}
                </h3>
                <img className="w-5 h-5" src="/verify.png" alt="Verified" />
              </div>

              {/* Role */}
              <div className="mb-2">
                <span className="text-sm font-medium text-[#4f55c7]">
                  {user.role || "Individual/Entrepreneur"}
                </span>
              </div>

              {/* Headline */}
              <p className="text-sm font-bold text-gray-800 mb-2">
                {user.headline || "No headline available"}
              </p>

              {/* Bio */}
              <p className="text-sm text-gray-500 mb-4 leading-relaxed min-h-[3rem]">
                 {user.about ? (user.about.length > 150 ? user.about.slice(0, 150) + "..." : user.about) : "No bio available"}
              </p>

              {/* Tabs Section */}
              <div className="mb-2">
                  <div className="flex gap-3 mb-2">
                      {["Expertise", "Industries"].map((tab) => (
                          <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                                  activeTab === tab 
                                  ? "!bg-[#4f55c7] !text-white border-[#4f55c7]" 
                                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                              }`}
                          >
                              {tab}
                          </button>
                      ))}
                  </div>
                  
                  {/* Tab Content */}
                  <div className="text-xs text-gray-600 min-h-[24px]">
                      {activeTab === "Expertise" && (user.expertise?.length > 0 ? user.expertise.join(", ") : "No expertise listed")}
                      {activeTab === "Industries" && (user.industries?.length > 0 ? user.industries.join(", ") : "No industries listed")}
                  </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-3 mt-2">
              <div className="flex gap-3">
                <FaLinkedin size={18} className="text-gray-300 hover:text-[#0077b5] cursor-pointer" />
                <FaTwitter size={18} className="text-gray-300 hover:text-[#1da1f2] cursor-pointer" />
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                  <FaStar className="text-yellow-400" size={14} />
                  <span className="font-bold text-gray-700 text-xs">
                    {averagereview > 0 ? averagereview : "New"}
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {user.review?.length || 0} Reviews • {session.length > 0 ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Right Action Section */}
          <div className="flex-shrink-0 flex flex-col justify-between w-full xl:w-48 xl:border-l border-gray-100 xl:pl-6 pt-4 xl:pt-0 min-h-[200px]">
            <div className="text-center xl:text-center mt-2">
              <p className="text-2xl font-bold text-[#4f55c7]">
                {session.length > 0 
                  ? `₹${Math.min(...session.map(s => s.amount))}` 
                  : "₹0"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                starting price
              </p>
            </div>

            <div className="mb-2">
              <button
                onClick={() => setRequestPopup(true)}
                disabled={session.length === 0}
                className={`w-full px-4 py-3 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                    session.length === 0 
                    ? "bg-[#4f55c7]/60 cursor-not-allowed" 
                    : "bg-[#4f55c7] hover:bg-[#3e44a8] shadow-[#4f55c7]/20 active:scale-95"
                }`}
              >
                Request Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- REDESIGNED MODAL --- */}
      {requestPopup && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Request a Call</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Book a 1:1 session with {user.userName}</p>
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
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <FaChevronDown size={12} />
                    </div>
                  </div>
                </div>

                {/* Selected Session Summary (Only shows if session selected) */}
                {selectedSession && (
                    <div className="bg-[#4f55c7]/5 border border-[#4f55c7]/20 rounded-xl p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4f55c7] shadow-sm">
                                <FaClock size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{selectedSession.duration} Minutes</p>
                                <p className="text-xs text-gray-500">Video Consultation</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-lg font-bold text-[#4f55c7]">₹{selectedSession.amount}</p>
                             <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total</p>
                        </div>
                    </div>
                )}

                {/* Message Input */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block flex justify-between">
                    <span>Message</span>
                    <span className="text-gray-300 font-normal normal-case">Optional</span>
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