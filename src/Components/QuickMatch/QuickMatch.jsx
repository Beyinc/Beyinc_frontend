import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import { setAllUsers } from "../../redux/Conversationreducer/ConversationReducer";
import MatchCard from "./MatchCard";
import GroupChatRoom from "./GroupChatRoom";
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
const scoreMatch = (me, other) => {
    let score = 0;
    const shared = { industries: [], skills: [], interests: [] };

    // Experience similarity (within 3 years)
    const myExp = parseInt(me.yearsOfExperience) || 0;
    const otherExp = parseInt(other.yearsOfExperience) || 0;
    if (Math.abs(myExp - otherExp) <= 3) score += 3;

    // Industry overlap
    const myIndustries = me.industries || [];
    const otherIndustries = other.industries || [];
    const commonInd = myIndustries.filter((i) => otherIndustries.includes(i));
    if (commonInd.length > 0) { score += 2; shared.industries = commonInd; }

    // Interest overlap
    const myInterests = me.interests || [];
    const otherInterests = other.interests || [];
    const commonInt = myInterests.filter((i) => otherInterests.includes(i));
    if (commonInt.length > 0) { score += 2; shared.interests = commonInt; }

    // Skill overlap
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

        setTimeout(() => {
            // Score every candidate
            const scored = candidates.map((user) => {
                const { score, shared } = scoreMatch(currentUser || {}, user);
                return { user, score, shared };
            });

            // Sort descending, take top 4 (group of 3-5 total incl. me)
            scored.sort((a, b) => b.score - a.score);
            const top = scored.slice(0, Math.min(4, scored.length));

            // Ensure at least some "matched" users even if score is 0 (demo fallback)
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
            setPhase(PHASES.CHATROOM); // jump straight into the room
        }, 3200);
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
                        <p className="qm-searching-title">Finding your best matches…</p>
                        <p className="qm-searching-sub">
                            Analysing experience, industry overlap, interests &amp; skills
                        </p>
                        <div className="qm-dots">
                            <span /><span /><span />
                        </div>
                    </div>
                )}


                {/* ── CHATROOM phase ───────────────────────────────── */}
                {phase === PHASES.CHATROOM && (
                    <>
                        <div className="qm-found-header" style={{ marginBottom: 16 }}>
                            <div className="qm-found-badge">
                                <SparkleIcon /> Live Room
                            </div>
                            <h2 className="qm-found-title" style={{ fontSize: 18 }}>
                                Your Quick Match Room
                            </h2>
                        </div>

                        <GroupChatRoom matchedUsers={matchedUsers} />

                        <div className="qm-skip" style={{ marginTop: 14 }}>
                            <a onClick={() => navigate("/posts")}>Go to feed</a>
                            &nbsp;·&nbsp;
                            <a onClick={() => setPhase(PHASES.IDLE)}>Start over</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuickMatch;
