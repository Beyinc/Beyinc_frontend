// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// // import MessageRequest from "./MessageRequest";
// // import PostDiscussionRequest from "./PostDiscussionRequest";
// // import "../Posts/Posts.css"
// import { getAllNotifications } from "../../redux/Conversationreducer/ConversationReducer";
// import { ApiServices } from "../../Services/ApiServices";
// import MessageRequest from "../Conversation/Notification/MessageRequest";
// import PostDiscussionRequest from "../Editprofile/PostDiscussionRequestNotifications";
// function NotificationPage() {
//   const [messageRequest, setMessageRequest] = useState([]);
//   const [postDiscussionRequest, setpostDiscussionRequest] = useState([]);
//   const [value, setValue] = useState(1);
//   const { verification, user_id, image, userName, role } = useSelector(
//     (store) => store.auth.loginDetails
//   );

//   const notifications = useSelector((state) => state.conv.notifications);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const getNotifys = async () => {
//     await ApiServices.getUserRequest({ userId: user_id }).then((res) => {
//       setMessageRequest(res.data);
//     });
//     dispatch(getAllNotifications(user_id));
//   };

//   const getPostDiscussionRequest = async () => {
//     await ApiServices.getPostRequestDiscussion({ user_id: user_id }).then(
//       (res) => {
//         setpostDiscussionRequest(res.data);
//       }
//     );
//     dispatch(getAllNotifications(user_id));
//   };

//   useEffect(() => {
//     getNotifys();
//     getPostDiscussionRequest();
//   }, []);

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // dispatch(setLoading({ visible: "yes" }));
//     ApiServices.getDashboardDetails()
//       .then((res) => {
//         // console.log(res.data);
//         setData(res.data);
//         // dispatch(setLoading({ visible: "no" }));
//       })
//       .catch((err) => {
//         console.log(err);
//         // dispatch(setLoading({ visible: "no" }));
//       });
//   }, []);

//   return (
//     <>
// <div
//   className="sidebar-menu shadow-lg w-[300px] h-auto ml-[34px] mt-[110px]"
// >
//         <div className="Homepage-left-container-profile">
//           <div>
//             <img
//               id="Profile-img"
//               className="Homepage-profile-img"
//               src={
//                 image !== undefined && image !== "" ? image.url : "/profile.png"
//               }
//               alt=""
//             />
//           </div>

//           <div>
//             <div style={{ fontWeight: "600", fontSize: "16px" }}>
//               {userName}
//             </div>
//             <div style={{ fontSize: "12px" }}>{role}</div>
//           </div>
//         </div>
//         <div
//           className="sidebar-menu-items"
//           onClick={() => navigate("/createPostPage")}
//         >
//           <div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="25"
//               height="25"
//               viewBox="0 0 32 32"
//             >
//               <path
//                 fill="currentColor"
//                 d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16a16 16 0 0 1-16 16m0-30C8.268 2 2 8.268 2 16s6.268 14 14 14s14-6.268 14-14A14 14 0 0 0 16 2"
//               />
//               <path
//                 fill="currentColor"
//                 d="M23 15h-6V9h-2v6H9v2h6v6h2v-6h6z"
//                 class="ouiIcon__fillSecondary"
//               />
//             </svg>
//           </div>
//           <div>Create post</div>
//         </div>

//         {/* <div className="sidebar-menu-items">
//             <div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="25"
//                 height="25"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   fill="currentColor"
//                   d="M4 21q-.825 0-1.412-.587T2 19V5q0-.825.588-1.412T4 3h16q.825 0 1.413.588T22 5v14q0 .825-.587 1.413T20 21zm0-2h16V5H4zm2-2h12v-2H6zm0-4h4V7H6zm6 0h6v-2h-6zm0-4h6V7h-6zM4 19V5z"
//                 />
//               </svg>
//             </div>
//             <div>Newsfeed</div>
//           </div> */}

//         <div
//           className="sidebar-menu-items"
//           onClick={() => navigate("/conversations")}
//         >
//           <div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="25"
//               height="25"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 fill="currentColor"
//                 d="M4 4h16v12H5.17L4 17.17zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm2 10h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"
//               />
//             </svg>
//           </div>
//           <div>Message</div>
//         </div>

//         <div className="sidebar-menu-items">
//           <div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="25"
//               height="25"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 fill="currentColor"
//                 d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24a5.98 5.98 0 0 1 0 7.52c.42.14.86.24 1.33.24m-6 0c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2m0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4m6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2z"
//               />
//             </svg>
//           </div>
//           <div onClick={() => navigate("/connections")}>Connections</div>

