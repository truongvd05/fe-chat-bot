// feature/OnlineUsers/onlineUsersSelector.js
export const selectIsUserOnline = (userId) => (state) => {
  return state.onlineUsers.userIds.includes(String(userId));
};
