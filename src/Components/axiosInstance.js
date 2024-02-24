/* eslint-disable */

import axios from "axios";

const token = '';
const ENV = process.env
var axiosInstance = axios.create({
    baseURL: ENV.REACT_APP_BACKEND,
    headers: {
      "Authorization": `Bearer ${token}`
    },
   
  })

  //This allows you to intercept the response and check the status and error messages and if ncessary reject the promise.
  axiosInstance.interceptors.response.use((response) => {
    return response
  }, (error) => {
    return Promise.reject(error);
  })

  const customFnAddTokenInHeader = (accessToken)=>{
    axiosInstance.interceptors.request.use((config)=>{
      config.headers.Authorization=`Bearer ${accessToken}`;
      return config;
    }, (error) => {
      console.error('customFnAddTokenInHeader Interceptor Request Error' + error);
    });
  }

  axiosInstance.customFnAddTokenInHeader=customFnAddTokenInHeader;

  export default axiosInstance
