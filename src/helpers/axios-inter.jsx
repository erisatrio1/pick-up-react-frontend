import axios from "axios";
import {store} from "../store/index"; // pastikan path ke store benar
import { setToken } from "../slice/authSlice"; // Import action untuk update token

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const { expire, accessToken } = store.getState().auth; // Ambil accessToken dan expire dari state auth
    
    if (expire * 1000 < currentDate.getTime()) {
      try {
        const response = await axios.get("http://localhost:3000/api/users/refresh", {}, {
          withCredentials: true, // Mengizinkan pengiriman cookie
        });
        console.log(response.data.access_token);
        const newAccessToken = response.data.access_token;
        
        // Set the new token to the header
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Update Redux state dengan dispatch langsung dari store
        store.dispatch(setToken(newAccessToken));
        return config;
      } catch (error) {
        // Handle error jika refresh token gagal
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
