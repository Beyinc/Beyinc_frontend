import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: null,
    mobile: null,
    mobileOtp: null,
    name: null,
    password: null,
    isMobileOtpSent: null,
    mobileVerified: null,
    isEmailValid: null,
    isMobileValid: null,
    isNameValid: null,
    isPasswordValid: null,
  });
  const [loading, setLoading] = useState(false);
  const {
    email,
    mobile,
    password,
    mobileOtp,
    mobileVerified,
    isEmailValid,
    isMobileValid,
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
  const [loginType, setLoginType] = useState("email");
  const [otpVisible, setOtpVisible] = useState(false);

  // const isEmailValid = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(email);
  // const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(password);

  const isFormValid =
    (loginType === "email" && isEmailValid && isPasswordValid) ||
    (loginType === "mobile" && mobileVerified);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setInputs({
      email: null,
      emailOtp: null,
      mobile: null,
      mobileOtp: null,
      name: null,
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
    setOtpVisible(false);
  };

  const sendMobileOtpF = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    await ApiServices.sendMobileOtp({
      phone: `+91${mobile}`,
      type: "login",
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
        // setIsEmailOtpSent(true);
        setInputs((prev) => ({ ...prev, isMobileOtpSent: true }));
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

  // const handleMobileChange = (value) => {
  //   setMobile(value);
  //   setIsMobileValid(/^[0-9]{10}$/.test(value));
  // };

  const verifyMobileOtp = async (e) => {
    e.preventDefault();
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
        // document.getElementById("mobileVerify").style.display = "none";
        // document.getElementById("mobileOtpInput").disabled = true;
        // setmobileVerified(true);
        setInputs((prev) => ({ ...prev, mobileVerified: true }));
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

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    e.target.disabled = true;
    const obj = {
      email: email,
      password: password,
    };
    await ApiServices.login(obj)
      .then(async (res) => {
        dispatch(
          setToast({
            message: "User Logged In Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        // navigate("/");
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        setLoading(false);
        e.target.disabled = false;

        dispatch(
          setToast({
            message:
              err?.response?.data?.message !== ""
                ? err?.response?.data?.message
                : "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  const mobileLogin = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const obj = {
      phone: mobile,
      password: password,
    };
    await ApiServices.mobileLogin(obj)
      .then(async (res) => {
        dispatch(
          setToast({
            message: "User Logged In Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        window.location.href = "/dashboard";
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
  return (
    <>
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
                {/* <p>Login in to turn your dreams into reality!</p> */}
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
                        type="email"
                        name="email"
                        value={email}
                        className={
                          isEmailValid !== null &&
                          (isEmailValid ? "valid" : "invalid")
                        }
                        placeholder="Email Address"
                        onChange={handleChanges}
                      />
                      <input
                        type="password"
                        className={
                          isPasswordValid !== null &&
                          (isPasswordValid ? "valid" : "invalid")
                        }
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={handleChanges}
                      />
                    </>
                  ) : (
                    <>
                      <div className="input-button-row">
                        <input
                          type="number"
                          value={mobile}
                          className={
                            isMobileValid !== null &&
                            (isMobileValid ? "valid" : "invalid")
                          }
                          disabled={mobileVerified}
                          placeholder="Mobile Number"
                          autoComplete="off"
                          name="mobile"
                          onChange={handleChanges}
                        />
                        {mobileVerified === true && (
                          <img
                            src="checked.png"
                            height={20}
                            style={{ right: "20px" }}
                            alt="Your Alt Text"
                            className="successIcons"
                          />
                        )}
                        {isMobileValid && !otpVisible && (
                          <button type="button" onClick={sendMobileOtpF}>
                            Get OTP
                          </button>
                        )}
                      </div>
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
                              onClick={verifyMobileOtp}
                              style={{ whiteSpace: "noWrap" }}
                            >
                              Verify OTP
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                  <div className="passwordHint">
                    <ul>
                      <li className={password?.length >= 8 ? 'success' : 'failure'}>Password should be atleast 8 character length</li>
                      <li className={/.*[A-Z].*/.test(password) ? 'success' : 'failure'}>Atleast one capital letter</li>
                      <li className={/.*[a-z].*/.test(password) && password !== null ? 'success' : 'failure'}>Atleast one small letter</li>
                      <li className={/.*[!@#$%^&*()_+].*/.test(password) ? 'success' : 'failure'}>Atleast one special character (!@#$%^&*()_+)</li>
                      <li className={/.*[0-9].*/.test(password) ? 'success' : 'failure'}>Atleast one Number</li>
                    </ul>
                  </div>
                  <button
                    className="full-width-button"
                    type="submit"
                    disabled={!isFormValid || loading}
                    onClick={loginType === "email" ? login : mobileLogin}
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
                            Logging in...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <i
                          className="fas fa-sign-in-alt"
                          style={{ marginRight: "5px", top: "-5px" }}
                        ></i>{" "}
                        Login
                      </>
                    )}
                  </button>
                </form>
              </div>
              <div className="login-header">
                <div>
                  <hr />
                  <p>OR</p>
                  <hr />
                </div>
              </div>
              <p className="login-option-text">
                New here? <a href="/signup">Sign up</a>
              </p>
              <p className="login-option-text" style={{ zIndex: 999 }}>
                <a href="/forgotpassword">Forgot Password?</a>
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
    </>
  );
};

export default Login;
