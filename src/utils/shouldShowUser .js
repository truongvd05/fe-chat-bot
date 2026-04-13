const shouldShowUser = (messages, index) => {
  if (index === 0) return true;

  const prev = messages[index - 1];
  const curr = messages[index];

  if (prev.userId !== curr.userId) return true;

  const diff = new Date(curr.createdAt) - new Date(prev.createdAt);

  return diff > 5 * 60 * 1000;
};

export default shouldShowUser;
