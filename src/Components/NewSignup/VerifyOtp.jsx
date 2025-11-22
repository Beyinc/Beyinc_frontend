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
    <div className="verify-container">
      <h2>Email Verification</h2>

      <input
        type="text"
        placeholder="Enter 6 digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="verify-btn"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
};

export default VerifyOtp;
