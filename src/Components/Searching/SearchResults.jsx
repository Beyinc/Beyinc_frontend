import { useLocation } from "react-router-dom";
import { useEffect,useRef,  useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import SearchFilter from "./SearchFilter";
import { useNavigate } from "react-router";
import { socket_io} from "../../Utils";
import { io } from "socket.io-client";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { useDispatch,useSelector } from "react-redux";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const [users, setUsers] = useState([]);
  const [selfProfile,setSelfProfile] = useState(false);
    const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);

  const [filters, setFilters] = useState({
    interests: [],
  });

  const { email, role, userName, image, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );
console.log('followers', follower)
   const dispatch = useDispatch();

  useEffect(() => {
    console.log(searchQuery);
  
    const fetchUsers = async () => {
      if (searchQuery) {
        try {
          const profileResponse =  await ApiServices.getProfile({ id: user_id });

          const profileData = profileResponse.data;
          setFollower(profileData.followers || []);
          setFollowing(profileData.following || []);
          // Fetch users based on the search query
          const response = await ApiServices.searchProfiles(searchQuery); // Adjust this function based on your API service
         
         setUsers(response.data); // Assuming the response has a 'data' field containing user profiles
         
        
        } catch (err) {
          console.log(err.message); // Set error message if the fetch fails
        }
      }
    };

    fetchUsers(); // Call the fetch function
  }, [searchQuery]); // Dependency array includes searchQuery

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




  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);
  

  const followerController = async (e, id) => {
    console.log("Following user:", id);
    console.log("Current userId:", user_id);
  
    e.target.disabled = true;
  
    try {
      const response = await ApiServices.saveFollowers({
        followerReqBy: user_id,
        followerReqTo: id,
      });
  
      const updatedUser = response.data;
  
      // Update the state with the latest data
      setFollower(updatedUser.followers);
      setFollowing(updatedUser.following);
  
      // Emit socket notifications
      socket.current.emit("sendNotification", {
        senderId: user_id,
        receiverId: id,
      });
      socket.current.emit("sendFollowerNotification", {
        senderId: user_id,
        receiverId: id,
        type: "adding",
        image: updatedUser.image,
        role: updatedUser.role,
        _id: id,
        userName: updatedUser.userName,
      });
  
      console.log("Follow successful, updated user data:", updatedUser);
    } catch (err) {
      console.error("Error in followerController:", err);
      dispatch(
        setToast({
          message: "Error in following user",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    } finally {
      e.target.disabled = false;
    }
  };
  
  const unfollowHandler = async (e, id) => {
    console.log("Unfollowing user:", id);
    console.log("Current userId:", user_id);
  
    e.target.disabled = true;
  
    try {
      const response = await ApiServices.unfollowUser({
        unfollowReqBy: user_id,
        unfollowReqTo: id,
      });
  
      const updatedUser = response.data;
  
      // Update the state with the latest data
      setFollower(updatedUser.followers);
      setFollowing(updatedUser.following);
  
      // Emit socket notifications
      socket.current.emit("sendFollowerNotification", {
        senderId: user_id,
        receiverId: id,
        type: "removing",
        _id: id,
      });
  
      console.log("Unfollow successful, updated user data:", updatedUser);
    } catch (err) {
      console.error("Error in unfollowHandler:", err);
      dispatch(
        setToast({
          message: "Error while trying to unfollow",
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
  <div className="mt-6 w-full lg:w-[1100px] bg-white p-8 py-8 rounded-lg" style={{ border: "1px solid lightgray" }}>
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
          <h3 className="mt-3">{user.userName}</h3>
          {user.role && <h5 className="text-neutral-600 mt-1">{user.role}</h5>}
          {user.beyincProfile && (
            <h5 className="text-neutral-600 mt-1">{user.beyincProfile} at Beyinc</h5>
          )}
          <p className="mt-2 mb-2">{user.headline}</p>
          <button
            className="rounded-full px-8 py-2 bg-[rgb(79,85,199)] text-white"
            onClick={(e) => {
              follower.some((follower) => follower._id === user_id)
                ? unfollowHandler(e, user._id) // Call unfollowHandler if "Unfollow"
                : followerController(e, user._id); // Call followerController if "Follow"
            }}
          >
            {follower.some((follower) => follower._id === user_id) ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}

export default SearchResults;