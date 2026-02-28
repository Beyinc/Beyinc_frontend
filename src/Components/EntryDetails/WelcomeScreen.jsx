import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { setAllUsers } from "../../redux/Conversationreducer/ConversationReducer";
import GroupChatRoom from "../QuickMatch/GroupChatRoom";
import "../QuickMatch/quickMatch.css";

/* ── Icons ─────────────────────────────────────── */
const BoltIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f55c7"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

/* ── Matching algorithm ─────────────────────────── */
const scoreMatch = (me, other) => {
    let score = 0;
    const shared = { industries: [], skills: [], interests: [] };

    const myExp = parseInt(me.yearsOfExperience) || 0;
    const otherExp = parseInt(other.yearsOfExperience) || 0;
    if (Math.abs(myExp - otherExp) <= 3) score += 3;

    const myIndustries = me.industries || [];
    const otherIndustries = other.industries || [];
    const commonInd = myIndustries.filter((i) => otherIndustries.includes(i));
    if (commonInd.length > 0) { score += 2; shared.industries = commonInd; }

    const myInterests = me.interests || [];
    const otherInterests = other.interests || [];
    const commonInt = myInterests.filter((i) => otherInterests.includes(i));
    if (commonInt.length > 0) { score += 2; shared.interests = commonInt; }

    const mySkills = [
        ...(me.expertise || []),
        ...Object.values(me.mentorExpertise || {}).flat(),
    ];
    const otherSkills = [
        ...(other.expertise || []),
        ...Object.values(other.mentorExpertise || {}).flat(),
    ];
    const commonSkills = mySkills.filter((s) => otherSkills.includes(s));
    if (commonSkills.length > 0) { score += 3; shared.skills = commonSkills; }

    return { score, shared };
};

const PHASES = { IDLE: "idle", SEARCHING: "searching", CHATROOM: "chatroom" };

/* ── WelcomeScreen ─────────────────────────────── */
const WelcomeScreen = ({ userName }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [phase, setPhase] = useState(PHASES.SEARCHING); // Start in SEARCHING phase
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [matchScores, setMatchScores] = useState({});

    const allUsers = useSelector((store) => store.conv.allUsers);
    const currentUser = useSelector((store) => store.auth.userDetails);
    const { user_id: myId } = useSelector((store) => store.auth.loginDetails);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!allUsers || allUsers.length === 0) {
            ApiServices.getAllUsers({ type: "" })
                .then((res) => dispatch(setAllUsers(res.data)))
                .catch(() => { });
        }
    }, [dispatch, allUsers]);

    const candidates = useMemo(
        () => (allUsers || []).filter((u) => u._id !== myId && u._id !== undefined),
        [allUsers, myId]
    );

    useEffect(() => {
        // Run match only once when allUsers is populated and candidates are available
        if (candidates.length > 0 && phase === PHASES.SEARCHING) {
            const timerId = setTimeout(() => {
                const scored = candidates.map((user) => {
                    const { score, shared } = scoreMatch(currentUser || {}, user);
                    return { user, score, shared };
                });
                scored.sort((a, b) => b.score - a.score);
                const top = scored.slice(0, Math.min(4, scored.length));
                const picks = top.length > 0 ? top : scored.slice(0, Math.min(2, scored.length));

                const users = picks.map((p) => p.user);
                const scores = {};
                const shared = {};
                picks.forEach((p) => {
                    scores[p.user._id] = p.score;
                    shared[p.user._id] = p.shared;
                });

                setMatchedUsers(users);
                setMatchScores({ scores, shared });
                setPhase(PHASES.CHATROOM);
            }, 3200);

            return () => clearTimeout(timerId);
        }
    }, [candidates, currentUser, phase]);

    return (
        <div style={styles.overlay}>
            {/* Decorative blobs */}
            <div style={styles.blobTopLeft} />
            <div style={styles.blobBottomRight} />

            <div
                style={{
                    ...styles.card,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                    transition: "opacity 0.55s ease, transform 0.55s ease",
                }}
            >


                {/* ── SEARCHING ──────────────────────────── */}
                {phase === PHASES.SEARCHING && (
                    <div className="qm-searching">
                        <div className="qm-radar">
                            <div className="qm-radar-ring" />
                            <div className="qm-radar-ring" />
                            <div className="qm-radar-ring" />
                            <div className="qm-radar-core" />
                        </div>
                        <p className="qm-searching-title">Finding your best matches…</p>
                        <p className="qm-searching-sub">
                            Analysing experience, industry overlap, interests &amp; skills
                        </p>
                        <div className="qm-dots">
                            <span /><span /><span />
                        </div>
                    </div>
                )}

                {/* ── CHATROOM ───────────────────────────── */}
                {phase === PHASES.CHATROOM && (
                    <>


                        <GroupChatRoom matchedUsers={matchedUsers} />

                        <div style={styles.skip}>
                            <span style={styles.skipLink} onClick={() => navigate("/posts")}>Go to feed</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ─── Inline styles ──────────────────────────────────────────────────────── */
const styles = {
    overlay: {
        position: "relative",
        height: "calc(100vh - 80px)",
        background: "linear-gradient(145deg, #f6f6fc 0%, #eeeef9 50%, #e5e6f5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
    },
    blobTopLeft: {
        position: "absolute",
        top: "-80px",
        left: "-80px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,85,199,0.13) 0%, transparent 70%)",
        pointerEvents: "none",
    },
    blobBottomRight: {
        position: "absolute",
        bottom: "-80px",
        right: "-80px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,85,199,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
    },
    card: {
        position: "relative",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "24px",
        maxWidth: "760px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px rgba(79,85,199,0.12)",
        border: "1px solid rgba(79,85,199,0.12)",
    },

    skip: {
        marginTop: "16px",
        fontSize: "13px",
        color: "#6b6f9e",
    },
    skipLink: {
        cursor: "pointer",
        color: "#4f55c7",
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        textUnderlineOffset: "3px",
    },
};

export default WelcomeScreen;
