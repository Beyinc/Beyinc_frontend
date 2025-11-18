import React, { useState } from "react";

function NewLogin() {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="flex flex-row bg-[#FFFFFF] h-[800px] w-[1180px] mt-[112px] ml-[130px] shadow-lg rounded-[20px] main-outer-div mb-10">
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

      <div className="w-[450px] h-[445px] ml-[79px] mt-[177px] shadow-2xl">
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
    
        <div id="input-div"></div>


      </div>


    </div>
  );
}

export default NewLogin;
