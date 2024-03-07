import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src="/Footer-Logo.png" alt="logo" />
      </div>
      <div className="footer-content">
        {/* <nav>
        <h2>Quick Links</h2>
        <ul>
          <li>
            <a href="#about">
              <i class="fas fa-info-circle"></i> About
            </a>
          </li>
          <li>
            <a href="#contact">
              <i class="fas fa-envelope"></i> Contact
            </a>
          </li>
          <li>
            <a href="#services">
              <i class="fas fa-cogs"></i> Services
            </a>
          </li>
          <li>
            <a href="#collaborators">
              <i class="fas fa-users"></i> Our Collaborators
            </a>
          </li>
        </ul>
      </nav> */}

        <nav>
          <h2>Say Hello</h2>
          <ul>
            <li>
              <i className="fas fa-map-marker-alt"></i>Block 5, FG , Jains Pebble Brook Phase 1 , Thoraipakkam , chennai - 600097
            </li>
            <li>
              <i className="fas fa-envelope"></i>admin@beyinc.org
            </li>

            {/* <div className="icons">
            <i className="fab fa-linkedin"></i>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
          </div> */}
          </ul>
          <p className="copyright">
            Copyright &copy; 2024 BeyInc. All Rights Reserved.
          </p>
        </nav>

        {/* <nav>
        <h2>Legal Information</h2>
        <ul>
          <li>
            <i class="fas fa-shield-alt"></i> Privacy Policy
          </li>
          <li>
            <i class="fas fa-file-contract"></i> Terms of Service
          </li>
          <li>
            <i class="fas fa-cookie-bite"></i> Cookie Policy
          </li>
        </ul>
      </nav> */}
      </div>
    </footer>
  );
};

export default Footer;
