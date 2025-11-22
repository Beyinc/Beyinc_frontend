// import React, { useState } from "react";

// function NewLogin() {
//   const [activeTab, setActiveTab] = useState("email");

//   return (
//     <div className="relative flex flex-row bg-[#FFFFFF] h-[800px] w-[1180px] mt-[112px] ml-[130px] shadow-lg rounded-[20px] main-outer-div mb-10">
//       {/* Logo top-right */}
//       <img
//         src="/Bloomr-login-logo.svg"
//         className="absolute top-6 right-6 h-[74px]  w-[214px]"
//         alt="logo"
//       />

//       {/* this is image div*/}
//       <div className="relative h-[692px] w-[541px] ml-[49px] image-div-left">
//         <img
//           src="/login-bg.png"
//           className="h-full w-full rounded-[20px] mt-[54px]"
//           alt="bg"
//         />

//         <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
//           <p className="font-gentium font-bold text-[40px] leading-[45px] tracking-normal mb-[1px]">
//             Get Started by
//           </p>

//           <p className="font-gentium font-bold text-[40px] leading-[45px] tracking-normal">
//             Logging In
//           </p>
//         </div>
//       </div>

//       {/* this is the second div */}

//       <div className="w-[450px] h-[445px] ml-[79px] mt-[177px] ">
//         <div className="heading-div h-[41px] ml-[181px]">
//           {/*Log in heading div */}
//           <p className="w-full h-full font-gentium font-bold text-[#4F55C7] text-[35px]">
//             Log In
//           </p>
//         </div>

//         <div
//           id="email-mobile-div"
//           className="flex flex-row gap-44 ml-[79px] mt-[85px]"
//         >
//           {/* Email Tab */}
//           <p
//             className={`
//       font-bold text-[20px] text-[#4F55C7] font-roboto cursor-pointer relative pb-2
//       transition-all duration-300 ease-in-out
//     `}
//             onClick={() => setActiveTab("email")}
//           >
//             Email
//             {/* underline */}
//             <span
//               className={`
//         absolute left-0 bottom-0 h-[3px] w-full bg-[#4F55C7] rounded-md
//         transition-all duration-300 ease-in-out
//         ${
//           activeTab === "email"
//             ? "opacity-100 scale-x-100"
//             : "opacity-0 scale-x-0"
//         }
//       `}
//             ></span>
//           </p>

//           <p
//             className={`
//       font-bold text-[20px] text-[#4F55C7] font-roboto cursor-pointer relative pb-2
//       transition-all duration-300 ease-in-out
//     `}
//             onClick={() => setActiveTab("mobile")}
//           >
//             Mobile
//             {/* underline */}
//             <span
//               className={`
//         absolute left-0 bottom-0 h-[3px] w-full bg-[#4F55C7] rounded-md
//         transition-all duration-300 ease-in-out
//         ${
//           activeTab === "mobile"
//             ? "opacity-100 scale-x-100"
//             : "opacity-0 scale-x-0"
//         }
//       `}
//             ></span>
//           </p>
//         </div>

//         {activeTab == "email" ? (
//           <div id="input-div" className="flex flex-col mt-[40px]">
//             <p className="font-semibold font-roboto text-[16px]">
//               Email Address
//             </p>

//             <input
//               type="text"
//               className="w-[450px] h-[35px] mt-1 border border-black rounded-md px-2"
//             />

//             <p className="font-semibold font-roboto text-[16px] mt-4">
//               Password
//             </p>

//             <input
//               type="password"
//               className="w-[450px] h-[35px] mt-1 border border-black rounded-md px-2"
//             />
//             <button className="font-bold font-roboto rounded-3xl ml-5 mt-4 text-[20px]">
//               Login
//             </button>
//           </div>
//         ) : (
//           <div className="text-center text-gray-600 font-medium">
//             This feature is currently under maintenance. Please check back soon.
//           </div>
//         )}

//         <div className="ml-36 mt-6 font-roboto text-[20px]"><span>New Here ?</span> <span className="hover:cursor-pointer text-[#4F55C7]">Sign Up</span></div>
//        <div><p className="ml-40 mt-6 font-roboto text-[20px] text-[#4F55C7] hover:cursor-pointer">Forgot Password</p></div>

//       </div>
//     </div>
//   );
// }

// export default NewLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import GoogleAuth from "../GoogleAuth/GoogleAuth";

