import React, { useEffect } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const navigate = useNavigate();
  const { userName } = useSelector((store) => store.auth.loginDetails);

  // Redirect logged-in users directly to posts feed
  useEffect(() => {
    if (userName || localStorage.getItem("user")) {
      navigate("/posts");
    }
  }, [navigate, userName]);

  return (
    <div className="landing-wrapper">
      <div className="landing-card">
        {/* Logo top-right */}
        <div className="logo-corner">
          <img src="/Bloomr-login-logo.svg" alt="Bloomr Logo" />
        </div>

        {/* Heading */}
        <h1 className="landing-title">Welcome to Bloomr</h1>

        {/* Body */}
        <div className="landing-body">
          <p className="landing-lead">
            <strong>Join the community to:</strong>
          </p>
          <ul className="landing-bullets">
            <li>Match with people who share similar interests</li>
            <li>Learn from those who are one step ahead of you in the same journey.</li>
            <li>Find your perfect co-founder and connect!</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="landing-cta">
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login to Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
