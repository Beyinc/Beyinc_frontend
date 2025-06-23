import { useEffect, useRef, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import SearchFilter from "../Searching/SearchFilter";
import { io } from "socket.io-client";
import { socket_io } from "../../Utils";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";

export const Connections = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("followers");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [localFollowStates, setLocalFollowStates] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useRef();
  const { user_id } = useSelector((store) => store.auth.loginDetails);

  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const FollowersRes = await ApiServices.getFollowers({ user_id });
        const followingRes = await ApiServices.getFollowings({ user_id });

        setFollowers(FollowersRes.data || []);
        setFollowing(followingRes.data || []);
        setFilteredUsers(FollowersRes.data || []);
      } catch (e) {
        console.error("Error fetching connections:", e);
      }
    };

    if (user_id) fetchConnections();
  }, [user_id]);

  const FilteredSearchProfiles = ({ interests }) => {
    const baseData = activeTab === "followers" ? followers : following;
    if (!interests.length) {
      setFilteredUsers(baseData);
    } else {
      const filtered = baseData.filter((user) => interests.includes(user.role));
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    setFilteredUsers(activeTab === "followers" ? followers : following);
  }, [activeTab, followers, following]);

  const handleFollowToggle = async (e, userId, isFollowing) => {
    e.target.disabled = true;
    const button = e.target;
    button.textContent = isFollowing ? "Follow" : "Unfollow";

    try {
      let response;
      if (isFollowing) {
        response = await ApiServices.unfollowUser({
          unfollowReqBy: user_id,
          unfollowReqTo: userId,
        });
      } else {
        response = await ApiServices.saveFollowers({
          followerReqBy: user_id,
          followerReqTo: userId,
        });
        await socket.current.emit("sendNotification", {
          senderId: user_id,
          receiverId: userId,
        });
      }

      setLocalFollowStates((prev) => ({
        ...prev,
        [userId]: !isFollowing,
      }));
    } catch (err) {
      dispatch(
        setToast({
          message: "Error while updating follow status",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
      console.error("Follow error:", err);
    } finally {
      e.target.disabled = false;
    }
  };

  const renderUserCard = (user) => {
    const isFollowing =
      localFollowStates[user._id] ?? following.some((f) => f._id === user._id);

    return (
      <div
        key={user._id}
        className="bg-white hover:shadow-lg border border-gray-200 rounded-xl p-4 w-[180px] flex flex-col justify-center items-center"
      >
        <img
          src={user.image?.url ? user.image.url : "/profile.png"}
          onClick={() => navigate(`/user/${user._id}`)}
          className="cursor-pointer object-cover rounded-full h-[100px] w-[100px]"
          alt="profile"
        />
        <h3 className="mt-2 text-center text-sm font-medium">
          {user.userName}
        </h3>
        {user.role && (
          <h5 className="text-neutral-600 mt-1 text-xs">{user.role}</h5>
        )}
        {user.beyincProfile && (
          <h5 className="text-neutral-600 mt-1 text-xs">
            {user.beyincProfile} at Beyinc
          </h5>
        )}
        <p className="mt-2 mb-2 text-center text-xs">{user.headline}</p>

        {user_id !== user._id && (
          <button
            className="rounded-full px-4 py-1 bg-[rgb(79,85,199)] text-white text-sm"
            onClick={(e) => handleFollowToggle(e, user._id, isFollowing)}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      <SearchFilter FilteredSearchProfiles={FilteredSearchProfiles} />
      <div className="p-6 flex-1">
        <h2 className="text-xl font-semibold mb-4 ml-10">Your Connections</h2>

        <div className="flex space-x-4 mb-6 ml-10">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "followers"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers ({followers.length})
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "following"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following ({following.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => renderUserCard(user))
          ) : (
            <p>No {activeTab} found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