//           <div style={{ marginLeft: "80px" }}>
//             {data?.connections_approved || 0}
//           </div>
//         </div>
//         {/* 
//           <div className="sidebar-menu-items">
//             <div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="25"
//                 height="25"
//                 viewBox="0 0 256 256"
//               >
//                 <path
//                   fill="currentColor"
//                   d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h13.39a8 8 0 0 0 7.23-4.57a48 48 0 0 1 86.76 0a8 8 0 0 0 7.23 4.57H216a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M80 144a24 24 0 1 1 24 24a24 24 0 0 1-24-24m136 56h-56.57a64.4 64.4 0 0 0-28.83-26.16a40 40 0 1 0-53.2 0A64.4 64.4 0 0 0 48.57 200H40V56h176ZM56 96V80a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8v96a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h8V88H72v8a8 8 0 0 1-16 0"
//                 />
//               </svg>
//             </div>
//             <div>Expertise</div>
//           </div> */}

//         <div className="sidebar-menu-items">
//           <div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="25"
//               height="25"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fill="currentColor"
//                 d="M9.997 2.707a.75.75 0 0 1-.67.822a6.506 6.506 0 1 0 7.144 7.145a.75.75 0 1 1 1.492.153a8.006 8.006 0 1 1-8.788-8.79a.75.75 0 0 1 .822.67m1.02-.066a.75.75 0 0 1 .905-.555q.568.136 1.103.35a.75.75 0 0 1-.555 1.393q-.435-.173-.898-.284a.75.75 0 0 1-.554-.904m6.547 4.333a.75.75 0 0 0-1.394.555q.173.436.285.898a.75.75 0 1 0 1.459-.35a8 8 0 0 0-.35-1.103M14.29 3.926a.75.75 0 0 1 1.058-.073q.461.401.858.867a.75.75 0 0 1-1.143.972a7 7 0 0 0-.7-.708a.75.75 0 0 1-.073-1.058M10 5.75a.75.75 0 0 0-1.5 0v5c0 .415.336.75.75.75h3a.75.75 0 1 0 0-1.5H10z"
//               />
//             </svg>
//           </div>
//           <div onClick={() => navigate("/editProfile?editPostToggler=posts")}>
//             Activity
//           </div>
//         </div>
//       </div>




//       <div
//         style={{
//           // notifiacation pannel starts from here.
//           width: "1064px",
//           height: "759px",
//           transform: "rotate(0deg)",
//           opacity: 1,
//           position: "absolute",
//           top: "110px",
//           left: "400px",
//           borderRadius: "12px",
//           borderWidth: "1px",
//           borderStyle: "solid",
//           borderColor: "#E0E0E0", // optional, else border won’t show
//           overflowX: "hidden",
//         }}
//       >
//         <div className="notification-headers flex justify-between items-center mt-[40px]">
//           <span className='[font-family:"Gentium_Book_Basic"] font-bold text-[20px] ml-[20px] mb-[10px] hover:cursor-pointer'>
//             Notifications
//           </span>
//           <span className="text-[#4F55C7] hover:cursor-pointer mr-4">
//             Mark all read
//           </span>
//         </div>

//         <div className="border-div">
//           <div className="SideNotificationHeader">
//             <div
//               className={`sideNavIcons ${value === 1 && "sideselected"}`}
//               onClick={() => setValue(1)}
//             >
//               All ({notifications?.length})
//             </div>
//             <div
//               className={`sideNavIcons ${value === 2 && "sideselected"}`}
//               onClick={() => setValue(2)}
//             >
//               Message Requests ({messageRequest?.length})
//             </div>
//             <div
//               className={`sideNavIcons ${value === 3 && "sideselected"}`}
//               onClick={() => setValue(3)}
//             >
//               Post Discussion Requests ({postDiscussionRequest?.length})
//             </div>
//           </div>
//         </div>

//         {value === 1 &&
//           notifications.map((n) => {
//             const formattedDate = new Date(n.createdAt).toLocaleDateString(
//               "en-GB",
//               {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               }
//             );

//             return (
//               <div
//                 key={n._id}
//                 className={`individualrequest`}
//                 style={{ marginLeft: "15px", textAlign: "start" }}
//               >
//                 <div
//                   className="individualrequestWrapper"
//                   style={{
//                     gap: "5px",
//                     alignItems: "center",
//                     width: "100%",
//                     borderBottom: "1px solid #EEEEEE",
//                     background: "#FAFBFF",
//                     height: "auto",
//                     padding: "10px 0",
//                     backgroundColor: "#FAFBFF",
//                   }}
//                 >
//                   <div
//                     onClick={() => {
//                       if (
//                         !(n.type === "postDiscussion" || n.type === "report")
//                       ) {
//                         navigate(`/user/${n.senderInfo?._id}`);
//                       }
//                     }}
//                   >
//                     <img
//                       style={{
//                         height: "30px",
//                         width: "30px",
//                         borderRadius: "50%",
//                       }}
//                       src={
//                         n.senderInfo?.image?.url === undefined
//                           ? "/profile.png"
//                           : n.senderInfo?.image?.url
//                       }
//                       alt=""
//                     />
//                   </div>

