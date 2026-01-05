import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { useNavigate } from "react-router-dom";
import { followerController, socket_io } from "../../Utils";
import RecommendedConnectButton from "../Posts/RecommendedConnectButton";
import { io } from "socket.io-client";
import { useAuthAction } from "../../hooks/useAuthAction";

export default function NewProfiles() {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [recommendedUserTrigger, setRecommendedUserTrigger] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authenticated = useAuthAction();

  const auth = useSelector((store) => store.auth || {});
  const userDetails = auth.userDetails || {};
  const { role, userName, image, _id: user_id } = userDetails;

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch profiles regardless of login status
    ApiServices.getNewProfiles()
      .then((res) => {
        setRecommendedUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching suggestions:", err);
      });
  }, [recommendedUserTrigger, user_id]);

  return (
    <div className="suggestions-section shadow-lg m-4">
      <h4 className="label">Suggestions for you</h4>

      {recommendedUsers?.map((rec) => (
        <div className="suggestion-item" key={rec._id}>
          <div className="left-section">
            <img
              src={
                rec?.image?.url === undefined ? "/profile.png" : rec?.image?.url
              }
              alt="User"
              className="user-image"
            />
          </div>
          <div className="right-section">
            <h4
              className="cursor-pointer"
              onClick={() => {
                if (user_id && rec._id === user_id) {
                  navigate("/editProfile");
                } else {
                  navigate(`/user/${rec._id}`);
                }
              }}
            >
              {rec?.userName}
            </h4>
            <p>{rec?.role}</p>
            <div className="follow-container">
              <button
                className="follow"
                onClick={authenticated((e) => {
                  followerController({
                    dispatch,
                    e,
                    followingToId: rec._id,
                    recommendedUserTrigger,
                    setRecommendedUserTrigger,
                    socket,
                    user: { id: user_id, userName, image, role },
                  });
                })}
              >
                Follow
              </button>
              <RecommendedConnectButton
                id={rec._id}
                handleFollower={authenticated(() => {
                  setRecommendedUserTrigger(!recommendedUserTrigger);
                })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
