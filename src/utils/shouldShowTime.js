const shouldShowTime = (messages, index) => {
  const curr = messages[index];
  const next = messages[index + 1]; // undefined nếu là tin cuối → OK

  if (!next) return true;
  if (!curr) return true;
  if (curr.userId !== next.userId) return true;

  const diff = new Date(next.createdAt) - new Date(curr.createdAt);
  return diff > 5 * 60 * 1000;
};

export default shouldShowTime;
