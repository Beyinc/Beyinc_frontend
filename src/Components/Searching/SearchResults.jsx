import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { ApiServices } from "../../Services/ApiServices";
import SearchFilter from "./SearchFilter";
import { useNavigate } from "react-router";

import { socket_io } from "../../Utils";
import { io } from "socket.io-client";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { useDispatch, useSelector } from "react-redux";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const [users, setUsers] = useState([]);
  const [follower, setFollower] = useState(() => {
    // Initialize from localStorage if available
    const savedFollowers = localStorage.getItem('followers');
    return savedFollowers ? JSON.parse(savedFollowers) : [];
  });
  const [localFollowStates, setLocalFollowStates] = useState({});
  const { user_id } = useSelector((store) => store.auth.loginDetails);
  const dispatch = useDispatch();
  const socket = useRef();
  const [filters, setFilters] = useState({
    interests: [],
  });

  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  useEffect(() => {
    const fetchAndSetUsers = async () => {
      if (!searchQuery) return;

      try {
        const profileResponse = await ApiServices.getProfile({ id: user_id });
        const userProfileData = profileResponse;
        console.log({profileDatafollowers: userProfileData});
        
        // Correctly access followers and following from the nested data structure
        setFollower(userProfileData.followers || []);
        const userFollowingList = userProfileData.following || [];

        let searchResponse;

        if (filters.interests.length > 0) {
          // Fetch with filters
          searchResponse = await ApiServices.FilterSearchProfiles({
            query: searchQuery,
            interests: filters.interests,
          });
          searchResponse = searchResponse; // since filtered returns { data: [...] }
        } else {
          // Default search
          searchResponse = await ApiServices.searchProfiles(searchQuery);
          
        }
console.log('searchResponse',searchResponse)
        // Add isFollowing to each user
        const usersWithStatus = searchResponse.map((user) => ({
          ...user,
          isFollowing: userFollowingList.some((f) => f._id === user._id),
        }));
        console.log({usersWithStatus});
        setUsers(usersWithStatus);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    };

    fetchAndSetUsers();
  }, [searchQuery, user_id, filters]);

  const FilteredSearchProfiles = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleFollowToggle = async (e, userId, isFollowing) => {
    e.target.disabled = true;

    // Immediately update local follow state
    setLocalFollowStates(prev => ({
      ...prev,
      [userId]: !isFollowing
    }));

    // Immediately update the button text
    const button = e.target;
    button.textContent = !isFollowing ? "Unfollow" : "Follow";

    try {
      let response;
      if (isFollowing) {
        // Unfollow user
        response = await ApiServices.unfollowUser({
          unfollowReqBy: user_id,
          unfollowReqTo: userId,
        });
      } else {
        // Follow user
        response = await ApiServices.saveFollowers({
          followerReqBy: user_id,
          followerReqTo: userId,
        });

        // Send notification only after successful follow
        await socket.current.emit("sendNotification", {
          senderId: user_id,
          receiverId: userId,
        });
      }

      // Update with actual server response
      setFollower(response.data.followers);
      
      // Update the users state with the new follow status
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isFollowing: !isFollowing } : user
        )
      );
    } catch (err) {
      // Revert local follow state on error
      setLocalFollowStates(prev => ({
        ...prev,
        [userId]: isFollowing
      }));
      
      // Revert button text
      button.textContent = isFollowing ? "Unfollow" : "Follow";

      console.error("Error in handleFollowToggle:", err);
      dispatch(
        setToast({
          message: "Error while updating follow status",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    } finally {
      e.target.disabled = false;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-10">
      <SearchFilter FilteredSearchProfiles={FilteredSearchProfiles} />
     
      <div
        className="mt-6 w-full lg:w-[1100px] bg-white p-8 py-8 rounded-lg"
        style={{ border: "1px solid lightgray" }}
      >
        <h3>Search Results for "{searchQuery}"</h3>
        <div className="flex flex-wrap gap-6 mt-6">
          {users.map((user) => (
            <div
              key={user._id}
              style={{ border: "1px solid gainsboro" }}
              className="bg-white hover:shadow-lg rounded-xl p-5 py-5 w-[250px] flex flex-col justify-center items-center"
            >
              <img
                src={user.image?.url ? user.image.url : "/profile.png"}
                onClick={() => navigate(`/user/${user?._id}`)}
                style={{
                  cursor: "pointer",
                  objectFit: "cover",
                  borderRadius: "50%",
                  height: "150px",
                  width: "150px",
                }}
                alt="profile pic"
              />
              <h3 className="mt-3" style={{ textAlign: "center" }}>
                {user.userName}
              </h3>

              {user.role && (
                <h5 className="text-neutral-600 mt-1">{user.role}</h5>
              )}
              {user.beyincProfile && (
                <h5 className="text-neutral-600 mt-1">
                  {user.beyincProfile} at Beyinc
                </h5>
              )}
              <p className="mt-2 mb-2">{user.headline}</p>
              <button
                className="rounded-full px-8 py-2 bg-[rgb(79,85,199)] text-white"
                onClick={(e) =>
                  handleFollowToggle(e, user._id, localFollowStates[user._id] ?? user.isFollowing)
                }
              >
                {localFollowStates[user._id] ?? user.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;

