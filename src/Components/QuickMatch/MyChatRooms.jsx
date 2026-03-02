import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import ChatBoxNew from "./ChatBoxNew";
import "./myChatRooms.css";

const MyChatRooms = () => {
  const { user_id } = useSelector((state) => state.auth.loginDetails);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await ApiServices.getUserRooms();
        setRooms(data.rooms || []);
        if (data.rooms && data.rooms.length > 0) {
          setSelectedRoomId(data.rooms[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        setError("Failed to load chat rooms");
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchRooms();
    }
  }, [user_id]);

  const truncateText = (text, length = 30) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const getLastMessagePreview = (room) => {
    if (!room.lastMessage) return "No messages yet";
    return truncateText(room.lastMessage.message);
  };

  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMs = now - messageDate;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return messageDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="my-chat-rooms-container">
        <div className="loading">Loading your chat rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-chat-rooms-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-chat-rooms-container">
      {/* LEFT SIDEBAR - 30% */}
      <div className="rooms-sidebar">
        <div className="sidebar-header">
          <h2>My Chat Rooms</h2>
          <p className="rooms-count">{rooms.length} active</p>
        </div>

        {rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No active chat rooms</p>
            <p className="subtext">Join or create a room to start chatting!</p>
          </div>
        ) : (
          <div className="rooms-list">
            {rooms.map((room) => (
              <div
                key={room._id}
                className={`room-item ${
                  selectedRoomId === room._id ? "active" : ""
                }`}
                onClick={() => setSelectedRoomId(room._id)}
              >
                <div className="room-item-header">
                  <h3 className="room-name">{room.name}</h3>
                  <span className="room-time">
                    {room.lastMessage
                      ? formatDate(room.lastMessage.createdAt)
                      : ""}
                  </span>
                </div>

                <div className="room-item-body">
                  <p className="last-message">
                    {room.lastMessage?.senderId?.userName || "System"}:{" "}
                    {getLastMessagePreview(room)}
                  </p>
                </div>

                <div className="room-item-footer">
                  <span className="participants-badge">
                    {room.participants?.length || 0} members
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT CONTENT - 70% */}
      <div className="chat-content">
        {selectedRoomId ? (
          <ChatBoxNew roomId={selectedRoomId} />
        ) : (
          <div className="no-room-selected">
            <div className="empty-state">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <p>Select a room to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChatRooms;
