import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming you use axios

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// User info interface based on your JSON
interface UserInfo {
  User_id: string;
  "Mobile Number": string;
  "Email id": "user@example.com";
  Image: string;
  "User Name": string;
  Role: string;
}

// Auth state structure
interface AuthState {
  loading: boolean;
  userInfo: UserInfo | null;
  userToken: string | null;
  error: any;
  success: boolean;
}

// Get user token from localStorage
const userToken = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null;

const initialState: AuthState = {
  loading: false,
  userInfo: null, // You might want to fetch user info if token exists
  userToken: userToken,
  error: null,
  success: false,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: { "Email id": string; Password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/user/login`, loginData); // Adjust endpoint if needed
      // Save token to local storage
      localStorage.setItem('userToken', data.token);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      // The response should contain the user object and a token
      const { data } = await axios.post(`${API_URL}/user/register`, userData); // Adjust endpoint if needed
      return data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken'); // remove token from storage
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.userInfo = payload.user;
        state.userToken = payload.token;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.userInfo = payload.user;
        state.userToken = payload.token;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;