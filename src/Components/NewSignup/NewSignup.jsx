import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../GoogleAuth/GoogleAuth";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import "./NewSignup.css";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [isPasswordValid, setIsPasswordValid] = useState(null);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(value));
    }

    if (name === "password") {
      const passValid =
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[!@#$%^&*()_+]/.test(value);
      setIsPasswordValid(passValid);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ApiServices.sendOtp({
        to: form.email,
        type: "Sign Up",
        subject: "Email Verification",
      });

      dispatch(
        setToast({
          message: "OTP Sent Successfully!",
          bgColor: ToastColors.success,
          visible: "yes",
        })
      );

      navigate("/verify-otp", {
        state: {
          email: form.email,
          password: form.password,
        },
      });
    } catch (err) {
      dispatch(
        setToast({
          message: err?.response?.data?.message || "Failed to send OTP!",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isEmailValid && isPasswordValid && !loading;

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

        {/* Left Image */}
        <div className="hidden md:block w-[40%] relative p-10">
          <img
            src="/sign-up-bg.jpg"
            className="w-full h-full rounded-xl object-cover"
            alt="bg"
          />

          <div className="absolute inset-0 flex flex-col justify-center text-white text-left ml-20 mb-36">
            <p className="font-gentium text-[35px] font-bold leading-[45px]">
              Welcome to Social <br />
              Entrepreneurship <br />
              Platform
            </p>

            <p className="font-gentium font-bold text-[30px] leading-[40px] mt-2">
              Increasing the success <br />
              rate of startup
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-[50%] p-6 md:p-10">
          <p className="text-[#4F55C7] font-gentium text-xl font-bold text-center mr-8 mt-14 md:mr-0 md:mt-10 md:text-3xl">
            Create your account{" "}
          </p>
          {/* Google Auth */}
          <div className="mr-10 mt-4 md:mr-0">
            <div className="flex justify-center">
              <GoogleAuth />
            </div>
            <div className="flex items-center justify-center gap-2 my-6">
              <hr className="w-24" />
              <span className="text-sm">OR</span>
              <hr className="w-24" />
            </div>
          </div>
          {/* Email */}
          <div className="mt-6 ml-6 md:mt-6">
            <p className="font-medium">Email Address</p>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChanges}
              placeholder="Email Address"
              className={`w-full h-6 mt-1 border rounded-md px-2 shadow-sm ${
                isEmailValid === null
                  ? ""
                  : isEmailValid
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            />

            {/* Password */}
            <p className="font-medium mt-4">Password</p>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChanges}
              placeholder="Password"
              className={`w-full h-6 mt-1 border rounded-md px-2 shadow-sm ${
                isPasswordValid === null
                  ? ""
                  : isPasswordValid
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            />

            {/* Password Hint */}
            <div className="passwordHint" hidden={!form.password}>
              <ul>
                <li
                  className={form.password?.length >= 8 ? "success" : "failure"}
                >
                  <i>Password should be at least 8 characters long</i>
                </li>
                <li
                  className={
                    /[A-Z]/.test(form.password) ? "success" : "failure"
                  }
                >
                  <i>At least one capital letter</i>
                </li>
                <li
                  className={
                    /[a-z]/.test(form.password) ? "success" : "failure"
                  }
                >
                  <i>At least one small letter</i>
                </li>
                <li
                  className={
                    /[!@#$%^&*()_+]/.test(form.password) ? "success" : "failure"
                  }
                >
                  <i>At least one special character (!@#$%^&*()_+)</i>
                </li>
                <li
                  className={
                    /[0-9]/.test(form.password) ? "success" : "failure"
                  }
                >
                  <i>At least one number</i>
                </li>
              </ul>
            </div>

            {/* Sign Up Button */}
            <button
              disabled={!isFormValid || loading}
              onClick={handleSignup}
              className="w-[80%] md:w-full bg-[#4F55C7] text-white font-bold py-2 rounded-full mt-6 flex justify-center items-center"
            >
              {loading ? "Creating Account..." : "Create account"}
            </button>
          </div>
          {/* OR Divider */}
          <div className="mr-10 md:mr-0">
            <div className="text-center font-roboto mx-8 mt-4 md:mx-20">
              <p>
                <span>By clicking Create account, You agree to our </span>
                <span className="text-[#4F55C7]">
                  Terms of Service and Privacy Policy.
                </span>
              </p>
            </div>

            <div className="text-center mt-6 text-lg">
              Already have an account?{" "}
              <span
                className="text-[#4F55C7] cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log In
              </span>
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}

export default Signup;
