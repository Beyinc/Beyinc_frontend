import { useEffect, useId, useRef, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import SearchFilter from "../Searching/SearchFilter";
import { io } from "socket.io-client";
import { socket_io } from "../../Utils";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import AddConversationPopup from "../Common/AddConversationPopup";

export const Connections = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("followers");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

        const modifiedFollowers = Array.isArray(FollowersRes.data)
          ? FollowersRes.data.map((u) => ({
              ...u,
              isFollowing: u.followers.includes(user_id),
            }))
          : [];
        console.log({ modifiedFollowers });
        const modifiedFollowings = Array.isArray(followingRes.data)
          ? followingRes.data.map((u) => ({
              ...u,
              isFollowing: u.followers.includes(user_id),
            }))
          : [];
        console.log({ modifiedFollowings });
        setFollowers(modifiedFollowers || []);
        setFollowing(modifiedFollowings || []);
        setFilteredUsers(modifiedFollowers || []);
      } catch (e) {
        console.error("Error fetching connections:", e);
      }
    };

    if (user_id) fetchConnections();
  }, [user_id]);

  const FilteredSearchProfiles = ({ interests }) => {
    const baseData = activeTab === "followers" ? followers : following;

    let filtered = baseData;

    if (interests.length) {
      filtered = filtered.filter((user) => interests.includes(user.role));
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    setFilteredUsers(activeTab === "followers" ? followers : following);
  }, [activeTab, followers, following]);

  const handleFollowToggle = async (e, userId, isFollowing) => {
    const button = e.target;
    button.textContent = isFollowing ? "Follow" : "Unfollow";
    if (activeTab === "following") {
      setFilteredUsers((prev) =>
        Array.isArray(prev) ? prev.filter((u) => u._id !== userId) : prev
      );
    } else {
      setFilteredUsers((prev) =>
        Array.isArray(prev)
          ? prev.map((u) => {
              if (u._id == userId) return { ...u, isFollowing: !u.isFollowing };
              return u;
            })
          : prev
      );
    }
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
    } catch (err) {
      dispatch(
        setToast({
          message: "Error while updating follow status",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
      console.error("Follow error:", err);
    }
  };

  const renderUserCard = (user) => {
    return (
      <div
        key={user._id}
        style={{ border: "1px solid gainsboro" }}
        className="bg-white hover:shadow-lg border border-gray-200 rounded-xl p-4 w-[190px] flex flex-col justify-center items-center flex-wrap-reverse"
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
            <button
              className="rounded-full px-4 py-1 text-[rgb(79,85,199)] border border-solid border-[rgb(79,85,199)] bg-white text-sm hover:text-white"
              onClick={(e) => setReceiverId(user._id)}
            >
              Chat
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <div
        id="left-div"
        className="mt-5 ml-10 flex flex-col gap-4 w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="Search Profiles"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm  w-80 ml-10"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            FilteredSearchProfiles({ interests: [] });
          }}
        />

        <div className="w-full">
          <SearchFilter FilteredSearchProfiles={FilteredSearchProfiles} />
        </div>
      </div>

      <div className="p-6 flex-1">
        <h2 className="text-xl font-semibold mb-4 ml-10">Your Connections</h2>

        <div className="flex space-x-4 mb-6 ml-10">
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

        <div
          className="mt-6 w-full lg:w-[980px] bg-white p-8 rounded-lg"
          style={{ border: "1px solid lightgray" }}
        >
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredUsers.map((user) => renderUserCard(user))}
            </div>
          ) : (
            <p>No {activeTab} found.</p>
          )}
        </div>

        <AddConversationPopup
          receiverId={receiverId}
          setReceiverId={setReceiverId}
          isNavigate={true}
        />
      </div>
    </div>
  );
};


