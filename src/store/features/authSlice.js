import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    accessToken: null,
  },
  reducers: {
    login: (state, action) => ({
      ...state,
      currentUser: action.payload.currentUser,
      accessToken: action.payload.accessToken,
    }),
    logout: (state) => ({
      ...state,
      currentUser: null,
      accessToken: null,
    }),
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
