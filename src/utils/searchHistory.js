const KEY = "recent_search";
const MAX = 5;

// Lưu user object thay vì keyword
export const getRecentSearch = () =>
  JSON.parse(localStorage.getItem(KEY) || "[]");

export const addRecentSearch = (user) => {
  // user = { id, name, email, avatar, ... }
  const prev = getRecentSearch().filter((u) => u.id !== user.id); // tránh trùng
  const next = [user, ...prev].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
};

export const removeRecentSearch = (userId) => {
  const next = getRecentSearch().filter((u) => u.id !== userId);
  localStorage.setItem(KEY, JSON.stringify(next));
};

export const clearRecentSearch = () => localStorage.removeItem(KEY);
