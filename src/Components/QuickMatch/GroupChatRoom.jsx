import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const UsersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f55c7"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const GroupChatRoom = ({ matchedUsers }) => {
    const { username: myName, user_id: myId } = useSelector(
        (store) => store.auth.loginDetails
    );
    const currentUser = useSelector((store) => store.auth.userDetails);

    const myDisplayName =
        currentUser?.username || currentUser?.name || myName || "You";

    const [messages, setMessages] = useState([
        {
            id: "sys-welcome",
            type: "system",
            text: "Quick Match room created! You've been matched based on shared experience, industry, and skills.",
        },
        ...matchedUsers.map((u, i) => ({
            id: `sys-joined-${i}`,
            type: "system",
            text: `${u.username || u.name || "A user"} joined the room.`,
        })),
    ]);

    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const memberIds = matchedUsers.map((u) => u._id).filter(Boolean);
        if (memberIds.length > 0) {
            ApiServices.createGroupConversation?.({
                members: [myId, ...memberIds],
                type: "quickMatch",
            }).catch(() => {
                // Backend endpoint not yet implemented – silently ignore
            });
        }
    }, []);

    const formatTime = (date = new Date()) =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                type: "chat",
                senderId: "me",
                senderName: myDisplayName,
                text,
                time: formatTime(),
            },
        ]);
        setInput("");
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const allParticipants = [
        { _id: "me", name: myDisplayName, isMe: true, profileImage: currentUser?.profileImage },
        ...matchedUsers,
    ];

    const getInitials = (name = "") =>
        name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    return (
        <div className="gcr-wrapper">
            {/* ── Sidebar: participants ── */}
            <div className="gcr-sidebar">
                <div className="gcr-sidebar-header">Participants ({allParticipants.length})</div>
                <div className="gcr-participants">
                    {allParticipants.map((p) => (
                        <div key={p._id} className="gcr-participant">
                            <div className={`gcr-p-avatar ${p.isMe ? "you" : ""}`}>
                                {p.isMe ? "Y" : "?"}
                            </div>
                            <span className="gcr-p-name">
                                {p.isMe ? myDisplayName : "User"}
                            </span>
                            {p.isMe && <span className="gcr-p-you">You</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Chat area ── */}
            <div className="gcr-chat">
                {/* Header */}
                <div className="gcr-chat-header">
                    <div className="gcr-chat-header-icon">
                        <UsersIcon />
                    </div>
                    <div>
                        <h5>Quick Match Room</h5>
                        <p>{allParticipants.length} participants · AI-curated match</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="gcr-messages">
                    {messages.map((msg) =>
                        msg.type === "system" ? (
                            <div key={msg.id} className="gcr-system-msg">
                                {msg.text}
                            </div>
                        ) : (
                            <div
                                key={msg.id}
                                className={`gcr-msg ${msg.senderId === "me" ? "own" : "other"}`}
                            >
                                {msg.senderId !== "me" && (
                                    <span className="gcr-msg-sender">{msg.senderName}</span>
                                )}
                                <div className="gcr-msg-bubble">{msg.text}</div>
                                <span className="gcr-msg-time">{msg.time}</span>
                            </div>
                        )
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="gcr-input-area">
                    <textarea
                        ref={inputRef}
                        className="gcr-input"
                        placeholder="Type a message…"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button
                        className="gcr-send-btn"
                        onClick={handleSend}
                        disabled={!input.trim()}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatRoom;
