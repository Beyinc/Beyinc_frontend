import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../GoogleAuth/GoogleAuth";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import "./NewSignup.css";
export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullname: "",
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

  const signup = async () => {
    setLoading(true);

    try {
      // STEP 1 → send OTP to email
      await ApiServices.sendOtp({
        to: form.email,
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

      // STEP 2 → redirect to OTP page with signup data
      navigate("/verify-otp", {
        state: {
          name: form.fullname,
          email: form.email,
          password: form.password,
        },
      });
    } catch (err) {
      dispatch(
        setToast({
          message: "Failed to send OTP!",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    }

    setLoading(false);
  };

  const isFormValid =
    form.fullname && isEmailValid && isPasswordValid && !loading;

  return (
    <div className="signup-bg-wrapper flex justify-center items-center">
      <div className="relative flex flex-row bg-white h-[850px] w-[1180px] shadow-lg rounded-[20px] main-outer-div">
        <img
          src="/Bloomr-login-logo.svg"
          className="absolute top-6 right-6 h-[74px] w-[214px] cursor-pointer"
          alt="logo"
          onClick={() => navigate("/")}
        />

        <div className="relative h-[692px] w-[541px] ml-[49px] image-div-left">
          <img
            src="/sign-up-bg.jpg"
            className="h-full w-full rounded-[20px] mt-[54px]"
            alt="bg"
          />
          <div className="absolute inset-0 flex flex-col items-center mt-[200px] ml-[-80px] text-white">
            <p className="font-gentium font-bold text-[40px] leading-[45px] tracking-normal mb-[1px]">
              <p>Welcome to Social</p>
              <p>Entrepreneurship</p>
              <p>Platform</p>
            </p>
            <p className="font-gentium font-bold text-[40px] leading-[45px] tracking-normal ml-16 mt-4">
              <p> Increasing the success</p>
              <p>rate of startup</p>
            </p>
          </div>
        </div>

        <div className="w-[450px] h-[445px] ml-[79px] mt-[137px] ">
          <div className="heading-div h-[41px] w-full ml-[60px]">
            <p className="w-full h-full font-gentium font-bold text-[#4F55C7] text-[35px]">
              Create your account
            </p>
          </div>

          <div id="google-auth-div" className="ml-[-50px]">
            <div className="ml-40 mt-4">
              <GoogleAuth />
            </div>

            <div className="ml-36 mt-6 font-roboto text-[16px] flex items-center gap-2">
              <hr className="w-[120px]" />
              <p className="text-sm">OR</p>
              <hr className="w-[120px]" />
            </div>
          </div>

          <div id="input-div" className="flex flex-col mt-[20px]">
            <p className="font-semibold font-roboto text-[16px]">Email</p>
            <input
              type="email"
              name="email"
              value={form.email}
              className={`w-[450px] h-[35px] mt-1 border rounded-md border-black px-2 shadow-md ${
                isEmailValid === null
                  ? ""
                  : isEmailValid
                  ? "border-green-500"
                  : "border-red-500"
              }`}
              placeholder="Email Address"
              onChange={handleChanges}
            />
            <p className="font-semibold font-roboto text-[16px] mt-4">
              Full Name
            </p>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              className="w-[450px] h-[35px] mt-1 border border-black rounded-md px-2 shadow-md"
              placeholder="Full Name"
              onChange={handleChanges}
            />

            <p className="font-semibold font-roboto text-[16px] mt-4">
              Password
            </p>
            <input
              type="password"
              name="password"
              value={form.password}
              className={`w-[450px] h-[35px] mt-1 border border-black rounded-md px-2 shadow-md ${
                isPasswordValid === null
                  ? ""
                  : isPasswordValid
                  ? "border-green-500"
                  : "border-red-500"
              }`}
              placeholder="Create Password"
              onChange={handleChanges}
            />

            <div className="passwordHint" hidden={!form.password}>
              <ul>
                <li
                  className={form.password?.length >= 8 ? "success" : "failure"}
                >
                  <i>Password should be at least 8 character length</i>
                </li>
                <li
                  className={
                    /.*[A-Z].*/.test(form.password) ? "success" : "failure"
                  }
                >
                  <i>At least one capital letter</i>
                </li>
                <li
                  className={
                    /.*[a-z].*/.test(form.password) && form.password
                      ? "success"
                      : "failure"
                  }
                >
                  <i>At least one small letter</i>
                </li>
                <li
                  className={
                    /.*[!@#$%^&*()_+].*/.test(form.password)
                      ? "success"
                      : "failure"
                  }
                >
                  <i>At least one special character (!@#$%^&*()_+)</i>
                </li>
                <li
                  className={
                    /.*[0-9].*/.test(form.password) ? "success" : "failure"
                  }
                >
                  <i>At least one Number</i>
                </li>
              </ul>
            </div>

            <button
              className="w-[450px] h-[52px] mt-6 ml-4 bg-[#4F55C7] text-white rounded-md shadow-md disabled:bg-gray-400"
              disabled={!isFormValid}
              onClick={signup}
            >
              {loading ? "Signing up..." : "Create Account"}
            </button>

            <p className="mt-2 ml-24">
              <span>Already have an account ?</span>
              <span
                className="text-[#4F55C7] hover:cursor-pointer ml-1"
                onClick={() => navigate("/login")}
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
