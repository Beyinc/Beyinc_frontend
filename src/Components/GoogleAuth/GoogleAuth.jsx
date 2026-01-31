
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";

const GoogleAuth = () => {
  const navigate = useNavigate();

  async function handleCallback(response) {
    try {
      const decoded = jwtDecode(response.credential);

      const res = await ApiServices.SSORegister({
        email: decoded.email,
        userName: decoded.email.split("@")[0],
        role: "",
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);

      // get profile using returned user_id
      const profile = await ApiServices.getProfile({
        user_id: res.data.user_id,
      });

      if (profile.data.isProfileComplete === false) {
         window.location.href = "/editProfile";
      } else {
        window.location.href = "/posts";
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    window?.google?.accounts?.id.initialize({
      client_id: process.env.REACT_APP_CALENDER_CLIENT_ID,
      callback: handleCallback,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("signIn"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  return (
    <main className="main">
      <div className="container">
        <section className="wrapper">
          <div id="signIn"></div>
        </section>
      </div>
    </main>
  );
};

export default GoogleAuth;
