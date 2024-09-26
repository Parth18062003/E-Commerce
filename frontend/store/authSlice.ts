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
  postalCode: string;
}

interface AuthState {
  user: ReduxUser | null;
  token: string | null;
}

const isBrowser = () => typeof window !== "undefined";

const initialState: AuthState = {
  user: isBrowser() ? JSON.parse(localStorage.getItem("userData") || "null") : null,
  token: isBrowser() ? localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: ReduxUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (isBrowser()) {
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (isBrowser()) {
        localStorage.removeItem("userData");
        Cookies.remove("token");
      }
    },
    setUser(state, action: PayloadAction<ReduxUser>) {
      state.user = action.payload;
      if (isBrowser()) {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      }
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
