import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import { ApiServices } from "../../Services/ApiServices";
import { useNavigate } from "react-router-dom/dist";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    email: null,
    emailOtp: null,
    mobile: null,
    mobileOtp: null,
    name: null,
    role: null,
    password: null,
    isMobileOtpSent: null,
    isEmailOtpSent: null,
    emailVerified: null,
    mobileVerified: null,
    isEmailValid: null,
    isMobileValid: null,
    isNameValid: null,
    isPasswordValid: null,
  });
  const [loading, setLoading] = useState(false);
  const [sendEmailOtpLoading, setSendEmailOtpLoading] = useState(false);
  const [verifyEmailOtpLoading, setVerifyEmailOtpLoading] = useState(false);
  const [sendMobileOtpLoading, setSendMobileOtpLoading] = useState(false);
  const [verifyMobileOtpLoading, setVerifyMobileOtpLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const {
    email,
    emailOtp,
    mobile,
    mobileOtp,
    name,
    role,
    password,
    isEmailOtpSent,
    isMobileOtpSent,
    emailVerified,
    mobileVerified,
    isEmailValid,
    isMobileValid,
    isNameValid,
    isPasswordValid,
  } = inputs;

  const handleChanges = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "name") {
      setInputs((prev) => ({ ...prev, isNameValid: e.target.value !== "" }));
    }
    if (e.target.name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(
          e.target.value
        ),
      }));
    }
    if (e.target.name === "password") {
      setInputs((prev) => ({
        ...prev,
        isPasswordValid:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(
            e.target.value
          ),
      }));
    }
    if (e.target.name === "mobile") {
      setInputs((prev) => ({
        ...prev,
        isMobileValid: /^[0-9]{10}$/.test(e.target.value),
      }));
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendEmailOtp = async (e) => {
    e.preventDefault();
    setSendEmailOtpLoading(true);
    e.target.disabled = true;
    await ApiServices.sendOtp({
      to: email,
      type: "Sign Up",
      subject: "Email Verification",
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "OTP sent successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        // setIsEmailOtpSent(true);
        setSendEmailOtpLoading(false);
        setInputs((prev) => ({ ...prev, isEmailOtpSent: true }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "OTP sent failed !",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = true;
      });

  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setVerifyEmailOtpLoading(true);
    await ApiServices.verifyOtp({
      email: email,
      otp: emailOtp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Email verified successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        document.getElementById("emailVerify").style.display = "none";
        document.getElementById("emailOtpInput").disabled = true;
        // setemailVerified(true);
        setVerifyEmailOtpLoading(false);
        setInputs((prev) => ({ ...prev, emailVerified: true }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Incorrect OTP",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  const verifyMobileOtp = async (e) => {
    e.preventDefault();
    setVerifyMobileOtpLoading(true)
    await ApiServices.verifyOtp({
      email: `+91${mobile}`,
      otp: mobileOtp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Mobile verified successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        document.getElementById("mobileVerify").style.display = "none";
        document.getElementById("mobileOTPinput").disabled = true;
        // setmobileVerified(true);
        setVerifyMobileOtpLoading(false)
        setInputs((prev) => ({ ...prev, mobileVerified: true }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setToast({
            message: "Incorrect OTP",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);
    e.target.disabled = true;
    await ApiServices.register({
      email: email,
      password: password,
      userName: name,
      phone: mobile,
      role: role,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "User Registered Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        navigate("/login");
        setLoading(false);
      })
      .catch((err) => {
        e.target.disabled = false;
        dispatch(
          setToast({
            message: err.response.data.message,
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  const sendMobileOtpF = async (e) => {
    e.preventDefault();
    setSendMobileOtpLoading(true);
    e.target.disabled = true;
    await ApiServices.sendMobileOtp({
      phone: `+91${mobile}`,
      type: "",
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "OTP sent successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        // setIsEmailOtpSent(true);
        setSendMobileOtpLoading(false);
        setInputs((prev) => ({ ...prev, isMobileOtpSent: true }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setToast({
            message: err.response.data,
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = true;
      });

  };

  const isFormValid =
    isEmailValid &&
    isMobileValid &&
    emailVerified &&
    mobileVerified &&
    isNameValid &&
    isPasswordValid;

  const handleChangeRadio = (e) => {
    setInputs((prev) => ({ ...prev, role: e.target.value }));
  };

  useEffect(() => {
    ApiServices.getAllRoles().then((res) => {
      setRoles(res.data);
    }).catch((err) => {
      console.log(err);
      if (err.message == "Network Error") {
        dispatch(
          setToast({
            message: "Check your network connection",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      }
    });
  }, []);

  return (
    <>
      <main className="signup-main-container">
        <div className="signup-hero">
          {/* <img
            className="signup-image"
            src="investment.png"
            alt="investment doodle"
          /> */}
          <div className="signup-form-section">
            <div class="signup-page">
              <div class="signup-header">
                <img
                  class="signup-logo"
                  src="logo.png"
                  alt="Your Alt Text"
                  onClick={() => {
                    navigate("/");
                  }}
                />
                {/* <p>Sign up to turn your dreams into reality!</p> */}
                {/* <button>
                <i class="fab fa-google"></i> Log in with Google
              </button> */}
              </div>
              <div class="signup-container">
                <form action="">
                  <input
                    type="text"
                    className={
                      isNameValid !== null &&
                      (isNameValid ? "valid" : "invalid")
                    }
                    value={name}
                    name="name"
                    onChange={handleChanges}
                    placeholder="Full Name*"
                  />
                  <div className="role-container">
                    {roles?.map((r) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.role}
                          id={r.role}
                          onClick={handleChangeRadio}
                        />
                        <label for={r.role}>{r.role}</label>
                      </div>
                    ))}
                  </div>
                  <input
                    type="email"
                    className={
                      isEmailValid !== null &&
                      (isEmailValid ? "valid" : "invalid")
                    }
                    value={email}
                    name="email"
                    onChange={handleChanges}
                    disabled={emailVerified}
                    placeholder="Email Address*"
                  />
                  {emailVerified === true && (
                    <img
                      src="checked.png"
                      height={20}
                      alt="Your Alt Text"
                      className="successIcons"
                    />
                  )}
                  {!isEmailOtpSent && isEmailValid && (
                    <button
                      type="button"
                      className="otp_button full-width-button"
                      onClick={sendEmailOtp}
                      disabled={sendEmailOtpLoading}
                      style={{
                        whiteSpace: "nowrap",
                        position: "relative",
                        display: "flex",
                        gap: "3px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "10px",
                      }}
                    >
                      {sendEmailOtpLoading ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <div className="button-loader"></div>
                          <div>
                            <span style={{ marginLeft: "10px" }}>
                              Sending OTP...
                            </span>
                          </div>
                        </div>
                      ) : (
                        "Get OTP"
                      )}
                    </button>
                  )}
                  {isEmailOtpSent && emailVerified !== true && (
                    <>
                      <input
                        type="text"
                        className={
                          emailOtp !== null &&
                          (emailOtp.length === 6 ? "valid" : "invalid")
                        }
                        value={emailOtp}
                        name="emailOtp"
                        onChange={handleChanges}
                        placeholder="Enter Email OTP"
                        id="emailOtpInput"
                      />
                      {emailOtp !== null && emailOtp.length === 6 && (
                        <button
                          type="button"
                          className="otp_button"
                          id="emailVerify"
                          onClick={verifyOtp}
                          disabled={verifyEmailOtpLoading}
                          style={{
                            whiteSpace: "nowrap",
                            position: "relative",
                            display: "flex",
                            gap: "3px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "10px",
                          }}
                        >
                          {verifyEmailOtpLoading ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <div className="button-loader"></div>
                              <div>
                                <span style={{ marginLeft: "10px" }}>
                                  Verifying OTP...
                                </span>
                              </div>
                            </div>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      )}
                    </>
                  )}
                  <input
                    type="number"
                    className={
                      mobile !== null &&
                      (mobile.length === 10 ? "valid" : "invalid")
                    }
                    name="mobile"
                    value={mobile}
                    disabled={mobileVerified || isMobileOtpSent}
                    onChange={handleChanges}
                    placeholder="Mobile Number*"
                  />
                  {mobileVerified === true && (
                    <img
                      src="checked.png"
                      height={20}
                      alt="Your Alt Text"
                      className="successIcons"
                    />
                  )}
                  {!isMobileOtpSent && isMobileValid && (
                    <button
                      type="button"
                      className="otp_button full-width-button"
                      onClick={sendMobileOtpF}
                      disabled={sendMobileOtpLoading}
                      style={{
                        whiteSpace: "nowrap",
                        position: "relative",
                        display: "flex",
                        gap: "3px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "10px",
                      }}
                    >
                      {sendMobileOtpLoading ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <div className="button-loader"></div>
                          <div>
                            <span style={{ marginLeft: "10px" }}>
                              Sending OTP...
                            </span>
                          </div>
                        </div>
                      ) : (
                        "Get OTP"
                      )}
                    </button>
                  )}
                  {isMobileOtpSent && mobileVerified !== true && (
                    <>
                      <input
                        type="text"
                        className={
                          mobileOtp !== null &&
                          (mobileOtp.length === 6 ? "valid" : "invalid")
                        }
                        name="mobileOtp"
                        value={mobileOtp}
                        onChange={handleChanges}
                        placeholder="Enter Mobile OTP"
                        id="mobileOTPinput"
                      />
                      {mobileOtp !== null && mobileOtp.length === 6 && (
                        <button
                          type="button"
                          className="otp_button"
                          id="mobileVerify"
                          onClick={verifyMobileOtp}
                          disabled={verifyMobileOtpLoading}
                          style={{
                            whiteSpace: "nowrap",
                            position: "relative",
                            display: "flex",
                            gap: "3px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "10px",
                          }}
                        >
                          {verifyMobileOtpLoading ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <div className="button-loader"></div>
                              <div>
                                <span style={{ marginLeft: "10px" }}>
                                  Verifying OTP...
                                </span>
                              </div>
                            </div>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      )}
                    </>
                  )}
                  <input
                    type="password"
                    className={
                      isPasswordValid !== null &&
                      (isPasswordValid ? "valid" : "invalid")
                    }
                    name="password"
                    value={password}
                    onChange={handleChanges}
                    placeholder="Create Password*"
                  />
                  <div className="passwordHint">
                    <ul>
                      <li className={password?.length>=8 ? 'success' : 'failure'}>Password should be atleast 8 character length</li>
                      <li className={/.*[A-Z].*/.test(password) ? 'success' : 'failure'}>Atleast one capital letter</li>
                      <li className={/.*[a-z].*/.test(password) && password!==null ? 'success' : 'failure'}>Atleast one small letter</li>
                      <li className={/.*[!@#$%^&*()_+].*/.test(password) ? 'success' : 'failure'}>Atleast one special character (!@#$%^&*()_+)</li>
                      <li className={/.*[0-9].*/.test(password) ? 'success' : 'failure'}>Atleast one Number</li>
                    </ul>
                  </div>
                    
                  <button
                    type="submit"
                    className="full-width-button"
                    disabled={!isFormValid || loading}
                    onClick={signup}
                    style={{
                      whiteSpace: "nowrap",
                      position: "relative",
                      display: "flex",
                      gap: "3px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "10px",
                    }}
                  >
                    {loading ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <div className="button-loader"></div>
                        <div>
                          <span style={{ marginLeft: "10px" }}>
                            Signing up...
                          </span>
                        </div>
                      </div>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </form>

                <ul>
                  <li>By signing up, you agree to our</li>
                  <li>
                    <a href=""> Terms </a>
                  </li>
                  <li>
                    <a href=""> Data Policy </a>
                  </li>
                  <li>and</li>
                  <li>
                    <a href=""> Cookies Policy </a> .
                  </li>
                </ul>
              </div>
              <div class="signup-header">
                <div>
                  <hr />
                  <p>OR</p>
                  <hr />
                </div>
              </div>
              <p className="signup-option-text">
                Already have an account? <a href="/login">Log in</a>
              </p>
            </div>
          </div>
        </div>
        {/* <div class="signup-otherapps">
          <p>Get the app.</p>
          <button type="button">
            <i class="fab fa-apple"></i> App Store
          </button>
          <button type="button">
            <i class="fab fa-google-play"></i> Google Play
          </button>
        </div> */}
        {/* <div class="signup-footer">
          <ul class="signup-footer-flex">
            <li>
              <a href="">ABOUT</a>
            </li>
            <li>
              <a href="">HELP</a>
            </li>
            <li>
              <a href="">API</a>
            </li>
            <li>
              <a href="">JOBS</a>
            </li>
            <li>
              <a href="">PRIVACY</a>
            </li>
            <li>
              <a href="">TERMS</a>
            </li>
            <li>
              <a href="">LOCATIONS</a>
            </li>
            <li>
              <a href="">LANGUAGE</a>
            </li>
          </ul>
          <p>© 2024 BeyInc</p>
        </div> */}
      </main>
    </>
  );
};
export default SignUp;
