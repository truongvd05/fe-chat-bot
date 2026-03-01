import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
};
const onlineUser = createSlice({
  name: "online",
  initialState,
  reducers: {
    setUserOnline: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    setUserOffline: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload,
      );
    },
  },
});

export const { setUserOnline, setUserOffline } = onlineUser.actions;

export default onlineUser.reducer;
