/* eslint-disable */

import axios from "axios";

const token = '';
const ENV = process.env;


var axiosInstance = axios.create({
  baseURL: ENV.REACT_APP_BACKEND,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const accessToken = JSON.parse(user).accessToken;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (e) {
        console.error("Error parsing user from local storage", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const customFnAddTokenInHeader = (accessToken) => {
  // This function is now redundant but kept for compatibility with existing calls
  // The interceptor above handles token injection dynamically
};

axiosInstance.customFnAddTokenInHeader = customFnAddTokenInHeader;

export default axiosInstance;
