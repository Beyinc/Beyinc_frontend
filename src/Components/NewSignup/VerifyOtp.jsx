import React, { useState } from "react";
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

  // ⭐ Data received from SignUp via navigate → state
  const { name, email, password } = location.state || {};

  // ❗ If someone manually opens this page without signup
  if (!email || !password || !name) {
    navigate("/signup");
    return null;
  }

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
        // setSendEmailOtpLoading(false);
        // setInputs((prev) => ({ ...prev, isEmailOtpSent: true }));
      })
      .catch((err) => {
        setSendEmailOtpLoading(false);
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
      await ApiServices.verifyOtp({ email, otp });

      // OTP correct
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

    // ---------------------------
    // OTP SUCCESS — NOW REGISTER
    // ---------------------------
    try {
      const res = await ApiServices.register({
        email,
        password,
        userName: name,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);

      navigate("/userDetails");
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
    <div
      className="verify-container w-[444px] h-[605px]  ml-[500px] mt-10
                flex flex-col items-center gap-4 text-center"
    >
      <img src="/verify-otp.png" className="w-[444px] h-[272px]" />

      <p className="font-bold font-gentium text-[35px] text-[#4F55C7]">
        Verify your email
      </p>

      <p className="font-roboto text-black/70">
        We just sent a 6-digit code to aish.beyinc@gmail.com.
      </p>

      <p className="font-roboto text-black/70 mt-[-10px]">Enter it below.</p>

      <div className="w-full flex flex-col items-center gap-3 mt-4">
        <p className="font-semibold">Verification code</p>

        <input
          type="text"
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-[414px] h-[30px] border rounded-md px-2"
        />
        <p>
          <span>Don’t see a code? </span>{" "}
          <span className="text=-[#4F55C7] hover:cursor-pointer" onClick={sendEmailOtp}>
            Resend to email
          </span>
        </p>
        <button
          onClick={handleVerify}
          disabled={loading}
          className="verify-btn w-[414px] h-[40px] rounded-3xl p-[10px]"
        >
          {loading ? "Verifying..." : "Verify email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
