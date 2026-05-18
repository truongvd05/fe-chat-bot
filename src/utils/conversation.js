// src/utils/conversation.js

export const getConversationName = (conversation, currentUserId) => {
  if (!conversation) return "";
  if (conversation.type === "GROUP") {
    return conversation.title ?? "Nhóm không có tên";
  }
  const other = conversation.participants?.find(
    (p) => p.user.id !== currentUserId,
  );
  return other?.user?.name ?? "Người dùng";
};

export const getConversationAvatar = (conversation, currentUserId) => {
  if (!conversation) return null;
  if (conversation.type === "GROUP") {
    return conversation.avatarUrl ?? null;
  }
  const other = conversation.participants?.find(
    (p) => p.user.id !== currentUserId,
  );
  return other?.user?.avatarUrl ?? null;
};

export const getConversationOther = (conversation, currentUserId) => {
  if (!conversation || conversation.type !== "DIRECT") return null;
  return (
    conversation.participants?.find((p) => p.user.id !== currentUserId)?.user ??
    null
  );
};
