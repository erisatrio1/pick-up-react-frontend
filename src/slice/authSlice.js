import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from 'js-cookie';

const initialState = {
  user: null,      
  accessToken: null,  
  refreshToken: null,  
  isLoading: false,   
  isSuccess: false,   
  isError: false,     
  message: "",        
  expire: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {

      const response = await axios.post("http://localhost:3000/api/users/login", userData);

      const accessToken = response.data.access_token;
      Cookies.set('refresh_token', response.data.refresh_token, { path: '/', expires: 1, sameSite: 'None', secure: false });

      return accessToken;  
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.errors);
    }
  }
);

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:3000/api/users/refresh", { withCredentials: true }); // withCredentials untuk mengirim cookie HttpOnly
    
    const accessToken = response.data.access_token;

    return accessToken;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.accessToken;

    if (!token) {
      throw new Error("No token found");
    }

    const decoded = jwtDecode(token);

    return decoded;  
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const LogOut = createAsyncThunk("user/LogOut", async() => {
    Cookies.remove('refresh_token', { path: '/' });
    await axios.delete('http://localhost:3000/api/users/current');
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isSuccess = false;
      localStorage.removeItem("accessToken");  
    },
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setToken: (state, action) => {
        state.user.accessToken = action.payload; 
    },
    setExpire: (state, action) => {
        state.user.expire = action.payload; 
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.accessToken = action.payload;  

      const decoded = jwtDecode(action.payload);
      state.user = {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
      state.expire = decoded.exp;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    builder.addCase(refreshToken.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.accessToken = action.payload;  

      const decoded = jwtDecode(action.payload);
      state.user = {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
    });

    builder.addCase(refreshToken.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = {
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
      };
    });

    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { logout, reset, setToken, setExpire } = authSlice.actions;

export default authSlice.reducer;
