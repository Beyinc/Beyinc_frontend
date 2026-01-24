// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { setToast } from "../../redux/AuthReducers/AuthReducer";
// import { ToastColors } from "../Toast/ToastColors";
// import { ApiServices } from "../../Services/ApiServices";
// import axiosInstance from "../axiosInstance";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";

// const VerifyOtp = () => {
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
// const [sendEmailOtpLoading, setSendEmailOtpLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ⭐ Data received from SignUp via navigate → state
//   const {  email, password } = location.state || {};

//   // ❗ If someone manually opens this page without signup
//   useEffect(()=>{
//  if (!email || !password ) {
//     navigate("/signup");
//     return null;
//   }
//   },[])
 

//   const sendEmailOtp = async (e) => {
//     e.preventDefault();
//     setSendEmailOtpLoading(true);
//     e.target.disabled = true;
//     await ApiServices.sendOtp({
//       to: email,
//       type: "Sign Up",
//       subject: "Email Verification",
//     })
//       .then((res) => {
//         dispatch(
//           setToast({
//             message: "OTP sent successfully !",
//             bgColor: ToastColors.success,
//             visible: "yes",
//           })
//         );
//         // setIsEmailOtpSent(true);
//         // setSendEmailOtpLoading(false);
//         // setInputs((prev) => ({ ...prev, isEmailOtpSent: true }));
//       })
//       .catch((err) => {
//         setSendEmailOtpLoading(false);
//         dispatch(
//           setToast({
//             message: "OTP sent failed !",
//             bgColor: ToastColors.failure,
//             visible: "yes",
//           })
//         );
//         e.target.disabled = true;
//       });
//   };

//   const handleVerify = async () => {
//     if (!otp || otp.length !== 6) {
//       dispatch(
//         setToast({
//           message: "Enter a valid 6 digit OTP",
//           bgColor: ToastColors.failure,
//           visible: "yes",
//         })
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       await ApiServices.verifyOtp({ email, otp });

//       // OTP correct
//     } catch (err) {
//       dispatch(
//         setToast({
//           message: "Incorrect OTP",
//           bgColor: ToastColors.failure,
//           visible: "yes",
//         })
//       );
//       setLoading(false);
//       return;
//     }

//     // ---------------------------
//     // OTP SUCCESS — NOW REGISTER
//     // ---------------------------
//     try {
//       const res = await ApiServices.register({
//         email,
//         password,
//       });

//       localStorage.setItem("user", JSON.stringify(res.data));
//       await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);

//       navigate("/userDetails");
//     } catch (err) {
//       dispatch(
//         setToast({
//           message: err.response?.data?.message || "Registration failed",
//           bgColor: ToastColors.failure,
//           visible: "yes",
//         })
//       );
//     }

//     setLoading(false);
//   };

//   return (
//     <div
//       className="verify-container w-[444px] h-[605px]  ml-[500px] mt-10
//                 flex flex-col items-center gap-4 text-center"
//     >
//       <img src="/verify-otp.png" className="w-[444px] h-[272px]" />

//       <p className="font-bold font-gentium text-[35px] text-[#4F55C7]">
//         Verify your email
//       </p>

//       <p className="font-roboto text-black/70">
//         We just sent a 6-digit code to aish.beyinc@gmail.com.
//       </p>

//       <p className="font-roboto text-black/70 mt-[-10px]">Enter it below.</p>

//       <div className="w-full flex flex-col items-center gap-3 mt-4">
//         <p className="font-semibold">Verification code</p>

//         <input
//           type="text"
//           placeholder="Enter 6 digit OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           maxLength={6}
//           className="w-[414px] h-[30px] border rounded-md px-2"
//         />
//         <p>
//           <span>Don’t see a code? </span>{" "}
//           <span className="text=-[#4F55C7] hover:cursor-pointer" onClick={sendEmailOtp}>
//             Resend to email
//           </span>
//         </p>
//         <button
//           onClick={handleVerify}
//           disabled={loading}
//           className="verify-btn w-[414px] h-[40px] rounded-3xl p-[10px]"
//         >
//           {loading ? "Verifying..." : "Verify email"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VerifyOtp;


import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendEmailOtpLoading, setSendEmailOtpLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { email, password } = location.state || {};

  useEffect(() => {
    if (!email || !password) {
      navigate("/signup");
    }
  }, []);

  const sendEmailOtp = async (e) => {
    e.preventDefault();
    setSendEmailOtpLoading(true);

    try {
      await ApiServices.sendOtp({
        to: email,
        type: "Sign Up",
        subject: "Email Verification",
      });

      dispatch(
        setToast({
          message: "OTP sent successfully!",
          bgColor: ToastColors.success,
          visible: "yes",
        })
      );
    } catch (err) {
      dispatch(
        setToast({
          message: "OTP sending failed!",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    } finally {
      setSendEmailOtpLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      dispatch(
        setToast({
          message: "Enter a valid 6 digit OTP",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
      return;
    }

    setLoading(true);

    try {
      const res=await ApiServices.verifyOtp({ email, otp });
      console.log("OTP verification response:", res);
    } catch (err) {
      dispatch(
        setToast({
          message: "Incorrect OTP",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
      setLoading(false);
      return;
    }

    try {
      const res = await ApiServices.register({ email, password });
      console.log("Registration response:", res);
      localStorage.setItem("user", JSON.stringify(res.data));
      await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
      // navigate("/userDetails");
            window.location.href = "/userDetails";

    } catch (err) {
      dispatch(
        setToast({
          message: err.response?.data?.message || "Registration failed",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 mt-[-50px]">
      <img
        src="/verify-otp.png"
        className="w-full max-w-[400px] sm:max-w-[444px] h-auto mb-4"
        alt="Verify OTP"
      />

      <p className="font-bold font-gentium text-2xl sm:text-3xl text-[#4F55C7] text-center">
        Verify your email
      </p>

      <p className="font-roboto text-black/70 text-center mt-2">
        We just sent a 6-digit code to <br className="sm:hidden" /> {email}
      </p>
      <p className="font-roboto text-black/70 text-center mt-1">
        Enter it below.
      </p>

      <div className="w-full max-w-[400px] sm:max-w-[444px] flex flex-col items-center gap-3 mt-4">
        <p className="font-semibold text-left w-full ml-56 md:ml-0">Verification code</p>

        <input
          type="text"
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full h-7 border rounded-md px-3 text-center text-lg"
        />

        <p className="text-sm text-center">
          <span>Don’t see a code? </span>
          <span
            className="text-[#4F55C7] hover:cursor-pointer underline"
            onClick={sendEmailOtp}
          >
            {sendEmailOtpLoading ? "Sending..." : "Resend to email"}
          </span>
        </p>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-[#4F55C7] text-white font-bold py-3 rounded-2xl mt-2 hover:bg-indigo-600 transition"
        >
          {loading ? "Verifying..." : "Verify email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
