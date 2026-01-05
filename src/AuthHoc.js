import React, { useEffect, useState } from "react";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import { useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { ApiServices } from "./Services/ApiServices";
import EntryDetails from "./Components/EntryDetails/EntryDetails";

export const LoginAuth = (Component) => {
  return function WithHooks(props) {
    const navigate = useNavigate();
    useEffect(() => {
      if (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).accessToken) {
        navigate("/posts");
      }
    }, []);
    return <Component />;
  };
};

export const AdminDeciderHoc = (Component) => {
  return function WithHooks(props) {
    const [loading, setLoading] = useState(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    const { role } = useSelector((state) => state.auth.loginDetails);
    return role !== undefined && role == "Admin" ? (
      <Component />
    ) : loading ? (
      <></>
    ) : (
      <Home />
    );
  };
};

const AuthHoc = (Component) => {
  return function WithHooks(props) {
    const [loading, setLoading] = useState(true);
    const [firstTime, setFirstTime] = useState(null);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    const { email } = useSelector((store) => store.auth.loginDetails);
    const checkFirsttime = async () => {
      if (
        localStorage.getItem("user") &&
        JSON.parse(localStorage.getItem("user")).accessToken
      ) {
        const res = await ApiServices.isFirstTimeLogin();
        return setFirstTime(!res.data.isProfileComplete);
      }
      setFirstTime(false);
    };
    useEffect(() => {
      checkFirsttime();
    }, []);

    return localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user")).accessToken ? (
      firstTime !== null && (firstTime ? (
        // <UserDetails />
        <EntryDetails />
      ) : (
        <Component />
      ))
    ) : loading ? (
      <></>
    ) : (
      <Navigate to="/posts" />
    );
  };
};

export default AuthHoc;