function NewLogin() {
  // UI tab state (kept from your new component)
  const [activeTab, setActiveTab] = useState("email");
  const [passwordForLogin, setPasswordForLogin] = useState("");
  // merged from old Login component
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

    if (name === "name") {
      setInputs((prev) => ({ ...prev, isNameValid: value !== "" }));
    }
    if (name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(value),
      }));
    }
    if (name === "password") {
      // original logic set isPasswordValid true on change.
      // We preserve that behavior so your form enables as before.
      setInputs((prev) => ({ ...prev, isPasswordValid: true }));
    }
    if (name === "mobile") {
      setInputs((prev) => ({
        ...prev,
        isMobileValid: /^[0-9]{10}$/.test(value),
      }));
    }
  };

  // reset and change tab (kept old clearing behavior)
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

  // re-used mobile functions (will not be used if mobile tab left as maintenance)
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
        e.target.disabled = true;
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

  // login via email (same as old)
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

  // mobileLogin (kept for parity, but you asked not to change mobile UI)
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
            message: err.response?.data?.message || "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  };

  // same validation logic as old: form valid when email & password valid OR mobile verified
  const isFormValid =
    (activeTab === "email" && isEmailValid && isPasswordValid) ||
    (activeTab === "mobile" && mobileVerified);

  return (
    <div className="relative flex flex-row bg-[#FFFFFF] h-[850px] w-[1180px] max-h-[900px] mt-[112px] ml-[130px] shadow-lg rounded-[20px] main-outer-div mb-10">
      {/* Logo top-right */}
      <img
        src="/Bloomr-login-logo.svg"
        className="absolute top-6 right-6 h-[74px] w-[214px]"
        alt="logo"
        onClick={() => navigate("/")}
      />

      {/* left image area */}
      <div className="relative h-[692px] w-[541px] ml-[49px] image-div-left">
        <img
          src="/login-bg.png"
          className="h-full w-full rounded-[20px] mt-[54px]"
          alt="bg"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="font-gentium font-bold text-[40px] leading-[45px] tracking-normal mb-[1px]">
            Get Started by
          </p>
          <p className="font-gentium font-bold text-[40px] leading-[45px] tracking-normal">
            Logging In
          </p>
        </div>
      </div>

      {/* right form area */}
      <div className="w-[450px] h-[445px] ml-[79px] mt-[137px] ">
        <div className="heading-div h-[41px] ml-[181px]">
          <p className="w-full h-full font-gentium font-bold text-[#4F55C7] text-[35px]">
            Log In
          </p>
        </div>

        <div
          id="email-mobile-div"
          className="flex flex-row gap-44 ml-[79px] mt-[35px]"
        >
          {/* Email Tab */}
          <p
            className={`font-bold text-[20px] text-[#4F55C7] font-roboto cursor-pointer relative pb-2 transition-all duration-300 ease-in-out`}
            onClick={() => handleLoginTypeChange("email")}
          >
            Email
            <span
              className={`absolute left-0 bottom-0 h-[3px] w-full bg-[#4F55C7] rounded-md transition-all duration-300 ease-in-out ${
                activeTab === "email"
                  ? "opacity-100 scale-x-100"
                  : "opacity-0 scale-x-0"
              }`}
            ></span>
          </p>

          <p
            className={`font-bold text-[20px] text-[#4F55C7] font-roboto cursor-pointer relative pb-2 transition-all duration-300 ease-in-out`}
            onClick={() => handleLoginTypeChange("mobile")}
          >
            Mobile
            <span
              className={`absolute left-0 bottom-0 h-[3px] w-full bg-[#4F55C7] rounded-md transition-all duration-300 ease-in-out ${
                activeTab === "mobile"
                  ? "opacity-100 scale-x-100"
                  : "opacity-0 scale-x-0"
              }`}
            ></span>
          </p>
        </div>

        {/* Email form UI */}
        {activeTab === "email" ? (
          <div id="input-div" className="flex flex-col mt-[40px]">
            <p className="font-semibold font-roboto text-[16px]">
              Email Address
            </p>

            <input
              type="email"
              name="email"
              value={email || ""}
              className={`w-[450px] h-[35px] mt-1 border border-black rounded-md px-2  shadow-md ${
                isEmailValid !== null
                  ? isEmailValid
                    ? "valid"
                    : "invalid"
                  : ""
              }`}
              placeholder="Email Address"
              onChange={handleChanges}
            />

            <p className="font-semibold font-roboto text-[16px] mt-4">
              Password
            </p>

            <input
              type="password"
              name="password"
              value={password || ""}
              className={`w-[450px] h-[35px] mt-1 border border-black rounded-md px-2 shadow-md ${
                isPasswordValid !== null
                  ? isPasswordValid
                    ? "valid"
                    : "invalid"
                  : ""
              }`}
              placeholder="Password"
              // onChange={handleChanges}
              onChange={(e) => {
                handleChanges(e);
                setPasswordForLogin(e.target.value);
              }}
            />

            <div className="passwordHint" hidden={!password}>
              <ul>
                <li className={password?.length >= 8 ? "success" : "failure"}>
                  <i>Password should be at least 8 character length</i>
                </li>
                <li
                  className={/.*[A-Z].*/.test(password) ? "success" : "failure"}
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
                    /.*[!@#$%^&*()_+].*/.test(password) ? "success" : "failure"
                  }
                >
                  <i>At least one special character (!@#$%^&*()_+)</i>
                </li>
                <li
                  className={/.*[0-9].*/.test(password) ? "success" : "failure"}
                >
                  <i>At least one Number</i>
                </li>
              </ul>
            </div>

            <button
              className="font-bold font-roboto rounded-3xl ml-5 mt-4 text-[20px] full-width-button"
              type="submit"
              disabled={!isFormValid || loading || !passwordForLogin}
              onClick={login}
              style={{
                whiteSpace: "nowrap",
                position: "relative",
                display: "flex",
                gap: "3px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "25px",
              }}
            >
              {loading ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "3px" }}
                >
                  <div className="button-loader"></div>
                  <div>
                    <span style={{ marginLeft: "10px" }}>Logging in...</span>
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
          </div>
        ) : (
          <div className="text-center text-gray-600 font-medium mt-[40px]">
            This feature is currently under maintenance. Please check back soon.
          </div>
        )}

        <div className="ml-36 mt-6 font-roboto text-[16px] flex items-center gap-2">
          <hr className="w-[120px]" />
          <p className="text-sm">OR</p>
          <hr className="w-[120px]" />
        </div>

        <div className="ml-36 mt-4">
          <GoogleAuth />
        </div>

        <div className="ml-36 mt-6 font-roboto text-[20px]">
          <span>New Here ?</span>{" "}
          <span
            className="hover:cursor-pointer text-[#4F55C7]"
            onClick={() => navigate("/newsignup")}
          >
            Sign Up
          </span>
        </div>

        <div>
          <p
            className="ml-40 mt-6 font-roboto text-[20px] text-[#4F55C7] hover:cursor-pointer"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot Password
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewLogin;
