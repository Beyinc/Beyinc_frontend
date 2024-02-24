import React, {  useState, useEffect } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../Home/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const { email, role, userName, image, verification } = useSelector(
    (store) => store.auth.loginDetails
  );

  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease", // Easing options: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'ease-in-back', 'ease-out-back', 'ease-in-out-back'
    });
  }, []);

  const startingButtonContent = () => {
    if (isNavbarVisible) {
      return userName ? 'Home' : 'Get Started Now';
    } else {
      return 'Get Started Now';
    }
  };

  return (
    <div className="landingPage-container">
      {/*navbar */}
      <div
        className="landing-navbar"
        style={{
          display: localStorage.getItem("user") == undefined ? "flex" : "none",
        }}
      >
        <div className="Beyinc-logo">
          <img src="/logo.png" alt="logo" />
        </div>

        <div className="button-container">
          <div>
            <button
              className="signin-button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
          <div>
            <button
              className="signup-button"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* section-1 */}
      <section className="section-1">
        <div className="image-1-dummy" data-aos="fade-left">
          <img src="/business.png" />
        </div>
        <div className="content-1" data-aos="fade-right">
          <h1>
            Welcome to Social <br /> Entrepreneurship Platform
          </h1>
          <h2>Increasing the success rate of startup</h2>
          <button
          className="starting-button"
            onClick={() => navigate(userName ? '/dashboard' : '/signup')}
        >
          {startingButtonContent()}
        </button>
        </div>
        <div className="image-1" data-aos="fade-left">
          <img src="/business.png" />
        </div>
      </section>

      {/* section-2 */}
      <section className="section-2">
        <div className="image-2" data-aos="fade-right">
          <img src="/section-2.png" />
        </div>
        <div className="content-2" data-aos="fade-left">
          <h1>To whom is BeyInc for?</h1>
          <p>Anyone looking to start their entrepreneurial journey</p>

          <div className="logos">
            <i class="fas fa-user-tie"></i>Find a Mentor
          </div>
          <div>
            <i class="fas fa-users section-2-users"></i>Find a co-founder or
            technology partner
          </div>
          <div>
            <i class="fas fa-lightbulb"></i>Validate the ideas with crowd
            opinion
          </div>
        </div>
      </section>

      {/* section-3 */}

      <section className="section-3" data-aos="fade-up">
        <div>
          <h1>Discover different sectors all at one place</h1>
        </div>
        <div className="container">
          <div className="box" data-aos="fade-up">
            <i className="fas fa-microchip"></i> <h3>AI</h3>
            <p>
              Harness the power of artificial intelligence to revolutionize your
              industry.
            </p>
          </div>
          <div className="box" data-aos="fade-up" data-aos-delay="100">
            <i className="fas fa-car"></i>
            <h3>Electric Vehicles</h3>
            <p>
              Explore the future of transportation with cutting-edge electric
              vehicles.
            </p>
          </div>
          <div className="box" data-aos="fade-up" data-aos-delay="200">
            <i className="fas fa-heartbeat"></i>
            <h3>Healthcare</h3>
            <p>Discover innovative healthcare solutions that improve lives.</p>
          </div>
          <div className="box" data-aos="fade-up" data-aos-delay="300">
            <i className="fas fa-graduation-cap"></i>
            <h3>Education</h3>
            <p>
              Empower yourself with knowledge from the world's top educators.
            </p>
          </div>
          <div className="box" data-aos="fade-up" data-aos-delay="400">
            <i className="fas fa-robot"></i>
            <h3>Robotics</h3>
            <p>
              Unleash the potential of robotics for automation and efficiency.
            </p>
          </div>
          <div className="box" data-aos="fade-up" data-aos-delay="500">
            <i className="fas fa-chart-line"></i>
            <h3>Marketing</h3>
            <p>
              Reach your target audience and grow your business with effective
              marketing strategies.
            </p>
          </div>
          <div className="box" data-aos="fade-up" data-aos-delay="600">
            <i className="fas fa-building"></i>
            <h3>Business Administration</h3>
            <p>
              Gain the skills and knowledge to succeed in the business world.
            </p>
          </div>
          <div className="box" data-aos="fade-up" data-aos-delay="700">
            <i className="fas fa-tractor"></i>
            <h3>Agriculture</h3>
            <p>
              Discover sustainable and innovative solutions for the agricultural
              industry.
            </p>
          </div>
        </div>
      </section>
      {/* section-4 */}
      <section className="section-4">
        <div className="content-4" data-aos="fade-right">
          <h1 data-aos="fade-down">Features</h1>
          <p data-aos="fade-up">
            <i className="fas fa-check-square" data-aos="zoom-in"></i>{" "}
            Establishing trust by verification and green tick
          </p>
          <p data-aos="fade-up">
            <i className="fas fa-check-square" data-aos="zoom-in"></i> Explore
            Mentors of IITs, IIMs, NITs and Industry Experts
          </p>
          <p data-aos="fade-up">
            <i className="fas fa-check-square" data-aos="zoom-in"></i> Right
            match of Co-founders and Team Mates by skills, locations, Alumni
          </p>
          <p data-aos="fade-up">
            <i className="fas fa-check-square" data-aos="zoom-in"></i> Talk to
            Us any time on BeyInc Admin (Blue tick)
          </p>
          <p data-aos="fade-up">
            <i className="fas fa-check-square" data-aos="zoom-in"></i> Take
            feedback and achieve Market fit sooner
          </p>
          <p data-aos="fade-up">
            <i className="fas fa-check-square" data-aos="zoom-in"></i> Chat and
            do G meet with Entrepreneurs and Mentors
          </p>
          <p data-aos="fade-up">
            <i className="fas fa-check-square" data-aos="zoom-in"></i> Post the
            Pitch and see what people are saying about your ideas
          </p>
        </div>
        <div className="image-4" data-aos="fade-left">
          <img src="/section-4.png" />
        </div>
      </section>

      {/* section-5 */}
      {/* <section className="section-5" data-aos="fade-up">
        <h2>Why Choose BeyInc?</h2>
        <ul className="benefit-cards">
          <li className="benefit-card" data-aos="fade-right">
            <i className="fas fa-user-tie card-icon"></i>
            <h3>Expert Mentorship</h3>
            <p>
              Get guidance from experienced mentors from top institutions and
              industries.
            </p>
          </li>
          <li className="benefit-card" data-aos="fade-up">
            <i className="fas fa-handshake card-icon"></i>
            <h3>Meaningful Connections</h3>
            <p>
              Connect with like-minded entrepreneurs and build valuable
              partnerships.
            </p>
          </li>
          <li className="benefit-card" data-aos="fade-left">
            <i className="fas fa-users card-icon"></i>
            <h3>Supportive Community</h3>
            <p>
              Join a community of passionate individuals and learn from each
              other.
            </p>
          </li>
        </ul>
      </section> */}

      {/* section-6 */}

      <section className="section-6" data-aos="fade-up">
        <div className="content-6">
          <h2>Get Started in 5 Easy Steps</h2>
        </div>
        <div>
          <ul className="steps-list">
            <li data-aos="fade-right">
              <div className="step">
                <div>
                  <i className="fas fa-user-plus"></i>{" "}
                </div>
                <div className="step-content">
                  <h3>Sign Up</h3>
                  <p>
                    Create your profile and tell us about yourself and your
                    goals.
                  </p>
                </div>
              </div>
            </li>
            <li data-aos="fade-left">
              <div className="step">
                <div>
                  <i className="fas fa-id-card"></i>{" "}
                </div>
                <div className="step-content">
                  <h3>Complete Your Profile</h3>
                  <p>
                    Fill out your profile details and get verified for faster
                    connections.
                  </p>
                </div>
              </div>
            </li>
            <li data-aos="fade-right">
              <div className="step">
                <div>
                  <i className="fas fa-bullhorn"></i>{" "}
                </div>
                <div className="step-content">
                  <h3>Make Your Pitch</h3>
                  <p>
                    Share your idea or project and showcase your potential to
                    mentors and entrepreneurs.
                  </p>
                </div>
              </div>
            </li>
            <li data-aos="fade-left">
              <div className="step">
                <div>
                  <i className="fas fa-handshake"></i>{" "}
                </div>
                <div className="step-content">
                  <h3>Connect with Others</h3>
                  <p>
                    Send requests to mentors and entrepreneurs to discuss your
                    ideas and collaborate.
                  </p>
                </div>
              </div>
            </li>
            <li data-aos="fade-right">
              <div className="step">
                <div>
                  <i className="fas fa-comments"></i>{" "}
                </div>
                <div className="step-content">
                  <h3>Start the Conversation</h3>
                  <p>
                    Chat or Google Meet with your connections to build
                    relationships and move forward.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
