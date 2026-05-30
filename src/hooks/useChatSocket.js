import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { conversationApi } from "@/feature/Conversation/conversationApi";
import { getSocket } from "@/socket/socket";
import { messageApi } from "@/feature/Message/messageApi";
import { store } from "@/store/store";
import { selectUser } from "@/feature/User/userSelector";

/**
 * Xử lý tất cả socket events trong chat:
 * - receive_message
 * - group_event (kick, leave, add, promote)
 * - typing_users
 */
export function useChatSocket({
  socket,
  conversationId,
  user,
  setSuggestions,
  refetchConversation,
  handleNewMessage,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [typingUsers, setTypingUsers] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  // xử lí khi ai đang thingking
  useEffect(() => {
    if (!socket) return;
    const handleThinking = ({ conversationId: convId, thinking }) => {
      if (String(convId) !== String(conversationId)) return;
      if (thinking) setSuggestions([]);
      setIsThinking(thinking);
    };
    socket.on("bot_thinking", handleThinking);
    return () => socket.off("bot_thinking", handleThinking);
  }, [socket, conversationId]);

  // Nhận message suggest mới từ socket
  useEffect(() => {
    if (!socket) return;
    const handleSuggest = ({ conversationId: convId, suggestions }) => {
      if (String(convId) !== String(conversationId)) return;
      setSuggestions(suggestions);
    };
    socket.on("bot_suggest", handleSuggest);
    return () => socket.off("bot_suggest", handleSuggest);
  }, [socket, conversationId]);

  // Nhận message mới từ socket
  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (message) => {
      if (message.conversationId !== conversationId) return;

      // Nếu là ảnh bỏ qua vì đã có RTK xử lý
      if (message.userId === user?.id && message.attachments?.length > 0)
        return;
      dispatch(
        messageApi.util.updateQueryData(
          "getMessage",
          { conversationId: message.conversationId },
          (draft) => {
            const exists = draft.some((m) => m.id === message.id);
            if (!exists) {
              draft.push(message);
            }
          },
        ),
      );
      handleNewMessage(message.userId === user?.id);
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [conversationId, socket, user?.id, dispatch, handleNewMessage]);

  // Xử lý các sự kiện nhóm (kick, leave, add, promote)
  useEffect(() => {
    if (!socket) return;
    const handleGroupEvent = (data) => {
      const { conversationId: convId, action, member } = data;
      if (convId !== conversationId) return;

      const isMe = member?.map(String).includes(String(user?.id));
      if (isMe) {
        if (action === "kick") {
          toast.error("Bạn đã bị xóa khỏi nhóm");
          navigate("/chat");
        }
        if (action === "leave") {
          toast.success("Bạn đã rời nhóm");
          navigate("/chat");
        }
        if (action === "add") toast.success("Bạn đã được thêm vào nhóm");
        if (action === "promote")
          toast.success("Bạn đã được thăng quyền admin");
      }
      refetchConversation();
      dispatch(conversationApi.util.invalidateTags(["Conversation"]));
    };
    socket.on("group_event", handleGroupEvent);
    return () => socket.off("group_event", handleGroupEvent);
  }, [
    socket,
    conversationId,
    dispatch,
    refetchConversation,
    navigate,
    user?.id,
  ]);

  // Nhận danh sách người đang gõ từ server
  useEffect(() => {
    if (!socket) return;
    const handleTypingUsers = ({ conversationId: convId, userIds }) => {
      if (convId !== conversationId) return;
      setTypingUsers(userIds.filter((id) => String(id) !== String(user?.id)));
    };
    socket.on("typing_users", handleTypingUsers);
    return () => {
      socket.off("typing_users", handleTypingUsers);
      setTypingUsers([]);
    };
  }, [socket, conversationId, user?.id]);

  // xử lí edit message
  useEffect(() => {
    if (!socket) return;
    const handleMessageEdited = (message) => {
      console.log(message);
      if (message.conversationId !== conversationId) return;
      dispatch(
        messageApi.util.updateQueryData(
          "getMessage",
          { conversationId },
          (draft) => {
            const msg = draft.find((m) => m.id === message.id);
            if (msg) {
              msg.content = message.content;
              msg.isEdited = message.isEdited;
              if (user.id === message.userId) {
                toast.success("Sửa tin nhắn thành công");
              }
            }
          },
        ),
      );
    };
    socket.on("message_edited", handleMessageEdited);
    return () => socket.off("message_edited", handleMessageEdited);
  }, [socket, conversationId, dispatch]);

  // nhận xóa message
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMessageDeleted = (message) => {
      store.dispatch(
        messageApi.util.updateQueryData(
          "getMessage",
          { conversationId },
          (draft) => {
            const index = draft.findIndex(
              (m) => String(m.id) === String(message.id),
            );
            if (index !== -1) draft.splice(index, 1);
            if (user.id === message.userId) {
              toast.success("Xóa tin nhắn thành công");
            }
          },
        ),
      );
    };

    socket.on("message_deleted", handleMessageDeleted);
    return () => socket.off("message_deleted", handleMessageDeleted);
  }, [conversationId]);

  return { typingUsers, isThinking };
}
