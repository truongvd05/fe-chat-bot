import { useLazyGetSuggestQuery } from "@/feature/Message/messageApi";
import { useEffect, useRef } from "react";

export function useConversationSuggest({
  messageData,
  user,
  conversationId,
  setSuggestions,
}) {
  const [triggerSuggest, { isFetching: suggestLoading }] =
    useLazyGetSuggestQuery();
  const prevConversationId = useRef(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (prevConversationId.current === conversationId) return;

    // Reset khi đổi conversation
    prevConversationId.current = conversationId;
    lastMessageRef.current = null;
    setSuggestions([]);

    if (!messageData?.length || !user) return;

    const lastMessage = messageData[messageData.length - 1];
    lastMessageRef.current = lastMessage;

    if (String(lastMessage.userId) === String(user.id)) return;

    triggerSuggest({ conversationId, lastMessage: lastMessage.content })
      .unwrap()
      .then((data) => {
        setSuggestions(data ?? []);
      })
      .catch((err) => {
        console.log("suggest error:", err);
        setSuggestions([]);
      });
  }, [conversationId, messageData]);
  return { suggestLoading };
}
