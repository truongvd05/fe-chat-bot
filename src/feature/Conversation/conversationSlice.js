import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadCounts: {}, // { conversationId: count }
  totalUnread: 0,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setUnreadCount(state, action) {
      const { conversationId, count } = action.payload;
      state.unreadCounts[conversationId] = count;
      state.totalUnread = Object.values(state.unreadCounts).reduce(
        (sum, c) => sum + c,
        0,
      );
    },
    clearUnread(state, action) {
      const { conversationId } = action.payload;
      state.unreadCounts[conversationId] = 0;
      state.totalUnread = Object.values(state.unreadCounts).reduce(
        (sum, c) => sum + c,
        0,
      );
    },
  },
});

export const { setUnreadCount, clearUnread } = conversationSlice.actions;
export default conversationSlice.reducer;
