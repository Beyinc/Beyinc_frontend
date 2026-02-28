import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ── Icon ───────────────────────── */
const BoltIcon = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4f55c7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

/* ── Welcome Screen ───────────────── */
const WelcomeScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ username from navigate state
    const userName =
        location.state?.userName ||
        localStorage.getItem("userName") ||
        "User";

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={styles.overlay}>
            <div style={styles.blobTopLeft} />
            <div style={styles.blobBottomRight} />

            <div
                style={{
                    ...styles.card,
                    opacity: visible ? 1 : 0,
                    transform: visible
                        ? "translateY(0) scale(1)"
                        : "translateY(24px) scale(0.97)",
                    transition: "opacity 0.55s ease, transform 0.55s ease",
                }}
            >
                {/* Welcome Content */}
                <div style={styles.content}>
                    <div style={styles.iconWrap}>
                        <BoltIcon />
                    </div>

                    <h1 style={styles.title}>
                        Welcome, {userName}
                    </h1>

                    <p style={styles.subtitle}>
                        Ready to connect and collaborate?
                    </p>

                    <div style={styles.buttonGroup}>
                        <button
                            style={styles.primaryBtn}
                            onClick={() => navigate("/quick-match")}
                        >
                            Quick Match
                        </button>

                        <button
                            style={styles.secondaryBtn}
                            onClick={() => navigate("/skill-search")}
                        >
                            Skill Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Styles ───────────────────────── */
const styles = {
    overlay: {
        position: "relative",
        height: "calc(100vh - 80px)",
        background:
            "linear-gradient(145deg, #f6f6fc 0%, #eeeef9 50%, #e5e6f5 100%)",
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
        background:
            "radial-gradient(circle, rgba(79,85,199,0.13) 0%, transparent 70%)",
        pointerEvents: "none",
    },

    blobBottomRight: {
        position: "absolute",
        bottom: "-80px",
        right: "-80px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background:
            "radial-gradient(circle, rgba(79,85,199,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
    },

    card: {
        background: "#ffffff",
        borderRadius: "20px",
        padding: "40px 28px",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center",
        boxShadow:
            "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px rgba(79,85,199,0.12)",
        border: "1px solid rgba(79,85,199,0.12)",
    },

    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
    },

    iconWrap: {
        background: "rgba(79,85,199,0.08)",
        padding: "14px",
        borderRadius: "50%",
    },

    title: {
        fontSize: "28px",
        fontWeight: "600",
        color: "#2c2f5a",
        margin: 0,
    },

    subtitle: {
        fontSize: "15px",
        color: "#6b6f9e",
    },

    buttonGroup: {
        display: "flex",
        gap: "12px",
        marginTop: "14px",
    },

    primaryBtn: {
        background: "#4f55c7",
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "500",
    },

    secondaryBtn: {
        background: "#f1f2ff",
        color: "#4f55c7",
        border: "1px solid rgba(79,85,199,0.25)",
        padding: "10px 18px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "500",
    },
};

export default WelcomeScreen;