import axios from "axios";
import {store} from "../store/index"; 
import { setToken } from "../slice/authSlice"; 
import Cookies from 'js-cookie';

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const { expire, accessToken } = store.getState().auth; 
    
    if (expire * 1000 < currentDate.getTime()) {
      try {
        const refreshToken = Cookies.get('refresh_token');
        console.log(refreshToken);
        const response = await axios.get("http://localhost:3000/api/users/refresh", {}, {
          withCredentials: true, 
        });
        console.log(response.data.access_token);
        const newAccessToken = response.data.access_token;
        
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        
        store.dispatch(setToken(newAccessToken));
        return config;
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosJWT;
