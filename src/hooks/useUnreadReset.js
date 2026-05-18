import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { conversationApi } from "@/feature/Conversation/conversationApi";

/**
 * Reset unreadCount về 0 khi người dùng mở conversation
 */
export function useUnreadReset({ conversationId, userId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!conversationId || !userId) return;
    dispatch(
      conversationApi.util.updateQueryData(
        "getConversations",
        undefined,
        (draft) => {
          const conversation = draft.find((c) => c.id === conversationId);
          if (!conversation) return;
          const me = conversation.participants.find(
            (p) => p.user?.id === userId,
          );
          if (me) me.unreadCount = 0;
        },
      ),
    );
  }, [conversationId, userId]);
}
