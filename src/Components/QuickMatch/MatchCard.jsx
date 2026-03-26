import React from "react";

const MatchCard = ({ user, sharedIndustries, sharedSkills, sharedInterests, score, delay = 0 }) => {
    const initials = (user.username || user.name || "?")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="mc-card" style={{ animationDelay: `${delay}ms` }}>
            {/* Avatar */}
            <div className="mc-avatar">
                {user.profileImage ? (
                    <img src={user.profileImage} alt={user.username} />
                ) : (
                    initials
                )}
            </div>

            {/* Info */}
            <div className="mc-info">
                <p className="mc-name">{user.username || user.name || "User"}</p>
                <p className="mc-role">
                    {[user.beyincProfile, user.role_level].filter(Boolean).join(" · ") ||
                        "Beyinc Member"}{" "}
                    {user.yearsOfExperience ? `· ${user.yearsOfExperience}y exp` : ""}
                </p>

                {/* Shared tags */}
                <div className="mc-tags">
                    {sharedIndustries.slice(0, 2).map((ind) => (
                        <span key={ind} className="mc-tag industry">
                            {ind}
                        </span>
                    ))}
                    {sharedSkills.slice(0, 2).map((sk) => (
                        <span key={sk} className="mc-tag skill">
                            {sk}
                        </span>
                    ))}
                    {sharedInterests.slice(0, 1).map((int) => (
                        <span key={int} className="mc-tag interest">
                            {int}
                        </span>
                    ))}
                </div>
            </div>

            {/* Score badge */}
            <span className="mc-score">+{score} match</span>
        </div>
    );
};

export default MatchCard;
