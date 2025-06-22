import { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export const Connections = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("followers"); // "followers" or "following"

  const { user_id } = useSelector((store) => store.auth.loginDetails);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const FollowersRes = await ApiServices.getFollowers({ user_id });
        const followingRes = await ApiServices.getFollowings({ user_id });

        setFollowers(FollowersRes.data || []);
        setFollowing(followingRes.data || []);
      } catch (e) {
        console.error("Error fetching connections:", e);
      }
    };

    if (user_id) fetchConnections();
  }, [user_id]);

  const renderUserCard = (user) => (
    <div
      key={user._id}
      style={{ border: "1px solid gainsboro" }}
      className="bg-white hover:shadow-lg rounded-xl p-5 py-5 w-[250px] flex flex-col justify-center items-center"
    >
      <img
        src={user.image?.url ? user.image.url : "/profile.png"}
        onClick={() => navigate(`/user/${user._id}`)}
        style={{
          cursor: "pointer",
          objectFit: "cover",
          borderRadius: "50%",
          height: "150px",
          width: "150px",
        }}
        alt="profile"
      />
      <h3 className="mt-3 text-center">{user.userName}</h3>
      {user.role && <h5 className="text-neutral-600 mt-1">{user.role}</h5>}
      {user.beyincProfile && (
        <h5 className="text-neutral-600 mt-1">
          {user.beyincProfile} at Beyinc
        </h5>
      )}
      <p className="mt-2 mb-2 text-center">{user.headline}</p>
    </div>
  );

  const dataToRender = activeTab === "followers" ? followers : following;

  return (
    <div className="p-6">
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

      <div className="flex flex-wrap gap-6 ml-20">
        {dataToRender.length > 0 ? (
          dataToRender.map((user) => renderUserCard(user))
        ) : (
          <p>No {activeTab} found.</p>
        )}
      </div>
    </div>
  );
};
