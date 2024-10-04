"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface Role {
  id: string;
  name: string;
}

interface ReduxUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  roles: Role[];
  city: string;
  state: string;
  country: string;
  postalCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  is2FAEnabled: boolean;
  profileImageUrl: string;
}

interface AuthState {
  user: ReduxUser | null;
  token: string | null;
}

const isBrowser = () => typeof window !== "undefined";

const initialState: AuthState = {
  user: isBrowser()
    ? JSON.parse(localStorage.getItem("userData") || "null")
    : null,
  token: isBrowser() ? localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      if (isBrowser()) {
        Cookies.set("token", action.payload.token, { expires: 7, path: "/" });
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (isBrowser()) {
        localStorage.removeItem("userData");
        Cookies.remove("token");
        localStorage.removeItem("deviceLogs");  
        localStorage.removeItem("lastDeviceInfo");
        localStorage.removeItem("users");
        localStorage.removeItem("currentPage");
      }
    },
    setUser(state, action: PayloadAction<ReduxUser>) {
      state.user = action.payload;
      if (isBrowser()) {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      }
    },
    updateUser(state, action: PayloadAction<Partial<ReduxUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; // Merge existing user with new fields
        if (isBrowser()) {
          localStorage.setItem("userData", JSON.stringify(state.user));
        }
      }
    },
    update2FAStatus(state, action: PayloadAction<boolean>) {
      if (state.user) {
        state.user.is2FAEnabled = action.payload;
        if (isBrowser()) {
          localStorage.setItem("userData", JSON.stringify(state.user));
        }
      }
    },
    // New action to update the profile image URL
    updateProfileImageUrl(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.profileImageUrl = action.payload;
        if (isBrowser()) {
          localStorage.setItem("userData", JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { 
  login, 
  logout, 
  setUser, 
  updateUser, 
  update2FAStatus, 
  updateProfileImageUrl // Export the new action
} = authSlice.actions;

export default authSlice.reducer;
