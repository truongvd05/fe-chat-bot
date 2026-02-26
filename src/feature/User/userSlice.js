import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logOut(state, action) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;
