// PrivacyPolicy.js

import React from 'react';
import "./PrivacyPolicy.css";
import Footer from "../../Home/Footer/Footer";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();
   
  return (
    <div className="privacy-policy-main-container">
      <navbar className="navbar">
        <img
          src="logo.png"
          style={{
            cursor: "pointer",
            height: "auto",
            width: "120px",
            marginRight: "60px",
          }}
        onClick={() => {
          navigate("/");
        }}
        />
        <ul>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a href="#Privacy-Policy">Privacy Policy</a>
          </li>
          <li>
            <a href="#Terms-&-Conditions">Terms & Conditions</a>
          </li>
          <li>
            <a href="#product-pricing">Product Pricing</a>
          </li>
          <li>
            <a href="#refund-policy">Refund Policy</a>
          </li>
          <li>
            <a href="#cancellation-policy">Cancellation Policy</a>
          </li>
          <li>
            <a href="#shipping-and-delivery">Shipping and Delivery</a>
          </li>
        </ul>
      </navbar>

      <div className="privacy-policy-section-container">
        <section id="about">
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <h2>About</h2>
          <div className="Privacy-Policy-Image-Container">
            <img src="/About.png"/>
        </div>
          <p>
            BeyInc is  a social entrepreneurship platform bringing entrepreneurs,
            mentors, investors and other stakeholders at one place and catering
            early-stage startup to increase their success rate from 10 % to
            potentially 50%. At BeyInc, we pride ourselves on providing
            unmatched collaboration opportunities that stand apart from any
            other.
          </p>
         
        </section>
<Divider />
        <section id="contact">
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
  <h2>Contact</h2>
  <div className="Privacy-Policy-Image-Container">
            <img src="/Address.png"/>
        </div>
  <div class="cofounders-container">
    <div class="cofounder-card">
      <img src="/CEO.jpg" alt="Cofounder 1 Image" class="cofounder-image rounded-image"/>
      <div class="cofounder-info">
        <h3>Sudhanshu S Kanha</h3>
        <p>Founder & CEO</p>
        <p>MS ,Ocean Engg, IIT Madras ‘23</p>
        <a href="mailto:sudhanshukanha123@gmail.com">sudhanshukanha123@gmail.com</a>
        <br/>
        <a href="tel:+917091973974">+91 7091973974</a>
      </div>
    </div>
    <div class="cofounder-card">
      <img src="/CXO.jpg" alt="Cofounder 2 Image" class="cofounder-image rounded-image"/>
      <div class="cofounder-info">
        <h3>Abhishek Gupta</h3>
        <p>Co-founder & CXO</p>
        <p>MS ,DoMS, IIT Madras ‘23</p>
        <a href="mailto:abhishek.guptaag2@gmail.com ">abhishek.guptaag2@gmail.com </a>
        <br/>
        <a href="tel:+918310868561">+91 8310868561</a>
      </div>
    </div>

    <div class="cofounder-card">
      <img src="/CTO.jpg" alt="Cofounder 3 Image" class="cofounder-image rounded-image"/>
      <div class="cofounder-info">
        <h3>Shankar Mukesh Y</h3>
        <p>Co-founder & CTO</p>
        <p>JNTUA, Anantapur</p>
        <a href="mailto:abhishek@beyinc.org">ysankarmukesh@gmail.com </a>
        <br/>
      </div>
    </div>
    </div>
  <p>
    If you have any questions about BeyInc, please contact us at
    <span></span><a href="mailto:admin@beyinc.org">admin@beyinc.org</a>.
    <br />
    <b>Address:</b>
    <br />
    Jains Pebble Brook,<br/>
    Phase 1, Thoraipakkam,<br/>
    Chennai -600097, India
  </p>
</section>


        <Divider />

        <section id="Privacy-Policy">
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <h2>Privacy Policy</h2>
          <p>
            Beyinc is committed to protecting the privacy of our users. This
            Privacy Policy describes how we collect, use, and disclose
            information when you use our website{" "}
            <a href="https://www.beyinc.org/">https://www.beyinc.org/</a> and
            any related services.
            <div className="Privacy-Policy-Image-Container">
            <img src="/Privacy.png"/>
        </div>
          </p>
          <h3>Information We Collect</h3>
          <p>
            We may collect personal information that you provide to us when you
            interact with our website, such as when you fill out a contact form
            or sign up for our newsletter. This may include your name, email
            address, and any other information you choose to provide.
            <br />
            We may also collect non-personal information automatically when you
            visit our website, such as your IP address, browser type, and
            operating system.
          </p>
          <h3>How We Use Your Information</h3>
          <p>
            We may use the information we collect for various purposes,
            including:
            <ul>
              <li>To provide and maintain our services</li>
              <li>
                To communicate with you about your account or our services
              </li>
              <li>To improve our website and services</li>
              <li>To personalize your experience</li>
              <li>To analyze how our website is used</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </p>
          <h3>Disclosure of Information</h3>
          <p>
            We may disclose your personal information to third parties who
            provide services on our behalf, such as hosting providers or payment
            processors. We may also disclose your information if required by law
            or to protect our rights or the rights of others.
          </p>
          <h3>Third-Party Links</h3>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices or content of those websites.
          </p>
          <h3>Security</h3>
          <p>
            We take reasonable measures to protect the security of your
            information, but no method of transmission over the Internet or
            electronic storage is 100% secure.
          </p>
          <h3>Changes to this Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and the effective date will be updated.
          </p>
        </section>

        <Divider />

        <section id="Terms-&-Conditions">
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <h2>Terms & Conditions</h2>
          <div className="Privacy-Policy-Image-Container">
            <img src="/Terms.png"/>
        </div>
          <p>
            <strong>User Agreement:</strong> By using beyinc.org, you agree to
            abide by these terms and conditions. If you do not agree with any
            part of these terms, you may not use the platform.
            <br />
            <strong>Age Requirement:</strong> Users must be at least 13 years
            old to create an account on beyinc.org.
            <br />
            <strong>Content Ownership:</strong> You retain ownership of the
            content you post on beyinc.org. However, by posting content, you
            grant beyinc.org a non-exclusive, worldwide, royalty-free license to
            use, reproduce, modify, adapt, publish, translate, distribute, and
            display such content.
            <br />
            <strong>Privacy Policy:</strong> Our privacy policy outlines how we
            collect, use, and protect your personal information. By using
            beyinc.org, you consent to the collection and use of your data in
            accordance with our privacy policy.
            <br />
            <strong>Community Guidelines:</strong> Users are expected to adhere
            to our community guidelines, which prohibit hate speech, harassment,
            nudity, violence, and other forms of prohibited content. Users who
            violate these guidelines may have their accounts suspended or
            terminated.
            <br />
            <strong>Copyright:</strong> Users may not post copyrighted material
            on beyinc.org without permission from the copyright holder. We have
            a system in place for reporting copyright violations, and accounts
            found to be in violation may be subject to suspension or
            termination.
            <br />
            <strong>Account Suspension/Termination:</strong> beyinc.org reserves
            the right to suspend or terminate accounts that violate these terms
            and conditions or our community guidelines.
            <br />
            <strong>Third-party Links and Apps:</strong> Users should exercise
            caution when clicking on links or using third-party apps within
            beyinc.org. These external links and apps are not under our control,
            and we are not responsible for any content or actions associated
            with them.
            <br />
            <strong>Confidentiality & Intellectual Property:</strong> Users
            (such as mentors, investors) are kindly requested to ensure the
            protection of sensitive startup-related data and documents from any
            unauthorized disclosure or use. All intellectual property resulting
            from collaboration between BeyInc, Mentors, and start-ups or
            stakeholders of any kind during the mentorship or investments shall
            be jointly owned unless explicitly agreed otherwise in written
            documentation.
            <br />
            <strong>Non-Compete:</strong> Mentors/investors agree not to partake
            in similar mentorship/investment activities that may directly
            compete with BeyInc during the MOU term, except within their
            existing institutional roles. They are required to disclose all
            engagements with startups outside of BeyInc's platforms to ensure
            transparency and compliance. Mentors/investors are kindly requested
            to refrain from guiding/investing in any other startup on the BeyInc
            platform through personal approaches unless done via the specified
            channels.
            <br />
            <strong>Changes to Terms:</strong> beyinc.org may update these terms
            and conditions from time to time. Users will be notified of any
            changes, and continued use of the platform constitutes acceptance of
            the updated terms.
          </p>
        </section>

        <Divider />

        <section id="product-pricing">
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <h2>Product Pricing</h2>
          <div className="Privacy-Policy-Image-Container">
            <img src="/Pricing.png"/>
        </div>
          <ol>
            <li>
              <h3>Session Pricing</h3>
              <p>
                The price range for 30-minute sessions with mentors is between
                Rs 500 to Rs 5000.
              </p>
            </li>
            <li>
              <h3>Platform Fee</h3>
              <ol>
                <li>
                  <h4>Mentor Connect</h4>
                  <p>
                    <strong>Clause 1:</strong> A platform fee of 10% will be
                    applied to those who seek mentorship and 10% to those who
                    deliver mentorship.
                  </p>
                  <p>
                    Here's a breakdown of how the pricing might look for
                    different session prices:
                    <ul>
                      <li>
                        For a session priced at Rs 500 for 30 min of mentor X.
                      </li>
                      <li>
                        User Y wants to have one-on-one sessions with mentor X.
                      </li>
                      <li>
                        User Y has to pay a total of (Rs. 500 + 10% of Rs. 500)
                        = Rs. 550
                      </li>
                      <li>
                        Whereas Mentor X will receive (Rs. 500 - 10% of Rs. 500)
                        as final money to their bank account = Rs. 450
                      </li>
                    </ul>
                  </p>
                  <p>
                    <strong>Clause 2:</strong> A platform fee of 2-20% in terms
                    of equity of the company, if Beyinc along with the mentor
                    agrees to support the startup.
                  </p>
                  <p>
                    Users are free to choose Clause 1 for one-to-one mentorship
                    sessions. If users agree to work with Beyinc for longer
                    terms for their start-up, then Clause 2 will be applicable.
                  </p>
                </li>
                <li>
                  <h4>Cofounder Connect</h4>
                  <p>
                    Few people may charge to connect so as to become a
                    cofounder. In such cases, we take only 5% from users who are
                    seeking and 15% from others who are asking for money of the
                    total amount per session.
                  </p>
                </li>
                <li>
                  <h4>Investor Connect</h4>
                  <p>
                    <strong>Clause 1:</strong> A platform fee of 10% will be
                    applied to those who seek investment from investors of any
                    kind like individuals or institutions and 10% to those who
                    deliver investment, in general.
                  </p>
                  <p>
                    <strong>Clause 2:</strong> A platform fee of 1-2% of the
                    total deal of investment in cash or in terms of equity of
                    the company.
                  </p>
                  <p>
                    Example: If User X gets a deal of Rs. 20 Lakhs from Investor
                    Y, then the platform fee will be 1-2% of 20 Lakhs which is
                    20k-40k. Otherwise, 1-2% equity in the company, whichever is
                    suitable for User X.
                  </p>
                  <p>
                    If the user doesn’t get a deal, we charge according to
                    Clause 1. If the user gets a deal, then we charge according
                    to both Clause 1 and Clause 2 combined.
                  </p>
                </li>
              </ol>
            </li>
          </ol>
        </section>

        <Divider />

        <section id="refund-policy">
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <h2>Refund Policy</h2>
          <div className="Privacy-Policy-Image-Container">
            <img src="/Refund.png"/>
        </div>
          <ol>
            <li>
              <h3>Refund Eligibility</h3>
              <p>
                Customers are eligible for a refund if they have paid for a
                session but haven't received it due to the mentor's
                unavailability or technical issues with the platform.
              </p>
            </li>
            <li>
              <h3>Refund Process</h3>
              <p>
                Customers must submit a refund request through the platform's
                designated channels, providing details of the transaction.
                <b />
                The platform will investigate the request and verify the
                eligibility for a refund based on the provided information.
                <br />
                If the refund request is approved, the platform will initiate
                the refund process.
              </p>
            </li>
            <li>
              <h3>Refund Amount</h3>
              <p>
                If the session didn't take place due to the mentor's
                unavailability or technical issues, the customer will receive a
                full refund of the session fee.
              </p>
            </li>
            <li>
              <h3>Timeline</h3>
              <p>
                Refund requests must be submitted within a specified timeframe,
                such as 24 hours from the scheduled session time, to be
                considered for a refund.
                <br />
                Refunds will be processed within a certain timeframe, such as
                5-7 business days from the approval of the refund request.
              </p>
            </li>
            <li>
              <h3>Exceptions</h3>
              <p>
                Refunds will not be provided if the customer misses the
                scheduled session without prior notification or valid reason.
                <br />
                Refunds will not be provided for dissatisfaction with the
                content or quality of the session, as the platform facilitates
                connections between mentors and customers but does not guarantee
                specific outcomes.
              </p>
            </li>
          </ol>
        </section>

        <Divider />

        <section id="cancellation-policy">
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <h2>Cancellation Policy</h2>
          <div className="Privacy-Policy-Image-Container">
            <img src="/Cancel.png"/>
        </div>
          <ol>
            <li>
              <h3>Cancellation Eligibility</h3>
              <p>
                Customers are allowed to cancel their session bookings under
                certain conditions. Cancellation requests must be made within a
                specified timeframe before the scheduled session time to be
                eligible for a refund.
              </p>
            </li>
            <li>
              <h3>Cancellation Process</h3>
              <p>
                Customers must submit a cancellation request through the
                platform's designated channels, providing details of the session
                booking.
                <br />
                The platform will verify the cancellation request and process it
                accordingly.
              </p>
            </li>
            <li>
              <h3>Cancellation Window</h3>
              <p>
                Customers can cancel their session bookings up to 24 hours in
                advance to be eligible for a full refund.
              </p>
            </li>
            <li>
              <h3>Refund Amount</h3>
              <p>
                If a cancellation request is made within the full
                refund-eligible cancellation window, the customer will receive a
                full refund of the session fee. If done late, the user may get a
                partial refund.
              </p>
            </li>
            <li>
              <h3>Late Cancellations</h3>
              <p>
                Cancellation requests made after the refund-specified
                cancellation window may not be eligible for a refund, and the
                session fee may be forfeited. Exceptions to this policy may be
                considered on a case-by-case basis for extenuating
                circumstances, such as emergencies or unforeseen events.
              </p>
            </li>
            <li>
              <h3>No-show Policy</h3>
              <p>
                If a customer fails to attend the scheduled session without
                prior cancellation or notification, the session fee will be
                forfeited, and no refund will be provided. This policy helps
                discourage no-shows and ensures fairness to mentors who allocate
                their time for scheduled sessions.
              </p>
            </li>
          </ol>
        </section>

        <Divider />
        
        <section id="shipping-and-delivery">
          <div style={{opacity: '0'}}>
            dummy content
          </div>
          <div style={{ opacity: '0' }}>
            dummy content
          </div>
          <h2>Shipping and Delivery</h2>
          <div className="Privacy-Policy-Image-Container">
            <img src="/Shipping.png"/>
        </div>
          <ol>
            <li>
              <h3>Shipping Eligibility</h3>
              <p>
                Customers may be eligible for shipping of supplementary
                materials or resources associated with their session bookings.
                These can be done offline by sending parcels or online to Gmail,
                etc. Shipping may be optional or included as part of certain
                session packages.
              </p>
            </li>
            <li>
              <h3>Shipping Process</h3>
              <p>
                Customers can select the option for shipping during the booking
                process if applicable.
                <br />
                The platform will collect shipping details, including the
                customer's address, during the checkout process.
              </p>
            </li>
            <li>
              <h3>Shipping Timeline</h3>
              <p>
                The platform will provide an estimated shipping timeline to
                customers, indicating when they can expect to receive their
                materials.
                <br />
                Shipping timelines may vary depending on the customer's location
                and the availability of the materials.
              </p>
            </li>
            <li>
              <h3>Delivery Method</h3>
              <p>
                The platform will utilize a designated shipping carrier or
                service to deliver the materials to customers.
                <br />
                Customers may have the option to select their preferred delivery
                method, such as standard shipping or expedited shipping, during
                checkout.
              </p>
            </li>
            <li>
              <h3>Tracking Information</h3>
              <p>
                Once the materials are shipped, the platform will provide
                customers with tracking information to monitor the delivery
                status.
                <br />
                Customers can track their shipments through the shipping
                carrier's website or app.
              </p>
            </li>
            <li>
              <h3>Delivery Confirmation</h3>
              <p>
                Upon delivery, customers may be required to provide confirmation
                of receipt, either by signing for the package or confirming
                delivery through the shipping carrier's platform.
                <br />
                This helps ensure that the materials are successfully delivered
                to the intended recipient.
              </p>
            </li>
          </ol>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
