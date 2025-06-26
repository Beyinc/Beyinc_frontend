// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { ApiServices } from "../../Services/ApiServices";
// import { setToast } from "../../redux/AuthReducers/AuthReducer";
// import { ToastColors } from "../Toast/ToastColors";
// import { useNavigate } from "react-router-dom";
// import { followerController, socket_io } from "../../Utils";
// import RecommendedConnectButton from "../Posts/RecommendedConnectButton";
// import { io } from "socket.io-client";

// export default function NewProfiles() {
//   const [recommendedUsers, setRecommendedUsers] = useState([]);
//   const [recommendedUserTrigger, setRecommendedUserTrigger] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     role,
//     userName,
//     image,
//     _id: user_id,
//   } = useSelector((store) => store.auth.userDetails);
//   const socket = useRef();
//   useEffect(() => {
//     socket.current = io(socket_io);
//   }, []);

//   useEffect(() => {
//     ApiServices.getNewProfiles({ userId: user_id })
//       .then((res) => {
//         setRecommendedUsers(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//         dispatchEvent(
//           setToast({
//             message: "Error Occured!",
//             bgColor: ToastColors.failure,
//             visible: "yes",
//           })
//         );
//       });
//   }, [recommendedUserTrigger, user_id]);
//   return (
//     <div className="suggestions-section shadow-lg m-4">
//       <h4 className="label">Suggestions for you</h4>

//       {recommendedUsers?.map((rec) => (
//         <div className="suggestion-item" key={rec._id}>
//           <div className="left-section">
//             <img
//               src={
//                 rec?.image?.url == undefined ? "/profile.png" : rec?.image?.url
//               }
//               alt="User Image"
//               className="user-image"
//             />
//           </div>
//           <div className="right-section">
//             <h4
//               onClick={() => {
//                 if (rec._id == user_id) {
//                   navigate("/editProfile");
//                 } else {
//                   navigate(`/user/${rec._id}`);
//                 }
//               }}
//             >
//               {rec?.userName}
//             </h4>
//             <p>{rec?.role}</p>
//             <div className="follow-container">
//               <button
//                 className="follow"
//                 onClick={(e) => {
//                   followerController({
//                     dispatch,
//                     e,
//                     followingToId: rec._id,
//                     recommendedUserTrigger,
//                     setRecommendedUserTrigger,
//                     socket,
//                     user: { id: user_id, userName, image, role },
//                   });
//                 }}
//               >
//                 Follow
//               </button>
//               <RecommendedConnectButton
//                 id={rec._id}
//                 handleFollower={() => {
//                   setRecommendedUserTrigger(!recommendedUserTrigger);
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


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
  const socket = useRef();

  const {
    role,
    userName,
    image,
    _id: user_id,
  } = useSelector((store) => store.auth.userDetails);

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
            message: "Error Occurred!",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  }, [recommendedUserTrigger, user_id]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Suggestions for You</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {recommendedUsers?.map((rec) => (
          <div
            key={rec._id}
            className="bg-white hover:shadow-lg border border-gray-200 rounded-xl p-4 flex flex-col items-center"
          >
            <img
              src={rec?.image?.url || "/profile.png"}
              alt="User"
              onClick={() =>
                navigate(rec._id === user_id ? "/editProfile" : `/user/${rec._id}`)
              }
              className="cursor-pointer object-cover rounded-full h-[100px] w-[100px]"
            />
            <h3
              className="mt-2 text-center text-sm font-medium cursor-pointer"
              onClick={() =>
                navigate(rec._id === user_id ? "/editProfile" : `/user/${rec._id}`)
              }
            >
              {rec?.userName}
            </h3>
            {rec?.role && (
              <p className="text-neutral-600 mt-1 text-xs">{rec.role}</p>
            )}
            <p className="text-xs text-center mt-2">{rec?.headline}</p>

            <div className="flex gap-2 mt-4">
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
    </div>
  );
}
