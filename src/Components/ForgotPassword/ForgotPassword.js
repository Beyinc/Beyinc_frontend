import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom/dist";
import '../Login/Login.css'
const ResetPassword = () => {
  const [inputs, setInputs] = useState({
    email: null,
    mobile: null,
    otp: null,
    newPassword: null,
    confirmPassword: null,
    isEmailValid: null,
    mobileOtp: null,
    isMobileValid: null,
    isPasswordValid: null,
  });

  const {
    email,
    newPassword,
    confirmPassword,
    isMobileValid,
    mobileOtp,
    otp,
    isEmailValid,
    isPasswordValid,
  } = inputs;
  const handleChanges = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(e.target.value),
      }));
    }
    if (e.target.name === "newPassword") {
      setInputs((prev) => ({
        ...prev,
        isPasswordValid:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(
            e.target.value
          ),
      }));
    }
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setemailVerified(false)
    setIsMobileValid(null)
    setmobileVerified(false)
    setMobile('')
    setInputs({
      email: null,
      emailOtp: null,
      mobileOtp: null,
      name: null,
      password: null,
      isMobileOtpSent: null,
      isEmailOtpSent: null,
      emailVerified: null,
      mobileVerified: false,
      isEmailValid: null,
      isMobileValid: null,
      isNameValid: null,
      isPasswordValid: null,
    });
    setOtpVisible(false);
  };
  const [loginType, setLoginType] = useState("email");
  const [otpVisible, setOtpVisible] = useState(false);
  const [emailVerified, setemailVerified] = useState(false);
  const [mobileVerified, setmobileVerified] = useState(false);

  const [mobile, setMobile] = useState('')
  const [mobileValid, setIsMobileValid] = useState(null);


  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const handleLoginTypeChange = (type) => {
  //   setLoginType(type);
  //   setEmail("");
  //   setMobile("");
  //   setOtp("");
  //   setNewPassword("");
  //   setConfirmPassword("");
  //   setOtpVisible(false);
  //   setIsMobileValid(false);
  // };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const obj = {
      email: email,
      phone: mobile,
      type: loginType,
      password: newPassword,
    };
    await ApiServices.resetPassword(obj)
      .then(async (res) => {
        dispatch(
          setToast({
            message: "Password changed Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        navigate("/login");
      })
      .catch((err) => {
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
    e.target.disabled = true;
    await ApiServices.sendMobileOtp({
      phone: `+91${mobile}`, type: 'forgot'
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
        setInputs((prev) => ({ ...prev, isMobileOtpSent: true }));
        setOtpVisible(true)
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
  const handleGetOtp = async (e) => {
    e.target.disabled = true;
    if (loginType === "email") {
      await ApiServices.sendOtp({
        to: email, type: 'Forgot Password',
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
          setOtpVisible(true);
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "OTP sent successfully !",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
      setTimeout(() => {
        dispatch(
          setToast({
            message: "",
            bgColor: "",
            visible: "no",
          })
        );
      }, 4000);
    } else {
      sendMobileOtpF(e)
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    await ApiServices.verifyOtp({
      email: loginType == 'email' ? email : `+91${mobile}`,
      otp: loginType == 'email' ? otp : mobileOtp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Email verified successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );

        if (loginType == 'email') {
          document.getElementById("emailVerify").style.display = "none";
          setemailVerified(true);
        } else {
          setmobileVerified(true)
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(
          setToast({
            message: "OTP Entered Wrong",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  const handleMobileChange = (value) => {
    setMobile(value);
    setIsMobileValid(/^[0-9]{10}$/.test(value));
  };

  return (
    // <div className="form-container">
    //   <form className="form">
    //     <center>
    //       <h2>Reset Password</h2>
    //       <p>Reset your password with email</p>
    //     </center>
    //     {/* <div className="login-type-toggle">
    //       <span
    //         className={loginType === "email" ? "active" : ""}
    //         onClick={() => handleLoginTypeChange("email")}
    //       >
    //         Email
    //       </span>
    //       <span
    //         className={loginType === "mobile" ? "active" : ""}
    //         onClick={() => handleLoginTypeChange("mobile")}
    //       >
    //         Mobile
    //       </span>
    //     </div> */}
    //     {loginType === "email" ? (
    //       <>
    //   <input
    //     type="text"
    //     name="email"
    //     className={
    //       isEmailValid !== null && (isEmailValid ? "valid" : "invalid")
    //     }
    //     value={email}
    //     placeholder="Email Address"
    //     disabled={emailVerified}
    //     onChange={handleChanges}
    //   />
    //   {emailVerified === true && (
    //     <img
    //       src="checked.png"
    //       height={20}
    //       alt="Your Alt Text"
    //       className="successIcons"
    //     />
    //   )}

    //   {isEmailValid && !otpVisible && (
    //     <button
    //       type="button"
    //       className="otp_button"
    //       onClick={handleGetOtp}
    //     >
    //       Get OTP
    //     </button>
    //   )}
    //   {otpVisible && emailVerified !== true && (
    //     <>
    //       <input
    //         type="text"
    //         name="otp"
    //         value={otp}
    //         placeholder="Enter OTP"
    //         onChange={handleChanges}
    //       />
    //       {otp !== null && otp.length === 6 && (
    //         <button
    //           type="button"
    //           className="otp_button"
    //           onClick={verifyOtp}
    //           id="emailVerify"
    //         >
    //           Verify otp
    //         </button>
    //       )}
    //     </>
    //   )}
    // </>
    //     ) : (
    //   <>
    //     <input
    //       type="text"
    //       disabled={mobileVerified}
    //       value={mobile}
    //       placeholder="Mobile Number"
    //       onChange={(e) => handleMobileChange(e.target.value)}
    //     />
    //     {mobileVerified === true && (
    //       <img
    //         src="checked.png"
    //         height={20}
    //         alt="Your Alt Text"
    //         className="successIcons"
    //       />
    //     )}

    //     {isMobileValid && !otpVisible && (
    //       <button
    //         type="button"
    //         className="otp_button"
    //         onClick={handleGetOtp}
    //       >
    //         Get OTP
    //       </button>
    //     )}
    //     {otpVisible && (
    //       <>
    //         <input type="text" value={otp} placeholder="Enter OTP" />
    //         <button
    //           type="button"
    //           className="otp_button"
    //           onClick={handleGetOtp}
    //           style={{ whiteSpace: "noWrap" }}
    //         >
    //           Resend OTP
    //         </button>
    //       </>
    //     )}
    //   </>
    // )}
    // {(emailVerified || mobileVerified) && (
    //   <>
    //     <input
    //       name="newPassword"
    //       type="password"
    //       className={
    //         isPasswordValid !== null &&
    //         (isPasswordValid ? "valid" : "invalid")
    //       }
    //       value={newPassword}
    //       placeholder="New Password"
    //       onChange={handleChanges}
    //     />
    //     {isPasswordValid && (
    //       <input
    //         name="confirmPassword"
    //         type="password"
    //         className={
    //           confirmPassword !== null &&
    //           (confirmPassword === newPassword ? "valid" : "invalid")
    //         }
    //         value={confirmPassword}
    //         placeholder="Confirm Password"
    //         onChange={handleChanges}
    //       />
    //     )}
    //   </>
    // )}
    //     <button
    //       type="button"
    //       onClick={handleResetPassword}
    //       disabled={
    // !emailVerified ||
    // newPassword === "" ||
    // newPassword !== confirmPassword
    //       }
    //     >
    //       Reset Password
    //     </button>
    //     <p>
    //       Remember your password?{" "}
    //       <RouterLink
    //         to="/login"
    //         style={{
    //           textDecoration: "none",
    //           fontWeight: "600",
    //           color: "#1e4bb8",
    //           transition: "color 0.3s",
    //         }}
    //         onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
    //         onMouseOut={(e) => (e.target.style.textDecoration = "none")}
    //       >
    //         Login
    //       </RouterLink>
    //     </p>
    //   </form>
    // </div>
    <main className="login-main-container">
      <div className="login-hero">
        {/* <img
          className="login-image"
          src="investment.png"
          alt="investment doodle"
        /> */}
        <div className="login-form-section">
          <div class="login-page">
            <div class="login-header">
              <img
                class="login-logo"
                src="logo.png"
                alt="Your Alt Text"
                onClick={() => {
                  navigate("/");
                }}
              />
              <p>Change your password here!</p>
              {/* <button>
              <i class="fab fa-google"></i> Log in with Google
            </button> */}
            </div>
            <div class="login-container">
              <div class="tab-wrap">
                <input
                  type="radio"
                  id="tab1"
                  name="tabGroup1"
                  class="tab"
                  checked={loginType === "email"}
                  onClick={() => handleLoginTypeChange("email")}
                />
                <label for="tab1">Email</label>
                <input
                  onClick={() => handleLoginTypeChange("mobile")}
                  type="radio"
                  id="tab2"
                  name="tabGroup1"
                  class="tab"
                />
                <label for="tab2">Mobile</label>
              </div>
              <form action="">
                {loginType === "email" ? (
                  <>
                    <input
                      type="text"
                      name="email"
                      className={
                        isEmailValid !== null && (isEmailValid ? "valid" : "invalid")
                      }
                      value={email}
                      placeholder="Email Address"
                      disabled={emailVerified}
                      onChange={handleChanges}
                    />
                    {/* {emailVerified === true && (
                      <img
                        src="checked.png"
                        height={20}
                        alt="Your Alt Text"
                        className="successIcons"
                      />
                    )} */}
                    {isEmailValid && !otpVisible && (
                      <button
                        type="button"
                        className="full-width-button"
                        onClick={handleGetOtp}
                      >
                        Get OTP
                      </button>
                    )}
                    {otpVisible && emailVerified !== true && (
                      <>
                        <input
                          type="text"
                          name="otp"
                          value={otp}
                          placeholder="Enter OTP"
                          onChange={handleChanges}
                        />
                        {otp !== null && otp?.length === 6 && (
                          <button
                            type="button"
                            className="full-width-button"
                            onClick={verifyOtp}
                            id="emailVerify"
                          >
                            Verify otp
                          </button>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      disabled={mobileVerified}
                      value={mobile}
                      className={
                        mobileValid !== null && (mobileValid ? "valid" : "invalid")
                      }
                      placeholder="Mobile Number"
                      onChange={(e) => handleMobileChange(e.target.value)}
                    />

                    {mobileValid && !otpVisible && (
                      <button
                        type="button"
                        className="full-width-button"
                        onClick={handleGetOtp}
                      >
                        Get OTP
                      </button>
                    )}
                    {otpVisible && mobileVerified !== true && (
                      <>
                        <input
                          type="text"
                          value={mobileOtp}
                          className={
                            mobileOtp !== null &&
                            (mobileOtp.length === 6 ? "valid" : "invalid")
                          }
                          placeholder="Enter OTP"
                          name="mobileOtp"
                          onChange={handleChanges}
                        />
                        {mobileOtp !== null && mobileOtp.length === 6 && (
                          <button
                            type="button"
                            id="mobileVerify"
                            onClick={verifyOtp}
                            style={{ whiteSpace: "noWrap" }}
                          >
                            Verify OTP
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
                {(emailVerified || mobileVerified) && (
                  <>
                    <input
                      name="newPassword"
                      type="password"
                      className={
                        isPasswordValid !== null &&
                        (isPasswordValid ? "valid" : "invalid")
                      }
                      value={newPassword}
                      placeholder="New Password"
                      onChange={handleChanges}
                    />
                    {/* {isPasswordValid && ( */}
                    <input
                      name="confirmPassword"
                      type="password"
                      className={
                        confirmPassword !== null &&
                        (confirmPassword === newPassword ? "valid" : "invalid")
                      }
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      onChange={handleChanges}
                    />
                    {/* )} */}
                    <div className="passwordHint">
                      <ul>
                        <li className={newPassword?.length >= 8 ? 'success' : 'failure'}>Password should be atleast 8 character length</li>
                        <li className={/.*[A-Z].*/.test(newPassword) ? 'success' : 'failure'}>Atleast one capital letter</li>
                        <li className={/.*[a-z].*/.test(newPassword) && newPassword !== null ? 'success' : 'failure'}>Atleast one small letter</li>
                        <li className={/.*[!@#$%^&*()_+].*/.test(newPassword) ? 'success' : 'failure'}>Atleast one special character (!@#$%^&*()_+)</li>
                        <li className={/.*[0-9].*/.test(newPassword) ? 'success' : 'failure'}>Atleast one Number</li>
                      </ul>
                    </div>
                  </>
                )}
                
                <button
                  className="full-width-button"
                  type="submit"
                  disabled={
                    newPassword === "" ||
                    newPassword !== confirmPassword}
                  onClick={handleResetPassword}
                >
                  Change Password
                </button>
              </form>
            </div>
            <div class="login-header">
              <div>
                <hr />
                <p>OR</p>
                <hr />
              </div>
            </div>
            <p className="login-option-text">
              All Set? <a href="/login">Login in</a>
            </p>
          </div>
        </div>
      </div>
      {/* <div class="login-otherapps">
        <p>Get the app.</p>
        <button type="button">
          <i class="fab fa-apple"></i> App Store
        </button>
        <button type="button">
          <i class="fab fa-google-play"></i> Google Play
        </button>
      </div> */}
      {/* <div class="login-footer">
        <ul class="login-footer-flex">
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
  );
};

export default ResetPassword;
