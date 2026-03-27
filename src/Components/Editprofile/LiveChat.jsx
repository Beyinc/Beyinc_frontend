import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { socket_io } from "../../Utils";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";

export function LiveChat({ post, userName, user_id, onlineEmails,isEnabled }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const navigate = useNavigate();

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  // Fetch mentors when component mounts
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoadingMentors(true);
        const response = await ApiServices.getAllUsers({ type: "Mentor" });
        if (response?.data) {
          setMentors(response.data);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoadingMentors(false);
      }
    };
    fetchMentors();
  }, []);

  // Load chat history when component mounts
  useEffect(() => {
    if (post?._id) {
      loadChatHistory();
    }
  }, [post?._id]);

  const loadChatHistory = async () => {
    try {
      const response = await ApiServices.getPostLiveChatMessages({
        postId: post._id,
      });
      setChatMessages(response.data);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  useEffect(() => {
    if (socket.current && post?._id) {
      socket.current.emit("joinPostChat", { postId: post._id });

      // Listen for new chat messages
      socket.current.on("newPostChatMessage", (message) => {
        setChatMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.current.emit("leavePostChat", { postId: post._id });
        socket.current.off("newPostChatMessage");
      };
    }
  }, [socket.current, post?._id]);

  // Auto-scroll to latest message
  useEffect(() => {
    const chatMessages = document.querySelector(".chat-messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [chatMessages]);

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !post?._id) return;

    const messageData = {
      postId: post._id,
      senderId: user_id,
      senderName: userName,
      message: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      // First save message to database via HTTP request
      const response = await ApiServices.sendPostLiveChatMessage(messageData);
      const savedMessage = response.data;

      // Then emit socket event for real-time broadcasting
      socket.current.emit("sendPostChatMessage", savedMessage);

      setChatInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      // You can add a toast notification here
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className="membersWrapper h-auto ">
      <div className="members-header ">
        <h5>{isChatOpen ? "Live Chat" : "Members"}</h5>
        <button
          className="chat-toggle-btn disabled:!bg-blue-300"
          onClick={() => setIsChatOpen(!isChatOpen)}
          disabled={!isEnabled}
        >
          {isChatOpen ? "Show Members" : "Live Chat"}
        </button>
      </div>

      {isChatOpen ? (
        <div className="live-chat-container ">
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={msg._id || idx} className="chat-message">
                <div className="message-header">
                  <span className="sender-name">
                    {msg.senderId.userName || msg.senderName}
                  </span>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-content">{msg.message}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <textarea
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleChatKeyPress}
              placeholder="Type a message..."
              rows={2}
            />
            <button
              className="send-chat-btn"
              onClick={sendChatMessage}
              disabled={!chatInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="openDiscussionUsers">
          {/* Show Mentors Section */}
          {mentors.length > 0 && (
            <>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#4F55C7",
                marginBottom: "10px",
                borderBottom: "1px solid #e0e0e0",
                paddingBottom: "8px"
              }}>
                Mentors ({mentors.length})
              </div>
              {loadingMentors ? (
                <div style={{ textAlign: "center", padding: "10px", color: "#666" }}>
                  Loading mentors...
                </div>
              ) : (
                mentors.map((mentor) => (
                  <div className="openDiscussionUser" key={mentor._id}>
                    <div className="openDiscussionUserContainer">
                      <img
                        src={
                          mentor?.image !== "" &&
                          mentor?.image !== undefined &&
                          mentor?.image?.url !== ""
                            ? mentor?.image?.url
                            : "/profile.png"
                        }
                        alt=""
                        className="openDiscussionUserImage"
                      />

                      <div>
                        <div
                          className="openDiscussionUserName"
                          onClick={() => {
                            if (mentor._id === user_id) {
                              navigate("/editProfile");
                            } else {
                              navigate(`/user/${mentor._id}`);
                            }
                          }}
                        >
                          {mentor?.userName}
                        </div>
                        <div className="openDiscussionUserrole">{mentor?.role}</div>
                        {mentor?.mentorExpertise?.length > 0 && (
                          <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>
                            {mentor.mentorExpertise.map(e => e.industry).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px",
                      }}
                    >
                      <div
                        title={onlineEmails.includes(mentor._id) ? "online" : "away"}
                        style={{ position: "relative", marginLeft: "10px" }}
                        className={onlineEmails.includes(mentor._id) ? "online" : "away"}
                      ></div>
                      <div style={{ marginLeft: "-16px", fontSize: "12px" }}>
                        {onlineEmails.includes(mentor._id) ? "online" : "away"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Show Discussion Team Members Section */}
          {post?.openDiscussionTeam?.length > 0 && (
            <>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#4F55C7",
                marginTop: mentors.length > 0 ? "15px" : "0",
                marginBottom: "10px",
                borderBottom: "1px solid #e0e0e0",
                paddingBottom: "8px"
              }}>
                Discussion Members ({post?.openDiscussionTeam?.length})
              </div>
              {post?.openDiscussionTeam?.map((p) => (
                <div className="openDiscussionUser" key={p._id}>
                  <div className="openDiscussionUserContainer">
                    <img
                      src={
                        p?.image !== "" &&
                        p?.image !== undefined &&
                        p?.image?.url !== ""
                          ? p?.image?.url
                          : "/profile.png"
                      }
                      alt=""
                      className="openDiscussionUserImage"
                    />

                    <div>
                      <div
                        className="openDiscussionUserName"
                        onClick={() => {
                          if (p._id == user_id) {
                            navigate("/editProfile");
                          } else {
                            navigate(`/user/${p._id}`);
                          }
                        }}
                      >
                        {p?.userName}
                      </div>
                      <div className="openDiscussionUserrole">{p?.role}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "10px",
                    }}
                  >
                    <div
                      title={onlineEmails.includes(p._id) ? "online" : "away"}
                      style={{ position: "relative", marginLeft: "10px" }}
                      className={onlineEmails.includes(p._id) ? "online" : "away"}
                    ></div>
                    <div style={{ marginLeft: "-16px", fontSize: "12px" }}>
                      {onlineEmails.includes(p._id) ? "online" : "away"}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Show empty state if no mentors and no discussion team */}
          {mentors.length === 0 && !post?.openDiscussionTeam?.length && !loadingMentors && (
            <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              No members available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
