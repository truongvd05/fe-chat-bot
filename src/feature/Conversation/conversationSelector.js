export const selectTotalUnread = (state) => state.conversation.totalUnread;
export const selectUnreadOfConv = (convId) => (state) =>
  state.conversation.unreadCounts[convId] ?? 0;