//                   <div style={{ display: "flex", flexDirection: "column" }}>
//                     <span
//                       className="ml-[20px]"
//                       style={{
//                         fontFamily: "Gentium Book Basic",
//                         fontWeight: 400,
//                         fontStyle: "normal",
//                         verticalAlign: "middle",
//                       }}
//                     >
//                       {n.type === "postDiscussion" || n.type === "report" ? (
//                         <Link
//                           to={`/posts/${n.postId}`}
//                           style={{
//                             textDecoration: "none",
//                             color: "black",
//                           }}
//                         >
//                           {n.message}
//                         </Link>
//                       ) : (
//                         <span>{n.message}</span>
//                       )}
//                     </span>
//                     <span
//                       style={{
//                         fontFamily: "Gentium Book Basic",
//                         fontWeight: 400,
//                         fontStyle: "normal",
//                         fontSize: "14px",
//                         lineHeight: "20px",
//                         letterSpacing: "0.25px",
//                         verticalAlign: "middle",
//                         color: "#878787",
//                         marginLeft: "20px",
//                       }}
//                     >
//                       {formattedDate}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//         {/* Message Requests */}
//         {value === 2 && messageRequest.length > 0 && (
//           <div>
//             {messageRequest?.map((m) => (
//               <MessageRequest
//                 key={m._id}
//                 m={m}
//                 setMessageRequest={setMessageRequest}
//               />
//             ))}
//           </div>
//         )}

//         {/* Post Discussion Requests */}
//         {value === 3 && postDiscussionRequest.length > 0 && (
//           <div>
//             {postDiscussionRequest?.map((m) => (
//               <PostDiscussionRequest
//                 key={m._id}
//                 m={m}
//                 setpostDiscussionRequest={setpostDiscussionRequest}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default NotificationPage;


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllNotifications } from "../../redux/Conversationreducer/ConversationReducer";
import { ApiServices } from "../../Services/ApiServices";
import MessageRequest from "../Conversation/Notification/MessageRequest";
import PostDiscussionRequest from "../Editprofile/PostDiscussionRequestNotifications";

