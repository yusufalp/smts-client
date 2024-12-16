import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
  },
  reducers: {
    setProfile: (state, action) => ({
      ...state,
      profile: action.payload.profile,
    }),
    removeProfile: (state) => ({
      ...state,
      profile: null,
    }),
  },
});

export const { setProfile, removeProfile } = userSlice.actions;

export default userSlice.reducer;
