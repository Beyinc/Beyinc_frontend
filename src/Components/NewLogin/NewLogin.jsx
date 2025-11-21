import React, { useState } from "react";

function NewLogin() {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="relative flex flex-row bg-[#FFFFFF] h-[800px] w-[1180px] mt-[112px] ml-[130px] shadow-lg rounded-[20px] main-outer-div mb-10">
      {/* Logo top-right */}
      <img
        src="/Bloomr-login-logo.svg"
        className="absolute top-6 right-6 h-[74px]  w-[214px]"
        alt="logo"
      />

      {/* this is image div*/}
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

      {/* this is the second div */}

      <div className="w-[450px] h-[445px] ml-[79px] mt-[177px] ">
        <div className="heading-div h-[41px] ml-[181px]">
          {/*Log in heading div */}
          <p className="w-full h-full font-gentium font-bold text-[#4F55C7] text-[35px]">
            Log In
          </p>
        </div>

        <div
          id="email-mobile-div"
          className="flex flex-row gap-44 ml-[79px] mt-[85px]"
        >
          {/* Email Tab */}
          <p
            className={`
      font-bold text-[20px] text-[#4F55C7] font-roboto cursor-pointer relative pb-2
      transition-all duration-300 ease-in-out
    `}
            onClick={() => setActiveTab("email")}
          >
            Email
            {/* underline */}
            <span
              className={`
        absolute left-0 bottom-0 h-[3px] w-full bg-[#4F55C7] rounded-md
        transition-all duration-300 ease-in-out
        ${
          activeTab === "email"
            ? "opacity-100 scale-x-100"
            : "opacity-0 scale-x-0"
        }
      `}
            ></span>
          </p>

          <p
            className={`
      font-bold text-[20px] text-[#4F55C7] font-roboto cursor-pointer relative pb-2
      transition-all duration-300 ease-in-out
    `}
            onClick={() => setActiveTab("mobile")}
          >
            Mobile
            {/* underline */}
            <span
              className={`
        absolute left-0 bottom-0 h-[3px] w-full bg-[#4F55C7] rounded-md
        transition-all duration-300 ease-in-out
        ${
          activeTab === "mobile"
            ? "opacity-100 scale-x-100"
            : "opacity-0 scale-x-0"
        }
      `}
            ></span>
          </p>
        </div>

        {activeTab == "email" ? (
          <div id="input-div" className="flex flex-col mt-[40px]">
            <p className="font-semibold font-roboto text-[16px]">
              Email Address
            </p>

            <input
              type="text"
              className="w-[450px] h-[35px] mt-1 border border-black rounded-md px-2"
            />

            <p className="font-semibold font-roboto text-[16px] mt-4">
              Password
            </p>

            <input
              type="password"
              className="w-[450px] h-[35px] mt-1 border border-black rounded-md px-2"
            />
            <button className="font-bold font-roboto rounded-3xl ml-5 mt-4 text-[20px]">
              Login
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-600 font-medium">
            This feature is currently under maintenance. Please check back soon.
          </div>
        )}
        

        <div className="ml-36 mt-6 font-roboto text-[20px]"><span>New Here ?</span> <span className="hover:cursor-pointer text-[#4F55C7]">Sign Up</span></div>
       <div><p className="ml-40 mt-6 font-roboto text-[20px] text-[#4F55C7] hover:cursor-pointer">Forgot Password</p></div>

      </div>
    </div>
  );
}

export default NewLogin;
