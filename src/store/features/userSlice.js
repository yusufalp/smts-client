import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
  },
  reducers: {
    addProfile: (state, action) => ({
      ...state,
      profile: action.payload.profile,
    }),
    removeProfile: (state) => ({
      ...state,
      profile: null,
    }),
  },
});

export const { addProfile, removeProfile } = userSlice.actions;

export default userSlice.reducer;
