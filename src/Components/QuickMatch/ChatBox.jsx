import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { socket_io } from "../../Utils";
import { ApiServices } from "../../Services/ApiServices";
import "./chatBox.css";

const ChatBox = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector((store) => store.auth.userDetails);

   const { image, userName, role, user_id, email } = useSelector(
      (state) => state.auth.loginDetails
    );
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Initialize socket connection and setup listeners FIRST
  useEffect(() => {
    socket.current = io(socket_io);

    socket.current.on("connect", () => {
      console.log("✅ Socket connected:", socket.current.id);
    });

    socket.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // Setup listeners BEFORE joining room
    const handleNewMessage = (messageData) => {
      console.log("📨 Received message via socket:", messageData);
      setMessages((prev) => {
        // Avoid duplicates by checking message ID or content
        const exists = prev.some(
          (m) => m._id === messageData._id || 
          (m.senderId === messageData.senderId && 
           m.message === messageData.message && 
           Math.abs(new Date(m.createdAt) - new Date(messageData.createdAt)) < 1000)
        );
        if (exists) {
          console.log("⚠️ Duplicate message ignored");
          return prev;
        }
        return [...prev, messageData];
      });
    };

    const handleParticipantsUpdate = (data) => {
      console.log("👥 Participants updated via socket:", data);
      setParticipants(data.participants || []);
    };

    socket.current.on("receiveQuickMatchMessage", handleNewMessage);
    socket.current.on("roomParticipantsUpdated", handleParticipantsUpdate);

    console.log("🎧 Socket listeners attached");

    return () => {
      socket.current?.off("receiveQuickMatchMessage", handleNewMessage);
      socket.current?.off("roomParticipantsUpdated", handleParticipantsUpdate);
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Load room data and join socket room
  useEffect(() => {
    const setup = async () => {
      try {
        setLoading(true);

        // Fetch room details
        const roomData = await ApiServices.getQuickMatchRoomDetails(roomId);
        console.log("📦 Room data response:", roomData);
        
        // Handle different response structures
        const room = roomData.room || roomData;
        setRoomDetails(room);

        // Fetch existing messages
        const messagesData = await ApiServices.getQuickMatchMessages(roomId);
        console.log("💬 Messages data response:", messagesData);
        setMessages(Array.isArray(messagesData) ? messagesData : []);

        // Set participants from room data
        if (roomData.participants && roomData.participants.length > 0) {
          setParticipants(roomData.participants);
        } else if (room?.participants && room.participants.length > 0) {
          setParticipants(room.participants);
        }

        // Join the room via socket (only after socket is connected)
        if (socket.current && socket.current.connected) {
          socket.current.emit("joinQuickMatchRoom", { roomId, userId: user_id });
        }

        setLoading(false);
      } catch (err) {
        console.error("Setup error:", err);
        alert("Failed to load chat room");
        navigate("/quick-match");
      }
    };

    if (roomId && user_id) {
      setup();
    }

    return () => {
      if (socket.current && roomId && user_id) {
        socket.current.emit("leaveQuickMatchRoom", { roomId, userId: user_id });
      }
    };
  }, [roomId, user_id, navigate]);

  // Polling fallback: Fetch new messages every 3 seconds in case socket delivery fails
  useEffect(() => {
    if (!roomId) return;

    const pollMessages = async () => {
      try {
        const messagesData = await ApiServices.getQuickMatchMessages(roomId);
        setMessages(Array.isArray(messagesData) ? messagesData : []);
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    const pollInterval = setInterval(pollMessages, 3000);
    return () => clearInterval(pollInterval);
  }, [roomId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      roomId,
      senderId: user_id,
      senderName: currentUser?.username || "Anonymous",
      message: inputMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    // Clear input immediately for better UX
    setInputMessage("");

    try {
      // FIRST: Save message to database via API
      console.log("📤 Saving message to database...");
      const savedMessage = await ApiServices.sendQuickMatchMessage(messageData);
      console.log("✅ Message saved:", savedMessage);

      // SECOND: Emit via socket for real-time broadcast to other users
      if (socket.current && socket.current.connected) {
        console.log("📡 Broadcasting message via socket...");
        socket.current.emit("sendQuickMatchMessage", savedMessage);
      }
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setInputMessage(messageData.message); // Restore message on error
    }
  };

  if (loading) {
    return (
      <div className="chatbox-container">
        <div className="loading">Loading chat room...</div>
      </div>
    );
  }

  return (
    <div className="chatbox-container">
      {/* Header */}
      <div className="chatbox-header">
        <div className="header-info">
          <h2>{roomDetails?.name || "Quick Match Room"}</h2>
          <p className="participants-info">
            {participants.length} participant{participants.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="close-btn"
          onClick={() => {
            navigate("/quick-match");
          }}
        >
          ✕
        </button>
      </div>

      {/* Room Info */}
      <div className="room-info">
        {roomDetails?.sharedSkills?.length > 0 && (
          <div className="info-section">
            <strong>Skills:</strong> {roomDetails.sharedSkills.join(", ")}
          </div>
        )}
        {roomDetails?.sharedIndustries?.length > 0 && (
          <div className="info-section">
            <strong>Industries:</strong> {roomDetails.sharedIndustries.join(", ")}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            // Debug logs to check values
            console.log("Message:", msg);
            console.log("senderId:", msg.senderId, "Type:", typeof msg.senderId);
            console.log("user_id:", user_id, "Type:", typeof user_id);
            
            // Convert both to strings for comparison (handles ObjectId)
            const isSent = String(msg.senderId) === String(user_id);
            console.log("Is sent?", isSent);
            
            return (
              <div
                key={msg._id || idx}
                className={`message ${isSent ? "sent" : "received"}`}
              >
                <div className="message-sender">
                  {msg.senderName || msg.senderId?.userName || "Anonymous"}
                </div>
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          className="send-btn"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
