import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getApiError } from "../../api/axios.js";

const savedAuth = JSON.parse(localStorage.getItem("finioAuth") || "null");

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/register", payload);
      return data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/login", payload);
      return data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/api/user/profile", payload);
      return data; // { id, name, email }
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("finioAuth");
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("finioAuth", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("finioAuth", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile update — patch the stored user so the header reflects the new name/email
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        const stored = JSON.parse(localStorage.getItem("finioAuth") || "{}");
        localStorage.setItem(
          "finioAuth",
          JSON.stringify({ ...stored, user: state.user })
        );
      });
  }
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
