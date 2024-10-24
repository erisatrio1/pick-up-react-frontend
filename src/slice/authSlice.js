import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Initial state untuk auth
const initialState = {
  user: null,         // Data user (nama, email, role)
  accessToken: null,  // Access token
  isLoading: false,   // Status loading
  isSuccess: false,   // Status sukses
  isError: false,     // Status error
  message: "",        // Pesan error
  expire: null,
};

// Async thunk untuk login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      // Kirim permintaan login ke server
      const response = await axios.post("http://localhost:3000/api/users/login", userData);

      // Ambil access token dari response
      const accessToken = response.data.access_token;

      return accessToken;  // Mengembalikan access token ke fulfilled
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk untuk mendapatkan access token baru dengan refresh token
export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, thunkAPI) => {
  try {
    // Kirim request untuk mendapatkan access token baru
    const response = await axios.get("http://localhost:3000/api/users/refresh", { withCredentials: true }); // withCredentials untuk mengirim cookie HttpOnly
    
    // Ambil access token baru
    const accessToken = response.data.access_token;

    return accessToken;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Async thunk untuk mendapatkan user dari token
export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    // Ambil token dari state
    const token = thunkAPI.getState().auth.accessToken;

    if (!token) {
      throw new Error("No token found");
    }

    // Decode token untuk mendapatkan informasi user
    const decoded = jwtDecode(token);

    return decoded;  // Mengembalikan data user yang didecode
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const LogOut = createAsyncThunk("user/LogOut", async() => {
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
      localStorage.removeItem("accessToken");  // Hapus token dari localStorage
    },
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    // Action untuk meng-update token
    setToken: (state, action) => {
        state.user.accessToken = action.payload; // payload adalah token baru
    },
    // Action untuk meng-update expire time jika diperlukan
    setExpire: (state, action) => {
        state.user.expire = action.payload; // payload adalah waktu expire baru
    },
  },
  extraReducers: (builder) => {
    // Ketika login dimulai
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });

    // Ketika login berhasil
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.accessToken = action.payload;  // Simpan access token

      // Decode token untuk mendapatkan data user (nama, email, role)
      const decoded = jwtDecode(action.payload);
      state.user = {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
      state.expire = decoded.exp;
    });

    // Ketika login gagal
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Ketika refresh token dimulai
    builder.addCase(refreshToken.pending, (state) => {
      state.isLoading = true;
    });

    // Ketika refresh token berhasil
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.accessToken = action.payload;  // Simpan access token baru

      // Decode token untuk mendapatkan data user (nama, email, role)
      const decoded = jwtDecode(action.payload);
      state.user = {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
    });

    // Ketika refresh token gagal
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Ketika getMe dimulai
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });

    // Ketika getMe berhasil
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = {
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
      };
    });

    // Ketika getMe gagal
    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

// Export action untuk logout dan reset
export const { logout, reset, setToken, setExpire } = authSlice.actions;

// Export reducer untuk authSlice
export default authSlice.reducer;
