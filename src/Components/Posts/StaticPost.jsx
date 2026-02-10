import React from "react";
// import "../Editprofile/Activities/Posts/Post.css";
import "./StaticPost.css";

function StaticPost() {
  return (
    <section className="">
      <div className="static-post-container ml-[-10px] mr-2 rounded-lg">
        {/* Bloomr Header */}
        <div className="static-post-header">
          <div className="bloomr-logo-section">
            <img
              src="/Bloomr-login-logo.svg"
              alt="Bloomr Logo"
              className="h-[160px] w-[320px]"
            />
            <div className="bloomr-text-section mt-[-54px] ml-[180px] font-gentium">
              <p className="bloomr-subtitle">
                Learn with founders one step ahead of you
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="static-post-content">
          <h1 className="static-post-main-title font-gentium">
            Welcome to Bloomr,{" "}
            <span className="underline-text">where ideas bloom!</span>
          </h1>

          <p className="static-post-description font-gentium">
            Starting up is easier than ever now. But knowing what to do next
            isn't. That's what this community is for. Here are some ground
            rules:
          </p>

          {/* Bullet Points */}
          <ul className="static-post-bullets">
            <li>Posts should include your idea and current bottleneck</li>
            <li>Contribute to others' threads—high-signal feedback only</li>
            <li>Live events and job/funding opportunities updated weekly</li>
          </ul>
        </div>

        {/* Divider */}
        <div className="static-post-divider"></div>
      </div>
    </section>
  );
}

export default StaticPost;