function NotificationPage() {
  const [messageRequest, setMessageRequest] = useState([]);
  const [postDiscussionRequest, setpostDiscussionRequest] = useState([]);
  const [value, setValue] = useState(1);
  const { verification, user_id, image, userName, role } = useSelector(
    (store) => store.auth.loginDetails
  );

  const notifications = useSelector((state) => state.conv.notifications);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getNotifys = async () => {
    await ApiServices.getUserRequest({ userId: user_id }).then((res) => {
      setMessageRequest(res.data);
    });
    dispatch(getAllNotifications(user_id));
  };

  const getPostDiscussionRequest = async () => {
    await ApiServices.getPostRequestDiscussion({ user_id: user_id }).then(
      (res) => {
        setpostDiscussionRequest(res.data);
      }
    );
    dispatch(getAllNotifications(user_id));
  };

  useEffect(() => {
    getNotifys();
    getPostDiscussionRequest();
  }, []);

  const [data, setData] = useState([]);

  useEffect(() => {
    ApiServices.getDashboardDetails()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div
        className="shadow-lg p-4"
        style={{
          width: "250px",
          height: "300px",
          position: "absolute",
          top: "110px",
          left: "34px",
          borderRadius: "12px",
          border: "1px solid #E0E0E0",
          backgroundColor: "#FAFBFF",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <img
            id="Profile-img"
            className="w-[50px] h-[50px] rounded-full object-cover"
            src={image !== undefined && image !== "" ? image.url : "/profile.png"}
            alt="profile"
          />
          <div>
            <div className="font-semibold text-[16px]">{userName}</div>
            <div className="text-[12px] text-gray-600">{role}</div>
          </div>
        </div>

        <div
          className="sidebar-menu-items flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate("/createPostPage")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32">
            <path
              fill="currentColor"
              d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16a16 16 0 0 1-16 16m0-30C8.268 2 2 8.268 2 16s6.268 14 14 14s14-6.268 14-14A14 14 0 0 0 16 2"
            />
            <path
              fill="currentColor"
              d="M23 15h-6V9h-2v6H9v2h6v6h2v-6h6z"
              className="ouiIcon__fillSecondary"
            />
          </svg>
          <span>Create Post</span>
        </div>

        <div
          className="sidebar-menu-items flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate("/conversations")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M4 4h16v12H5.17L4 17.17zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm2 10h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"
            />
          </svg>
          <span>Messages</span>
        </div>

        <div className="sidebar-menu-items flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer">
          <div className="flex items-center gap-3" onClick={() => navigate("/connections")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24a5.98 5.98 0 0 1 0 7.52c.42.14.86.24 1.33.24m-6 0c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2-2s.9-2 2-2m0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4m6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2z"
              />
            </svg>
            <span>Connections</span>
          </div>
          <span className="text-sm font-semibold text-gray-700">{data?.connections_approved || 0}</span>
        </div>

        <div
          className="sidebar-menu-items flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate("/editProfile?editPostToggler=posts")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="M9.997 2.707a.75.75 0 0 1-.67.822a6.506 6.506 0 1 0 7.144 7.145a.75.75 0 1 1 1.492.153a8.006 8.006 0 1 1-8.788-8.79a.75.75 0 0 1 .822.67m1.02-.066a.75.75 0 0 1 .905-.555q.568.136 1.103.35a.75.75 0 0 1-.555 1.393q-.435-.173-.898-.284a.75.75 0 0 1-.554-.904m6.547 4.333a.75.75 0 0 0-1.394.555q.173.436.285.898a.75.75 0 1 0 1.459-.35a8 8 0 0 0-.35-1.103M14.29 3.926a.75.75 0 0 1 1.058-.073q.461.401.858.867a.75.75 0 0 1-1.143.972a7 7 0 0 0-.7-.708a.75.75 0 0 1-.073-1.058M10 5.75a.75.75 0 0 0-1.5 0v5c0 .415.336.75.75.75h3a.75.75 0 1 0 0-1.5H10z"
            />
          </svg>
          <span>Activity</span>
        </div>
      </div>

      {/* Notification Panel */}
      <div
        className="shadow-lg p-6"
        style={{
          width: "1064px",
          height: "759px",
          position: "absolute",
          top: "110px",
          left: "340px",
          borderRadius: "12px",
          border: "1px solid #E0E0E0",
          backgroundColor: "#FAFBFF",
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-[20px] ml-[10px]">Notifications</span>
          <span className="text-[#4F55C7] text-sm font-medium cursor-pointer">Mark all read</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-2 mb-6">
          <div
            className={`cursor-pointer ${value === 1 ? "font-semibold text-[#4F55C7]" : "text-gray-600"}`}
            onClick={() => setValue(1)}
          >
            All ({notifications?.length})
          </div>
          <div
            className={`cursor-pointer ${value === 2 ? "font-semibold text-[#4F55C7]" : "text-gray-600"}`}
            onClick={() => setValue(2)}
          >
            Message Requests ({messageRequest?.length})
          </div>
          <div
            className={`cursor-pointer ${value === 3 ? "font-semibold text-[#4F55C7]" : "text-gray-600"}`}
            onClick={() => setValue(3)}
          >
            Post Discussion Requests ({postDiscussionRequest?.length})
          </div>
        </div>

        {/* All Notifications */}
        {value === 1 &&
          notifications.map((n) => {
            const formattedDate = new Date(n.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={n._id}
                className="flex items-start gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer"
              >
                <div
                  onClick={() => {
                    if (!(n.type === "postDiscussion" || n.type === "report")) {
                      navigate(`/user/${n.senderInfo?._id}`);
                    }
                  }}
                >
                  <img
                    className="w-[35px] h-[35px] rounded-full object-cover"
                    src={n.senderInfo?.image?.url || "/profile.png"}
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {n.type === "postDiscussion" || n.type === "report" ? (
                      <Link to={`/posts/${n.postId}`} className="text-black no-underline">
                        {n.message}
                      </Link>
                    ) : (
                      <span>{n.message}</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500">{formattedDate}</span>
                </div>
              </div>
            );
          })}

        {/* Message Requests */}
        {value === 2 && messageRequest.length > 0 && (
          <div>
            {messageRequest?.map((m) => (
              <MessageRequest key={m._id} m={m} setMessageRequest={setMessageRequest} />
            ))}
          </div>
        )}

        {/* Post Discussion Requests */}
        {value === 3 && postDiscussionRequest.length > 0 && (
          <div>
            {postDiscussionRequest?.map((m) => (
              <PostDiscussionRequest key={m._id} m={m} setpostDiscussionRequest={setpostDiscussionRequest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
