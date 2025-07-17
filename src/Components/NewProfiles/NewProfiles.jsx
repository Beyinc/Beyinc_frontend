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
        dispatch(
          setToast({
            message: "Error Occured!",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  }, [recommendedUserTrigger, user_id]);

  return (
  <div
    className="mt-6 bg-white p-8 rounded-lg px-10 mx-[10px] max-w-[1500px] mx-auto"
    style={{ border: "1px solid lightgray" }}
  >
    <h2 className="text-xl font-semibold mb-4">Suggestions for You</h2>
    {recommendedUsers.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendedUsers.map((rec) => (
          <div
            key={rec._id}
            style={{ border: "1px solid gainsboro" }}
            className="bg-white hover:shadow-lg border rounded-xl p-4 w-[190px] flex flex-col justify-center items-center"
          >
            <img
              src={rec?.image?.url || "/profile.png"}
              onClick={() =>
                rec._id === user_id
                  ? navigate("/editProfile")
                  : navigate(`/user/${rec._id}`)
              }
              className="cursor-pointer object-cover rounded-full h-[100px] w-[100px]"
              alt="profile"
            />
            <h3 className="mt-2 text-center text-sm font-medium">
              {rec?.userName}
            </h3>
            {rec.role && (
              <h5 className="text-neutral-600 mt-1 text-xs">{rec.role}</h5>
            )}
            <p className="mt-2 mb-2 text-center text-xs">{rec.headline}</p>
            <div className="flex gap-4">
              <button
                className="rounded-full px-4 py-1 bg-[rgb(79,85,199)] text-white text-sm"
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
);

}
