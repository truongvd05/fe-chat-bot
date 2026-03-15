import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: localStorage.getItem("access_token") || null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.accessToken = token.access_token;
      state.isLoggedIn = true;
      localStorage.setItem("access_token", token.access_token);
      localStorage.setItem("refresh_token", token.refresh_token);
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem("access_token", action.payload);
    },
    logOut(state, action) {
      state.user = null;
      state.accessToken = null;
      state.isLoggedIn = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
});

export const { setUser, logOut, setAccessToken } = userSlice.actions;
export default userSlice.reducer;
