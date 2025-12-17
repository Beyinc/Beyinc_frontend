
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllNotifications } from "../../redux/Conversationreducer/ConversationReducer";
import { ApiServices } from "../../Services/ApiServices";
import MessageRequest from "../Conversation/Notification/MessageRequest";
import PostDiscussionRequest from "../Editprofile/PostDiscussionRequestNotifications";
import "./NotificationPage.css";

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
    <div className="flex gap-6 notification-page-container">
      {/* Sidebar */}
      <div
        className="shadow-lg p-4 notification-sidebar"
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
        className="shadow-lg p-6 notification-main-panel"
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
