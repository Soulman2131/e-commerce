import { createSlice } from "@reduxjs/toolkit";

// ça compte pour le dispatch
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getAuth: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      // localStorage.removeItem("userInfo");
      localStorage.clear();
    },
  },
});

export const selectedAllUsers = (state) => state.auth;
export const { getAuth, logout } = authSlice.actions;
export default authSlice.reducer;
