import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { useNavigate } from "react-router-dom";
import { followerController, socket_io } from "../../Utils";
import RecommendedConnectButton from "../Posts/RecommendedConnectButton";
import { io } from "socket.io-client";

export default function NewProfiles() {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [recommendedUserTrigger, setRecommendedUserTrigger] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    role,
    userName,
    image,
    _id: user_id,
  } = useSelector((store) => store.auth.userDetails);
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  useEffect(() => {
    ApiServices.getNewProfiles({ userId: user_id })
      .then((res) => {
        setRecommendedUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        dispatchEvent(
          setToast({
            message: "Error Occured!",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
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
                rec?.image?.url == undefined ? "/profile.png" : rec?.image?.url
              }
              alt="User Image"
              className="user-image"
            />
          </div>
          <div className="right-section">
            <h4
              onClick={() => {
                if (rec._id == user_id) {
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
                onClick={(e) => {
                  followerController({
                    dispatch,
                    e,
                    followingToId: rec._id,
                    recommendedUserTrigger,
                    setRecommendedUserTrigger,
                    socket,
                    user: { id: user_id, userName, image, role },
                  });
                }}
              >
                Follow
              </button>
              <RecommendedConnectButton
                id={rec._id}
                handleFollower={() => {
                  setRecommendedUserTrigger(!recommendedUserTrigger);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
