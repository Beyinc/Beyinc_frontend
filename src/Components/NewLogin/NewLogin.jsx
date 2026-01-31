

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import GoogleAuth from "../GoogleAuth/GoogleAuth";
import "./NewLogin.css";

function NewLogin() {
  const [activeTab, setActiveTab] = useState("email");
  const [passwordForLogin, setPasswordForLogin] = useState("");
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
  const [otpVisible, setOtpVisible] = useState(false);

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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(value),
      }));
    }
    if (name === "password") {
      setInputs((prev) => ({ ...prev, isPasswordValid: true }));
    }
    if (name === "mobile") {
      setInputs((prev) => ({
        ...prev,
        isMobileValid: /^[0-9]{10}$/.test(value),
      }));
    }
  };

  const handleLoginTypeChange = (type) => {
    setActiveTab(type);
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
        e.target.disabled = false;
      });
  };

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
        window.location.href = "/posts";
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
        setLoading(false);
        dispatch(
          setToast({
            message: "User Logged In Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        window.location.href = "/posts";
      })
      .catch((err) => {
        setLoading(false);
        e.target.disabled = false;
        dispatch(
          setToast({
            message: err?.response?.data?.message || "Error Occurred",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  };

  const isFormValid =
    (activeTab === "email" && isEmailValid && isPasswordValid) ||
    (activeTab === "mobile" && mobileVerified);

  return (
    <div className="flex justify-center items-center p-4 md:p-10 login-bg-wrapper overflow-y-hidden">
      <div className="relative flex flex-col mt-14 md:mt-4 md:flex-row bg-white w-full max-w-[1000px] md:h-[690px] shadow-lg rounded-2xl mb-20">
        {/* Logo */}
        <img
          src="/Bloomr-login-logo.svg"
          className="absolute top-4 right-4 h-12 w-40 cursor-pointer"
          alt="logo"
          onClick={() => navigate("/")}
        />

        {/* Left Image (hidden on mobile) */}
        <div className="hidden md:block w-[40%] relative p-10">
          <img
 src="/Bloomr-login-signin.jpeg"            className="w-full h-full rounded-xl object-cover"
            alt="bg"
          />
       
        </div>

        {/* Right Form */}
        <div className="w-full md:w-[50%] p-6 justify-center  md:p-10">
          <p className="text-[#4F55C7] text-xl font-bold text-center mr-8 mt-14 md:mr-0 md:mt-0 md:text-3xl">
            Log In
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-16 mt-6">
            <p
              className={`text-lg font-bold cursor-pointer pb-1 relative ${
                activeTab === "email" ? "text-[#4F55C7]" : "text-gray-500"
              }`}
              onClick={() => handleLoginTypeChange("email")}
            >
              Email
              {activeTab === "email" && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#4F55C7]"></span>
              )}
            </p>

{/* uncommnet this further for mobile otpo login */}
            {/* <p
              className={`text-lg font-bold cursor-pointer pb-1 relative ${
                activeTab === "mobile" ? "text-[#4F55C7]" : "text-gray-500"
              }`}
              onClick={() => handleLoginTypeChange("mobile")}
            >
              Mobile
              {activeTab === "mobile" && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#4F55C7]"></span>
              )}
            </p> */}
          </div>

          {/* Email Login */}
          {activeTab === "email" ? (
            <div className="ml-6 mt-6 md:mt-6">
              <p className="font-medium">Email Address</p>
              <input
                type="email"
                name="email"
                value={email || ""}
                onChange={handleChanges}
                placeholder="Email Address"
                className="w-full h-6 mt-1 border rounded-md px-2 shadow-sm"
              />

              <p className="font-medium mt-4">Password</p>
              <input
                type="password"
                name="password"
                value={password || ""}
                onChange={(e) => {
                  handleChanges(e);
                  setPasswordForLogin(e.target.value);
                }}
                placeholder="Password"
                className="w-full h-6 mt-1 border rounded-md px-2 shadow-sm"
              />

              <div className="passwordHint" hidden={!password}>
                <ul>
                  <li className={password?.length >= 8 ? "success" : "failure"}>
                    <i>Password should be at least 8 character length</i>
                  </li>
                  <li
                    className={
                      /.*[A-Z].*/.test(password) ? "success" : "failure"
                    }
                  >
                    <i>At least one capital letter</i>
                  </li>
                  <li
                    className={
                      /.*[a-z].*/.test(password) && password
                        ? "success"
                        : "failure"
                    }
                  >
                    <i>At least one small letter</i>
                  </li>
                  <li
                    className={
                      /.*[!@#$%^&*()_+].*/.test(password)
                        ? "success"
                        : "failure"
                    }
                  >
                    <i>At least one special character (!@#$%^&*()_+)</i>
                  </li>
                  <li
                    className={
                      /.*[0-9].*/.test(password) ? "success" : "failure"
                    }
                  >
                    <i>At least one Number</i>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading || !passwordForLogin}
                onClick={login}
                className=" w-[80%] md:w-full bg-[#4F55C7] text-white font-bold py-2 rounded-full mt-6 flex justify-center items-center"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          ) : (
            <div className="ml-6 mt-6 md:mt-6">
              <p className="font-medium">Mobile Number</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="mobile"
                  value={mobile || ""}
                  onChange={handleChanges}
                  placeholder="10 digit mobile number"
                  disabled={mobileVerified}
                  className="w-full h-6 mt-1 border rounded-md px-2 shadow-sm"
                />
                {isMobileValid && !otpVisible && (
                  <button
                    type="button"
                    onClick={sendMobileOtpF}
                    className="bg-[#4F55C7] text-white px-4 rounded-md mt-1 font-medium whitespace-nowrap"
                  >
                    Get OTP
                  </button>
                )}
              </div>

              {otpVisible && mobileVerified !== true && (
                <>
                  <p className="font-medium mt-4">Enter OTP</p>
                  <input
                    type="text"
                    name="mobileOtp"
                    value={mobileOtp || ""}
                    onChange={handleChanges}
                    placeholder="Enter 6 digit OTP"
                    maxLength="6"
                    className="w-full h-6 mt-1 border rounded-md px-2 shadow-sm"
                  />
                  {mobileOtp !== null && mobileOtp.length === 6 && (
                    <button
                      type="button"
                      onClick={verifyMobileOtp}
                      className="w-full md:w-full bg-[#4F55C7] text-white font-bold py-2 rounded-full mt-4"
                    >
                      Verify OTP
                    </button>
                  )}
                </>
              )}

              {mobileVerified && (
                <>
                  <p className="font-medium mt-4">Password</p>
                  <input
                    type="password"
                    name="password"
                    value={password || ""}
                    onChange={handleChanges}
                    placeholder="Password"
                    className="w-full h-6 mt-1 border rounded-md px-2 shadow-sm"
                  />

                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    onClick={mobileLogin}
                    className="w-[80%] md:w-full bg-[#4F55C7] text-white font-bold py-2 rounded-full mt-6 flex justify-center items-center"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="mr-10 md:mr-0">
            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-6">
              <hr className="w-24" />
              <span className="text-sm">OR</span>
              <hr className="w-24" />
            </div>

            <div className="flex justify-center">
              <GoogleAuth />
            </div>

            <div className="text-center mt-6 text-lg">
              New here?{" "}
              <span
                className="text-[#4F55C7] cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </div>

            <p
              className="text-center text-[#4F55C7] mt-4 cursor-pointer"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewLogin;
