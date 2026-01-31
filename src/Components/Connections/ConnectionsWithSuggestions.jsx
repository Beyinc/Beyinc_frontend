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

export default function ConnectionsWithSuggestions() {
  // ---------------- CONNECTIONS ----------------
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("followers");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [recommendedUserTrigger, setRecommendedUserTrigger] = useState(false);
  const [searchSuggestion, setSearchSuggestion] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useRef();

  const auth = useSelector((store) => store.auth || {});
  // derive userId from multiple possible shapes
  const userIdFromRoot = auth?.user_id;
  const userIdFromLoginDetails = auth?.loginDetails?.user_id;
  const userIdFromDetails = auth?.userDetails?._id;
  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();
  const user_id =
    userIdFromRoot ||
    userIdFromLoginDetails ||
    userIdFromDetails ||
    localUser?.user_id ||
    localUser?._id ||
    null;

  const userDetails = auth?.userDetails || localUser || {};
  const { role, userName, image, _id } = userDetails || {};

  // ---------------- SOCKET INIT ----------------
  useEffect(() => {
    // create socket once
    socket.current = io(socket_io);
    return () => {
      // cleanup when component unmounts
      try {
        socket.current?.disconnect();
      } catch {}
    };
  }, []);

  const getArrayFromResponse = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    // sometimes backend returns object directly like { followers: [...]}
    if (Array.isArray(res.followers)) return res.followers;
    if (Array.isArray(res.data?.followers)) return res.data.followers;
    return [];
  };

  // ---------------- FETCH CONNECTIONS ----------------
  useEffect(() => {
    // Runs whenever user_id changes. If user_id is falsy, we skip.
    const fetchConnections = async () => {
      if (!user_id) {
        console.log("fetchConnections skipped - user_id not available yet");
        return;
      }

      console.log("fetchConnections called for user:", user_id);
      try {
        const FollowersRes = await ApiServices.getFollowers({ user_id });
        const followingRes = await ApiServices.getFollowings({ user_id });

        const followersArr = getArrayFromResponse(FollowersRes);
        const followingArr = getArrayFromResponse(followingRes);

        const modFollowers = followersArr.map((u) => ({
          ...u,
          // be safe: ensure u.followers is an array
          isFollowing: Array.isArray(u.followers)
            ? u.followers.includes(user_id)
            : false,
        }));

        const modFollowing = followingArr.map((u) => ({
          ...u,
          isFollowing: Array.isArray(u.followers)
            ? u.followers.includes(user_id)
            : false,
        }));

        setFollowers(modFollowers);
        setFollowing(modFollowing);
        setFilteredUsers(modFollowers);

        // useful debug logs (remove in production)
        console.log("modFollowers", modFollowers);
        console.log("modFollowing", modFollowing);
      } catch (e) {
        console.error("Error fetching connections:", e);
        dispatch(
          setToast({
            message: "Failed to load connections",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      }
    };

    fetchConnections();
  }, [user_id]); // re-run when user_id becomes available

  useEffect(() => {
    const base = activeTab === "followers" ? followers : following;
    let filtered = base;

    // Optional: handle role-based filter later if you use SearchFilter interests
    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter((u) =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [followers, following, activeTab, searchTerm]);

  const handleFollowToggle = async (e, userId, isFollowing) => {
    // optimistic update
    if (activeTab === "following") {
      setFilteredUsers((prev) => prev.filter((u) => u._id !== userId));
    } else {
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isFollowing: !u.isFollowing } : u
        )
      );
    }

    try {
      if (isFollowing) {
        await ApiServices.unfollowUser({
          unfollowReqBy: user_id,
          unfollowReqTo: userId,
        });
      } else {
        await ApiServices.saveFollowers({
          followerReqBy: user_id,
          followerReqTo: userId,
        });
        await socket.current.emit("sendNotification", {
          senderId: user_id,
          receiverId: userId,
        });
      }
    } catch (err) {
      console.error("Follow error:", err);
      dispatch(
        setToast({
          message: "Error while updating follow status",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    }
  };

  // ---------------- FETCH SUGGESTIONS ----------------
  useEffect(() => {
    if (!user_id) {
      console.log("getNewProfiles skipped - user_id not ready");
      return;
    }

    ApiServices.getNewProfiles({ userId: user_id })
      .then((res) => {
        const arr = getArrayFromResponse(res);
        setRecommendedUsers(arr);
        setFilteredSuggestions(arr);
      })
      .catch((err) => {
        console.error("getNewProfiles error", err);
        dispatch(
          setToast({
            message: "Error Occurred!",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedUserTrigger, user_id]);

  useEffect(() => {
    let filtered = recommendedUsers || [];

    if (searchSuggestion && searchSuggestion.trim()) {
      filtered = filtered.filter((u) =>
        u.userName?.toLowerCase().includes(searchSuggestion.toLowerCase())
      );
    }

    setFilteredSuggestions(filtered);
  }, [recommendedUsers, searchSuggestion]);
  // ---------------- USER CARD ----------------
  const renderUserCard = (user) => (
    <div
      key={user._id}
      style={{ border: "1px solid gainsboro" }}
      className="bg-white hover:shadow-lg border rounded-xl p-4 w-[190px] flex flex-col justify-center items-center"
    >
      {user?.image?.url ? (
                      <img
                        src={user.image.url}
                        onClick={() =>
                          user._id === user_id
                            ? navigate("/editProfile")
                            : navigate(`/user/${user._id}`)
                        }
                        className="cursor-pointer object-cover rounded-full h-[100px] w-[100px]"
                        alt="profile"
                      />
                    ) : (
                      <div className="cursor-pointer rounded-full h-[100px] w-[100px] bg-[#4E54C6] flex items-center justify-center text-white font-medium text-5xl" onClick={() =>
                        user._id === user_id
                          ? navigate("/editProfile")
                          : navigate(`/user/${user._id}`)
                      }>
                        {user?.userName && user.userName.length > 0 ? user.userName.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}
      <h3 className="mt-2 text-center text-sm font-medium">{user.userName}</h3>
      {user.role && (
        <h5 className="text-neutral-600 mt-1 text-xs">{user.role}</h5>
      )}
      <p className="mt-2 mb-2 text-center text-xs">{user.headline}</p>
      <div className="flex gap-4">
        {user_id !== user._id && (
          <button
            className="rounded-full px-4 py-1 bg-[rgb(79,85,199)] text-white text-sm"
            onClick={(e) => handleFollowToggle(e, user._id, user.isFollowing)}
          >
            {user.isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
        {user_id !== user._id && user.isFollowing && (
          // <button
          //   className="rounded-full px-4 py-1 w-[100px] h-[30px] text-sm 
          //    text-[rgb(79,85,199)]  bg-white border-black"
          //   onClick={() => setReceiverId(user._id)}
          // >
          //   Chat
          // </button>

          <button
 className="!rounded-full !px-4 !py-1 !w-[100px] !h-[30px] !text-[rgb(79,85,199)] !border-2 !border-[rgb(79,85,199)] !bg-white border-solid shadow-lg"

  onClick={() => setReceiverId(user._id)}
>
  Chat
</button>

        )}
      </div>
    </div>
  );

  // keep filteredUsers in-sync when followers/following or active tab change
  useEffect(() => {
    setFilteredUsers(activeTab === "followers" ? followers : following);
  }, [activeTab, followers, following]);

  // ---------------- RETURN ----------------
  return (
    <div className="flex flex-col items-center gap-12 p-6 w-full">
      {/* CONNECTIONS SECTION */}
      <div className="flex flex-col w-full max-w-[1550px]">
        <div className="flex gap-6 px-4">
          {/* LEFT FILTER */}
          <div className="w-full max-w-sm flex flex-col gap-4">
            <input
              type="text"
              placeholder="Search Connections"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-80 ml-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // FilteredSearchProfiles({ interests: [] });
              }}
            />
            {/* <SearchFilter FilteredSearchProfiles={FilteredSearchProfiles} /> */}
            <SearchFilter
              FilteredSearchProfiles={({ interests }) => {
                const base = activeTab === "followers" ? followers : following;
                let filtered = base;

                if (interests && interests.length) {
                  filtered = filtered.filter((u) => interests.includes(u.role));
                }

                if (searchTerm && searchTerm.trim()) {
                  filtered = filtered.filter((u) =>
                    u.userName?.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                }

                setFilteredUsers(filtered);
              }}
            />
          </div>

          {/* SCROLLABLE CONNECTIONS */}
          <div
            className="flex-1 bg-white p-8 rounded-lg h-[330px] overflow-hidden flex flex-col"
            style={{
              border: "1px solid lightgray",
            }}
          >
            <h2 className="text-xl font-semibold mb-4 ml-10 sticky top-0 bg-white z-10">
              Your Connections
            </h2>

            <div className="flex gap-4 ml-10 mb-4 sticky top-[48px] bg-white z-10">
              <button
                className={`px-4 py-2 rounded-full ${
                  activeTab === "followers"
                    ? "bg-custom text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("followers")}
              >
                Followers ({followers.length})
              </button>

              <button
                className={`px-4 py-2 rounded-full ${
                  activeTab === "following"
                    ? "bg-custom text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("following")}
              >
                Following ({following.length})
              </button>
            </div>

            {filteredUsers.length > 0 ? (
              <div
                className="
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      gap-6 overflow-y-auto pr-2 flex-1 hide-scrollbar overflow-x-hidden
    "
              >
                {filteredUsers.map((user) => renderUserCard(user))}
              </div>
            ) : (
              <p>No {activeTab} found.</p>
            )}
          </div>
        </div>

        <AddConversationPopup
          receiverId={receiverId}
          setReceiverId={setReceiverId}
          isNavigate={true}
        />
      </div>

      {/* SUGGESTIONS SECTION */}
      <div className="flex flex-col w-full max-w-[1550px]">
        <div className="flex gap-6 px-4">
          {/* LEFT FILTER */}
          <div className="w-full max-w-sm flex flex-col gap-4">
            <input
              type="text"
              placeholder="Search Suggestions"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-80 ml-10"
              value={searchSuggestion}
              onChange={(e) => {
                setSearchSuggestion(e.target.value);
                // FilteredSuggestionProfiles({ interests: [] });
              }}
            />
            <SearchFilter
              FilteredSearchProfiles={({ interests }) => {
                let filtered = recommendedUsers || [];

                if (interests && interests.length) {
                  filtered = filtered.filter((u) => interests.includes(u.role));
                }

                if (searchSuggestion && searchSuggestion.trim()) {
                  filtered = filtered.filter((u) =>
                    u.userName
                      ?.toLowerCase()
                      .includes(searchSuggestion.toLowerCase())
                  );
                }

                setFilteredSuggestions(filtered);
              }}
            />
          </div>

          {/* SCROLLABLE SUGGESTIONS */}
          <div
            className="flex-1 bg-white p-8 rounded-lg overflow-hidden flex flex-col"
            style={{
              border: "1px solid lightgray",
              maxHeight: "330px",
            }}
          >
            {/* FIXED HEADING */}
            <h2 className="text-xl font-semibold mb-4 ml-10 sticky top-0 bg-white z-10">
              Suggestions for You
            </h2>

            {/* SCROLLABLE CARDS */}
            {filteredSuggestions.length > 0 ? (
              <div
                className="
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
      gap-6 overflow-y-auto overflow-x-hidden pr-2 flex-1
    "
              >
                {filteredSuggestions.map((rec) => (
                  <div
                    key={rec._id}
                    style={{ border: "1px solid gainsboro" }}
                    className="bg-white hover:shadow-lg border rounded-xl p-4 w-[190px] flex flex-col justify-center items-center"
                  >
                    {rec?.image?.url ? (
                      <img
                        src={rec.image.url}
                        onClick={() =>
                          rec._id === user_id
                            ? navigate("/editProfile")
                            : navigate(`/user/${rec._id}`)
                        }
                        className="cursor-pointer object-cover rounded-full h-[100px] w-[100px]"
                        alt="profile"
                      />
                    ) : (
                      <div className="cursor-pointer rounded-full h-[100px] w-[100px] bg-[#4E54C6] flex items-center justify-center text-white font-medium text-5xl" onClick={() =>
                        rec._id === user_id
                          ? navigate("/editProfile")
                          : navigate(`/user/${rec._id}`)
                      }>
                        {rec?.userName && rec.userName.length > 0 ? rec.userName.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}

                    <h3 className="mt-2 text-center text-sm font-medium">
                      {rec?.userName}
                    </h3>

                    {rec.role && (
                      <h5 className="text-neutral-600 mt-1 text-xs">
                        {rec.role}
                      </h5>
                    )}

                    <p className="mt-2 mb-2 text-center text-xs">
                      {rec.headline}
                    </p>

                    <div className="flex gap-1">
                      <button
                        className="rounded-full px-4 py-1 bg-[rgb(79,85,199)] text-white text-sm w-[100px] h-[30px]"
                        onClick={(e) =>
                          followerController({
                            dispatch,
                            e,
                            followingToId: rec._id,
                            recommendedUserTrigger,
                            setRecommendedUserTrigger,
                            socket,
                            user: { id: user_id, userName, image, role },
                          })
                        }
                      >
                        Follow
                      </button>

                      <RecommendedConnectButton
                        id={rec._id}
                        handleFollower={() =>
                          setRecommendedUserTrigger(!recommendedUserTrigger)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No suggestions available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
