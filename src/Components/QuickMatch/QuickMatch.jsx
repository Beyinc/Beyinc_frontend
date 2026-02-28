import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import { setAllUsers } from "../../redux/Conversationreducer/ConversationReducer";
import MatchCard from "./MatchCard";
import "./quickMatch.css";

/* ── Icons ──────────────────────────────────────────────────── */
const BoltIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f55c7"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);
const SparkleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f55c7"
        stroke="#4f55c7" strokeWidth="0.5">
        <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4.8 2.4-7.3L2 9.2h7.6z" />
    </svg>
);

/* ── Matching algorithm ──────────────────────────────────────── */

/* ── Component ───────────────────────────────────────────────── */
const PHASES = { IDLE: "idle", SEARCHING: "searching", MATCHED: "matched", CHATROOM: "chatroom" };

const QuickMatch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const allUsers = useSelector((store) => store.conv.allUsers);
    const currentUser = useSelector((store) => store.auth.userDetails);
    const { user_id: myId } = useSelector((store) => store.auth.loginDetails);

    const [phase, setPhase] = useState(PHASES.IDLE);
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [matchScores, setMatchScores] = useState({});
    const [quickMatchRoom, setQuickMatchRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all users if not yet in redux
    useEffect(() => {
        if (!allUsers || allUsers.length === 0) {
            ApiServices.getAllUsers({ type: "" })
                .then((res) => dispatch(setAllUsers(res.data)))
                .catch(() => { });
        }
    }, []);

    const candidates = useMemo(
        () => allUsers.filter((u) => u._id !== myId && u._id !== undefined),
        [allUsers, myId]
    );

    const runMatch = () => {
        setPhase(PHASES.SEARCHING);
        setIsLoading(true);

        ApiServices.quickMatch({})
            .then((res) => {
                console.log("Quick Match API Response:", res);
                
                // Store the room data from API
                if (res && res.room) {
                    setQuickMatchRoom(res.room);
                }
                
                // Simulate loading time for UX
                setTimeout(() => {
                    setPhase(PHASES.MATCHED);
                    setIsLoading(false);
                }, 800);
            })
            .catch((err) => {
                console.error("Quick Match Error:", err);
                alert("Failed to create quick match room. Please try again.");
                setPhase(PHASES.IDLE);
                setIsLoading(false);
            });
    };

    const handleJoinRoom = async () => {
        try {
            // Call join room API
            const response = await ApiServices.joinQuickMatchRoom({
                roomId: quickMatchRoom._id,
            });
            
            console.log("Joined room:", response);
            
            // Redirect to chat
            navigate(`/quickMatch/chat/${quickMatchRoom._id}`);
        } catch (err) {
            console.error("Join room error:", err);
            alert("Failed to join room. Please try again.");
        }
    };

    return (
        <div className="qm-page">
            <div className="qm-card">

                {/* ── IDLE phase ───────────────────────────────────── */}
                {phase === PHASES.IDLE && (
                    <>
                        <div className="qm-icon-badge"><BoltIcon /></div>
                        <h1 className="qm-title">Quick Match</h1>
                        <p className="qm-subtitle">
                            Get matched with 3–5 founders, mentors, and entrepreneurs who share
                            your experience, industry, and skills — all in one live group room.
                        </p>

                        <div className="qm-criteria">
                            <h4>How we match you</h4>
                            <ul>
                                <li>Similar years of experience</li>
                                <li>Overlapping industry / sector</li>
                                <li>At least one common interest</li>
                                <li>Shared skills or expertise areas</li>
                            </ul>
                        </div>

                        <button className="qm-btn-primary" onClick={runMatch}>
                            <BoltIcon />
                            Find My Match
                        </button>

                        <div className="qm-skip">
                            <a onClick={() => navigate("/posts")}>Skip and go to feed →</a>
                        </div>
                    </>
                )}

                {/* ── SEARCHING phase ──────────────────────────────── */}
                {phase === PHASES.SEARCHING && (
                    <div className="qm-searching">
                        <div className="qm-radar">
                            <div className="qm-radar-ring" />
                            <div className="qm-radar-ring" />
                            <div className="qm-radar-ring" />
                            <div className="qm-radar-core" />
                        </div>
                        <p className="qm-searching-title">Creating your match room…</p>
                        <p className="qm-searching-sub">
                            Connecting you with compatible participants
                        </p>
                        <div className="qm-dots">
                            <span /><span /><span />
                        </div>
                    </div>
                )}

                {/* ── MATCHED phase ─ SHOW ROOM WITH JOIN BUTTON ──────────────── */}
                {phase === PHASES.MATCHED && quickMatchRoom && (
                    <>
                        <div className="qm-found-header" style={{ marginBottom: 16 }}>
                            <div className="qm-found-badge">
                                <SparkleIcon /> Live Room
                            </div>
                            <h2 className="qm-found-title" style={{ fontSize: 18 }}>
                                {quickMatchRoom.name}
                            </h2>
                            <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                                {quickMatchRoom.participants?.length || 0} participant{quickMatchRoom.participants?.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div style={{ marginBottom: 16, padding: 12, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
                            <h4 style={{ marginBottom: 8, fontSize: 13, fontWeight: 600 }}>Room Details</h4>
                            <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                                <strong>Room ID:</strong> {quickMatchRoom._id}
                            </p>
                            <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                                <strong>Status:</strong> {quickMatchRoom.isLocked ? "Locked" : "Open"}
                            </p>
                            {quickMatchRoom.sharedSkills?.length > 0 && (
                                <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                                    <strong>Shared Skills:</strong> {quickMatchRoom.sharedSkills.join(", ")}
                                </p>
                            )}
                            {quickMatchRoom.sharedIndustries?.length > 0 && (
                                <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                                    <strong>Shared Industries:</strong> {quickMatchRoom.sharedIndustries.join(", ")}
                                </p>
                            )}
                            {quickMatchRoom.participants?.length > 0 && (
                                <p style={{ fontSize: 12, color: "#666" }}>
                                    <strong>Participants:</strong> {quickMatchRoom.participants.length}
                                </p>
                            )}
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                            <button
                                onClick={handleJoinRoom}
                                className="qm-btn-primary"
                                style={{ flex: 1 }}
                            >
                                Join Group
                            </button>
                            <button
                                onClick={() => {
                                    setPhase(PHASES.IDLE);
                                    setQuickMatchRoom(null);
                                }}
                                style={{
                                    flex: 1,
                                    padding: "10px 20px",
                                    backgroundColor: "#f0f0f0",
                                    color: "#333",
                                    border: "1px solid #ddd",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    transition: "all 0.3s"
                                }}
                            >
                                Different Match
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuickMatch;
