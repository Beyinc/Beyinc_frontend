import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// Keeping Redux imports logic intact
import { setReceiverId } from "../../redux/Conversationreducer/ConversationReducer"; 
import { FaLinkedin, FaTwitter, FaGithub, FaStar } from "react-icons/fa";
import RequestCallModal from "./RequestCallModal";

const SingleUserDetails = ({ user, connectStatus }) => {
  const { user_id } = useSelector((state) => state.auth.loginDetails);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openUser = () => {
    if (user_id === user._id) {
      navigate(`/editProfile`);
    } else {
      navigate(`/user/${user._id}`);
    }
  };

  // Calculate average rating
  const avgRating =
    user.review?.length > 0
      ? (
          user.review.reduce((acc, curr) => acc + curr.review, 0) /
          user.review.length
        ).toFixed(1)
      : "New";

  return (
    <>
      {/* Main Card Container */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:border-[#4f55c7]/30 hover:-translate-y-1 mb-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Image Section */}
          <div className="flex-shrink-0 group cursor-pointer" onClick={openUser}>
            <div className="relative">
                <img
                src={user.image?.url || "/profile.png"}
                alt={user.userName}
                className="w-24 h-24 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105 border border-gray-100 shadow-sm"
                />
            </div>
          </div>

          {/* Middle Content Section */}
          <div className="flex-1">
            {/* Header: Name & Verification */}
            <div className="flex items-center gap-2 mb-1">
              <h3 
                className="text-xl font-bold text-gray-900 cursor-pointer hover:text-[#4f55c7] transition-colors" 
                onClick={openUser}
              >
                {user.userName}
              </h3>
              {user.verification === "approved" && (
                <span className="text-[#4f55c7]" title="Verified">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </span>
              )}
            </div>

            {/* Role & Experience */}
            <p className="text-sm font-medium text-[#4f55c7] mb-1">{user.role || "Mentor"}</p>
            <p className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-2">
              <span>English, French</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>5 years exp</span>
            </p>

            {/* Headline */}
            <p className="text-sm font-semibold text-gray-800 mb-2">
              {user.headline || "Full Stack Developer at Freelance | Freelancing mentor"}
            </p>

            {/* Bio */}
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
              {user.about || user.bio || "Passionate about creating user-centric designs for web and mobile applications."}
            </p>

            {/* Footer: Socials & Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-3 mt-auto">
                {/* Social Icons */}
                <div className="flex gap-3">
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-all hover:scale-110">
                        <FaLinkedin size={18} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1da1f2] transition-all hover:scale-110">
                        <FaTwitter size={18} />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 transition-all hover:scale-110">
                        <FaGithub size={18} />
                    </a>
                </div>

                {/* Ratings & Sessions */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                        <FaStar className="text-yellow-400" size={14} />
                        <span className="font-bold text-gray-700 text-xs">{avgRating}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                        {user.review?.length || 0} Reviews • {user.sessions || 47} Sessions
                    </span>
                </div>
            </div>
          </div>

          {/* Right Action Section */}
          <div className="flex-shrink-0 flex flex-col justify-center gap-3 w-full md:w-48 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
            <div className="text-center">
                <p className="text-2xl font-bold text-[#4f55c7]">₹ 299</p>
                <p className="text-xs text-gray-400 mt-1">per 45 min session</p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-3 bg-[#4f55c7] text-white font-semibold rounded-xl hover:bg-[#3e44a8] transition-all shadow-md shadow-[#4f55c7]/20 active:scale-95 flex items-center justify-center gap-2"
            >
              Request Call
            </button>
          </div>

        </div>
      </div>

      {/* Modal */}
      <RequestCallModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        user={user}
      />
    </>
  );
};

export default SingleUserDetails;