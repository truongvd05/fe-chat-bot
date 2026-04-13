import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userIds: [],
};
const onlineUsersSlice = createSlice({
  name: "online",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.userIds = action.payload.map(String);
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;
