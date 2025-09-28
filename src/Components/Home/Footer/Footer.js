import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src="/footer-logo-final.png" alt="logo" />
      </div>
      <div className="footer-content">
        <nav>
          <h2>Quick Links</h2>
          <ul>
            <li>
              <a href="/BeyIncprivacypolicy#about">
                <i class="fas fa-info-circle"></i> About
              </a>
            </li>
            <li>
              <a href="BeyIncprivacypolicy#contact">
                <i class="fas fa-envelope"></i> Contact
              </a>
            </li>
            <li>
              <a href="BeyIncprivacypolicy#Privacy-Policy"><i className="fas fa-shield-alt"></i> Privacy Policy</a>  
              </li>
              <li>
               <a href="BeyIncprivacypolicy#Terms-&-Conditions"><i className="fas fa-file-contract"></i> Terms & Conditions</a> 
              </li>
          </ul>
        </nav>

        <nav>
          <h2>Say Hello</h2>
          <ul>
            <li>
              <i className="fas fa-map-marker-alt"></i>Block 5, FG , Jains
              Pebble Brook Phase 1 ,<br/> Thoraipakkam , chennai - 600097, India
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
        </nav>

        <nav>
          <nav>
            <h2>Legal Information</h2>
            <ul>
              <li>
             <a href="BeyIncprivacypolicy#product-pricing"><i className="fas fa-money-bill-alt"></i> Product Pricing</a> 
              </li>
              <li>
              <a href="BeyIncprivacypolicy#refund-policy"><i className="fas fa-hand-holding-usd"></i> Refund Policy</a> 
              </li>
              <li>
              <a href="BeyIncprivacypolicy#cancellation-policy"> <i className="fas fa-calendar-times"></i> Cancellation Policy</a>
              </li>
              <li>
              <a href="BeyIncprivacypolicy#shipping-and-delivery"><i className="fas fa-shipping-fast"></i> Shipping and Delivery</a>
              </li>
            </ul>
          </nav>
        </nav>
      </div>
      <p className="copyright">
        Copyright &copy; 2024 Bloomr Entrepreneurship Venture Private Limited. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
