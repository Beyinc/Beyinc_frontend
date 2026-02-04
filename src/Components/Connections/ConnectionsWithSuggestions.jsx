import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { useNavigate } from "react-router-dom";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { io } from "socket.io-client";
import { socket_io, followerController } from "../../Utils";
import SearchFilter from "../Searching/SearchFilter";
import RecommendedConnectButton from "../Posts/RecommendedConnectButton";
import AddConversationPopup from "../Common/AddConversationPopup";
import "./ConnectionsWithSuggestions.css";

// ---------------- HELPER COMPONENTS (Moved Outside) ----------------

const UserAvatar = ({ user, onClick, size = "h-20 w-20 sm:h-24 sm:w-24" }) => {
  const imageUrl = user?.image?.url;
  const firstLetter = user?.userName?.[0]?.toUpperCase() || "?";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        onClick={onClick}
        className={`cursor-pointer object-cover rounded-full ${size}`}
        alt="profile"
      />
    );
  }

  // Display first letter avatar when no image
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-full ${size} bg-[rgb(79,85,199)] flex items-center justify-center text-white font-medium text-4xl sm:text-5xl`}
    >
      {firstLetter}
    </div>
  );
};

/** Left sidebar: only the role/interest filter (no search input) */
const FilterOnly = ({ onFilterApply }) => (
  <div className="connections-filter-wrapper">
    <SearchFilter FilteredSearchProfiles={onFilterApply} />
  </div>
);

const MobileFilterSidebar = ({ isOpen, onClose, onFilterApply, title }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col p-4 lg:hidden overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            ✕
          </button>
        </div>
        <FilterOnly onFilterApply={onFilterApply} />
      </div>
    </>
  );
};

// ---------------- MAIN COMPONENT ----------------

export default function ConnectionsWithSuggestions() {
  // Connections State
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("followers");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  
  // Search & Filter State (Connections)
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionInterests, setConnectionInterests] = useState([]); // FIX ADDED

  // Suggestions State
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [recommendedUserTrigger, setRecommendedUserTrigger] = useState(false);
  
  // Search & Filter State (Suggestions)
  const [searchSuggestion, setSearchSuggestion] = useState("");
  const [suggestionInterests, setSuggestionInterests] = useState([]); // FIX ADDED

  // Sidebar Toggles
  const [isConnectionsFilterOpen, setIsConnectionsFilterOpen] = useState(false);
  const [isSuggestionsFilterOpen, setIsSuggestionsFilterOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useRef();

  const auth = useSelector((store) => store.auth || {});
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const user_id = auth?.user_id || auth?.loginDetails?.user_id || localUser?._id;
  const { role, userName, image } = auth?.userDetails || localUser || {};

  // ---------------- SOCKET ----------------
  useEffect(() => {
    socket.current = io(socket_io);
    return () => socket.current?.disconnect();
  }, []);

  const getArray = (res) => {
    return Array.isArray(res) ? res : res?.data?.data || res?.data || res?.followers || [];
  };

  // ---------------- FETCH CONNECTIONS ----------------
  useEffect(() => {
    if (!user_id) return;
    const fetchConnections = async () => {
      try {
        const [followersRes, followingRes] = await Promise.all([
          ApiServices.getFollowers({ user_id }),
          ApiServices.getFollowings({ user_id })
        ]);

        const followersArr = getArray(followersRes);
        const mapUser = (u) => ({
          ...u,
          isFollowing: Array.isArray(u.followers) ? u.followers.includes(user_id) : false,
        });

        setFollowers(followersArr.map(mapUser));
        setFollowing(getArray(followingRes).map(mapUser));
      } catch (e) {
        dispatch(setToast({ message: "Failed to load connections", bgColor: ToastColors.failure, visible: "yes" }));
      }
    };
    fetchConnections();
  }, [user_id, dispatch]);

  // ---------------- FILTER LOGIC: CONNECTIONS ----------------
  // This combines Search Text AND Checkbox Filters
  useEffect(() => {
    const base = activeTab === "followers" ? followers : following;
    
    const result = base.filter((u) => {
      // 1. Check Search Term
      const matchesSearch = !searchTerm.trim() || u.userName?.toLowerCase().includes(searchTerm.toLowerCase());
      // 2. Check Roles
      const matchesRole = connectionInterests.length === 0 || connectionInterests.includes(u.role);
      
      return matchesSearch && matchesRole;
    });

    setFilteredUsers(result);
  }, [followers, following, activeTab, searchTerm, connectionInterests]);

  // ---------------- FOLLOW TOGGLE ----------------
  const handleFollowToggle = async (e, userId, isFollowing) => {
    // Optimistic Update
    const updateList = (list) => list.map(u => u._id === userId ? { ...u, isFollowing: !u.isFollowing } : u);
    
    if (activeTab === "following") {
      setFollowing(prev => prev.filter(u => u._id !== userId)); // Remove from list immediately
    } else {
      setFollowers(prev => updateList(prev));
      setFollowing(prev => updateList(prev)); // Update following state too if they exist there
    }

    try {
      if (isFollowing) {
        await ApiServices.unfollowUser({ unfollowReqBy: user_id, unfollowReqTo: userId });
      } else {
        await ApiServices.saveFollowers({ followerReqBy: user_id, followerReqTo: userId });
        socket.current.emit("sendNotification", { senderId: user_id, receiverId: userId });
      }
    } catch (err) {
      dispatch(setToast({ message: "Error updating follow", bgColor: ToastColors.failure, visible: "yes" }));
    }
  };

  // ---------------- FETCH SUGGESTIONS ----------------
  useEffect(() => {
    if (!user_id) return;
    ApiServices.getNewProfiles({ userId: user_id })
      .then((res) => {
        setRecommendedUsers(getArray(res));
      })
      .catch(() => {});
  }, [recommendedUserTrigger, user_id]);

  // ---------------- FILTER LOGIC: SUGGESTIONS ----------------
  useEffect(() => {
    const result = (recommendedUsers || []).filter((u) => {
      const matchesSearch = !searchSuggestion.trim() || u.userName?.toLowerCase().includes(searchSuggestion.toLowerCase());
      const matchesRole = suggestionInterests.length === 0 || suggestionInterests.includes(u.role);
      return matchesSearch && matchesRole;
    });
    setFilteredSuggestions(result);
  }, [recommendedUsers, searchSuggestion, suggestionInterests]);

  // ---------------- RENDER CARD ----------------
  const renderUserCard = (user, isSuggestion = false) => (
    <div key={user._id} className="bg-white hover:shadow-lg border border-gray-200 rounded-xl p-4 w-full max-w-[190px] mx-auto flex flex-col justify-center items-center">
      <UserAvatar
        user={user}
        onClick={() => navigate(user._id === user_id ? "/editProfile" : `/user/${user._id}`)}
        size="h-20 w-20 sm:h-24 sm:w-24"
      />
      <h3 className="mt-2 flex items-center justify-center gap-1 text-sm font-medium w-full">
        <span className="truncate max-w-[140px]">{user.userName}</span>
        {user.verified && (
          <svg
            className="w-4 h-4 text-green-600 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23 12l-2.44-2.79.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.79-.34 3.68 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5l-4-4 1.41-1.41L13 14.17l7.59-7.59L22 8l-9 9z" />
          </svg>
        )}
      </h3>
      <h5 className="text-neutral-600 mt-1 text-xs line-clamp-1">{user.role}</h5>
      <p className="mt-2 mb-2 text-center text-xs line-clamp-2">{user.headline}</p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {/* Buttons logic */}
        {isSuggestion ? (
          <>
             <button
                className="rounded-full px-3 py-1 bg-[rgb(79,85,199)] text-white text-xs sm:text-sm"
                onClick={(e) => followerController({
                  dispatch, e, followingToId: user._id, 
                  recommendedUserTrigger, setRecommendedUserTrigger, socket, 
                  user: { id: user_id, userName, image, role }
                })}
              >
                Follow
              </button>
              <RecommendedConnectButton id={user._id} handleFollower={() => setRecommendedUserTrigger(!recommendedUserTrigger)} />
          </>
        ) : (
          user_id !== user._id && (
            <>
              <button
                className="rounded-full px-3 py-1 bg-[rgb(79,85,199)] text-white text-xs sm:text-sm"
                onClick={(e) => handleFollowToggle(e, user._id, user.isFollowing)}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
              {user.isFollowing && (
                <button
                  className="rounded-full px-3 py-1 text-xs sm:text-sm text-[rgb(79,85,199)] border border-[rgb(79,85,199)] bg-white shadow-sm"
                  onClick={() => setReceiverId(user._id)}
                >
                  Chat
                </button>
              )}
            </>
          )
        )}
      </div>
    </div>
  );

  // ---------------- JSX ----------------
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-12 p-3 sm:p-6 w-full">
      
      {/* --- Mobile Sidebars --- */}
      <MobileFilterSidebar
        isOpen={isConnectionsFilterOpen}
        onClose={() => setIsConnectionsFilterOpen(false)}
        onFilterApply={({ interests }) => setConnectionInterests(interests)}
        title="Filter Connections"
      />
      
      <MobileFilterSidebar
        isOpen={isSuggestionsFilterOpen}
        onClose={() => setIsSuggestionsFilterOpen(false)}
        onFilterApply={({ interests }) => setSuggestionInterests(interests)}
        title="Filter Suggestions"
      />

      {/* --- CONNECTIONS SECTION --- */}
      <div className="flex flex-col w-full max-w-[1550px]">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 lg:items-start">
          {/* Desktop Filter (left) - filter only */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterOnly onFilterApply={({ interests }) => setConnectionInterests(interests)} />
          </div>

          {/* List Area (right) - search inside card */}
          <div className="flex-1 min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-300 max-h-[450px] lg:max-h-[600px] overflow-hidden flex flex-col">
            <div className="flex flex-col gap-2 mb-2 sm:mb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg sm:text-xl font-semibold">Your Connections</h2>
                <button className="lg:hidden p-1.5 flex items-center justify-center bg-transparent hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-0 rounded-md flex-shrink-0" onClick={() => setIsConnectionsFilterOpen(true)} aria-label="Filter">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search Connections"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full sm:max-w-[14rem]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-4 sticky top-[48px] bg-white z-10">
              {['followers', 'following'].map(tab => (
                <button
                  key={tab}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm capitalize ${activeTab === tab ? "bg-custom text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab} ({tab === 'followers' ? followers.length : following.length})
                </button>
              ))}
            </div>

            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-y-auto pr-2 pb-2">
                {filteredUsers.map((u) => renderUserCard(u, false))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-10">No users found.</p>
            )}
          </div>
        </div>
      </div>

      {/* --- SUGGESTIONS SECTION --- */}
      <div className="flex flex-col w-full max-w-[1550px]">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 lg:items-start">
          {/* Desktop Filter (left) - filter only */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterOnly onFilterApply={({ interests }) => setSuggestionInterests(interests)} />
          </div>

          {/* List Area (right) - search inside card */}
          <div className="flex-1 min-w-0 bg-white p-4 sm:p-6 rounded-lg border border-gray-300 max-h-[450px] lg:max-h-[600px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between w-full mb-2 sm:mb-4 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-semibold">Suggestions for You</h2>
              <button className="lg:hidden p-1.5 flex items-center justify-center bg-transparent hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-0 rounded-md flex-shrink-0" onClick={() => setIsSuggestionsFilterOpen(true)} aria-label="Filter">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              </button>
            </div>

            {filteredSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-y-auto pr-2 pb-2">
                {filteredSuggestions.map((u) => renderUserCard(u, true))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-10">No suggestions available.</p>
            )}
          </div>
        </div>
      </div>

      <AddConversationPopup receiverId={receiverId} setReceiverId={setReceiverId} isNavigate={true} />
    </div>
  );
}