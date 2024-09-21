import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    expiresAt: null,
  },
  reducers: {
    login: (state, action) => ({
      ...state,
      accessToken: action.payload.accessToken,
      expiresAt: action.payload.expiresAt,
    }),
    logout: (state) => ({
      ...state,
      accessToken: null,
      expiresAt: null,
    }),
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
