import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";


import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";

const GoogleAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleCallback(response) {
        // console.log("Encoded", jwtDecode(response.credential));
        await ApiServices.SSORegister({ email: jwtDecode(response.credential).email, userName: jwtDecode(response.credential).email.split('@')[0], role: '' }).then(async(res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
            await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
            window.location.href = "/posts";
        }).catch(err=>console.log(err))
    }

    useEffect(() => {
        window?.google?.accounts?.id.initialize({
            client_id: process.env.REACT_APP_CALENDER_CLIENT_ID,
            callback: handleCallback,
        });

        window.google.accounts.id.renderButton(document.getElementById("signIn"), {
            theme: "outline",
            size: "large",
        });
    }, []);

    return (
        <div>
            <main class="main">
                <div class="container">
                    <section class="wrapper">
                        <div id="signIn" style={{}}></div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default GoogleAuth;