/* eslint-disable camelcase */
/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../Components/axiosInstance';
import { ApiServices } from '../../Services/ApiServices';


export const apiCallSlice = createSlice(
  {
    name: 'apiCall',
    initialState: {
      loginDetails: {},
      userDetails: {}, 

      ToastDetails: {
        message: '',
        bgColor: '',
        visible: 'no'
      },
      LoadingDetails: {
        visible: 'no'
      },
      totalRoles: []
    },
    reducers: {
      setLoginData: (state, action) => {
        state.loginDetails = action.payload;
      },
      setUserDetails: (state, action) => {   // Adding the setUserDetails reducer
        state.userDetails = action.payload;
      },
      setToast: (state, action) => {
        state.ToastDetails = action.payload;
      },
      setLoading: (state, action) => {
        state.LoadingDetails = action.payload;
      },
      setTotalRoles: (state, action) => {
        state.totalRoles = action.payload;
      },
    }
  });

  export const apicallloginDetails = () => (dispatch) => {
    const user = localStorage.getItem('user');
    if (user) {
      const accessToken = JSON.parse(user).accessToken;
  
      // Add token to headers
      axiosInstance.customFnAddTokenInHeader(accessToken);
  
      dispatch(setLoading({ visible: 'yes' }));
  
      // Verify access token
      ApiServices.verifyAccessToken({ accessToken })
        .then((res) => {
          // Update user details in local storage
          localStorage.setItem('user', JSON.stringify(res));
  
          // Decode and dispatch user data
          const decodedUser = jwtDecode(accessToken);
          dispatch(setLoginData(decodedUser));
  
          // Update token in headers after verification
          axiosInstance.customFnAddTokenInHeader(accessToken);
  
          // Fetch user profile data
          return ApiServices.getProfile();
        })
        .then((userData) => {
          console.log('API call login successful', userData.data);
  
          dispatch(setUserDetails(userData.data));
         dispatch(setLoading({ visible: 'no' }));
        })
        .catch((err) => {
          console.log('Error during login details API call:', err);
  
          // If token verification fails or any error occurs
          localStorage.removeItem('user');
          window.location.href = '/login';
          dispatch(setLoading({ visible: 'no' }));
        });
    }
  };
  

export const { setLoginData, setToast, setLoading, setTotalRoles, setUserDetails } = apiCallSlice.actions;

// this is for configureStore
export default apiCallSlice.reducer;