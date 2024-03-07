import { jwtDecode } from 'jwt-decode';
import React , {useEffect, useState}from 'react'
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export const LoginAuth = (Component) => {
    return function WithHooks(props) {
        const { email } = useSelector(
            (store) => store.auth.loginDetails
        );
        const [loading, setLoading] = useState(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return (
            email !== undefined ? <Home /> : loading ? <></> : <Component />
        )
    } 
}

export const AdminDeciderHoc = (Component) => {
    return function WithHooks(props) {
        const [loading, setLoading] = useState(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const { role } = useSelector(state => state.auth.loginDetails);
        return (
            (role !== undefined && role == 'Admin') ? <Component /> : loading ? <></> : <Home />
        )
    }
}

const AuthHoc = (Component) => {
    return function WithHooks(props) {
        const [loading, setLoading] = useState(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const { email } = useSelector(
            (store) => store.auth.loginDetails
        );

        return(
            (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).accessToken)? <Component /> : loading ? <></> :<Login />
        )
    }
}

export default AuthHoc