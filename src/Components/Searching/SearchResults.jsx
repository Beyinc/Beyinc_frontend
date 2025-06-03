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
  const [follower, setFollower] = useState([]);
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
    const fetchUsers = async () => {
      if (searchQuery) {
        try {
          const profileResponse = await ApiServices.getProfile({ id: user_id });
          const profileData = profileResponse.data;
          setFollower(profileData.followers || []);

          const response = await ApiServices.searchProfiles(searchQuery);
          console.log(response.data);
          const usersWithStatus = response.data
            .filter(
              (user) => user._id !== user_id && user.isProfileComplete == true
            ) //  Exclude self profile and incompleted profiles
            .map((user) => ({
              ...user,
              isFollowing: profileData.followers.some(
                (f) => f._id === user._id
              ),
            }));

          setUsers(usersWithStatus);
          console.log(users);
        } catch (err) {
          console.error("Error fetching users:", err.message);
        }
      }
    };

    fetchUsers();
  }, [searchQuery, user_id]);

  const FilteredSearchProfiles = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  // Function to fetch user data from backend based on filters
  const fetchSearchUsers = async () => {
    console.log("Current filters:", filters);
    try {
      const response = await ApiServices.FilterSearchProfiles({
        query: searchQuery, // Send query directly
        interests: filters.interests, // Send interests directly
      });
      setUsers(response.data);

      // Filter users to only include those with the desired fields
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchSearchUsers();
  }, [filters]);

  const handleFollowToggle = async (e, userId, isFollowing) => {
    e.target.disabled = true;

    try {
      if (isFollowing) {
        // Unfollow user
        const response = await ApiServices.unfollowUser({
          unfollowReqBy: user_id,
          unfollowReqTo: userId,
        });

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isFollowing: false } : user
          )
        );

        setFollower(response.data.followers);
      } else {
        // Follow user
        const response = await ApiServices.saveFollowers({
          followerReqBy: user_id,
          followerReqTo: userId,
        });

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isFollowing: true } : user
          )
        );

        setFollower(response.data.followers);

        socket.current.emit("sendNotification", {
          senderId: user_id,
          receiverId: userId,
        });
      }
    } catch (err) {
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
                  handleFollowToggle(e, user._id, user.isFollowing)
                }
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
