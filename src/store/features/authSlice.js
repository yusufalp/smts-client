import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
  },
  reducers: {
    login: (state, action) => ({
      ...state,
      accessToken: action.payload.accessToken,
    }),
    logout: (state) => ({
      ...state,
      accessToken: null,
    }),
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
