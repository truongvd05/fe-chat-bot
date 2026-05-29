import { useEffect, useRef } from "react";
import { getSocket } from "@/socket/socket";
import logger from "@/utils/logger";
import { toast } from "sonner";

/**
 * Xử lý logic gửi message và typing indicator
 */
export function useChatActions({
  conversationId,
  conversationData,
  sendMessageWithFiles,
  scrollBottom,
  content,
  setContent,
  files,
  setFiles,
  fileInputRef,
  editingMessage,
  setEditingMessage,
  setReplyingMessage,
  replyingMessage,
}) {
  const typingRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleError = ({ message, statusCode }) => {
      logger.log("Error:", statusCode, message);
      if (statusCode === 403 && message === "Tài khoản chưa được xác thực") {
        toast.warning("Xác thực email để sử dụng đầy đủ tính năng", {
          duration: 5000,
          action: {
            label: "Xác thực ngay",
            onClick: () => (window.location.href = "/send-verify-email"),
          },
        });
      } else {
        toast.error(message || "Lỗi không xác định");
      }
    };

    socket.on("error_message", handleError);
    return () => socket.off("error_message", handleError); // cleanup
  }, []);

  const handleSendMessage = async () => {
    try {
      if (!conversationData) return;
      if (!["DIRECT", "GROUP", "SELF"].includes(conversationData.type)) return;
      if (!conversationId || (!content.trim() && files.length === 0)) return;

      const socket = getSocket();
      if (!socket) return;

      if (editingMessage) {
        socket.emit("edit_message", {
          messageId: editingMessage.id,
          conversationId,
          content,
        });
        setEditingMessage(null);
      } else if (files.length > 0) {
        await sendMessageWithFiles({
          conversationId,
          content,
          files,
          parentMessageId: replyingMessage?.id ?? undefined,
        }).unwrap();
      } else {
        socket.emit("send_message", {
          conversationId,
          content,
          parentMessageId: replyingMessage?.id ?? undefined,
        });
      }

      scrollBottom();
      setContent("");
      setFiles([]);
      setReplyingMessage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      logger.log("Error:", err);
    }
  };

  const handleTyping = (socket) => {
    if (!socket || !conversationId) return;
    if (!typingRef.current) {
      socket.emit("typing_start", { conversationId });
      typingRef.current = true;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { conversationId });
      typingRef.current = false;
    }, 2000);
  };

  return { handleSendMessage, handleTyping };
}
