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
  const abortRef = useRef(null);

  useEffect(() => {
    if (prevConversationId.current === conversationId) return;

    // Hủy request cũ nếu đang chạy
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    // Reset khi đổi conversation
    prevConversationId.current = conversationId;
    lastMessageRef.current = null;
    setSuggestions([]);

    if (!messageData?.length || !user) return;

    const lastMessage = messageData[messageData.length - 1];
    lastMessageRef.current = lastMessage;

    if (String(lastMessage.userId) === String(user.id)) return;

    const promise = triggerSuggest({
      conversationId,
      lastMessage: lastMessage.content,
    });

    abortRef.current = promise;

    promise
      .unwrap()
      .then((data) => setSuggestions(data ?? []))
      .catch((err) => {
        if (err?.name === "AbortError") return; // bỏ qua nếu bị cancel
        console.log("suggest error:", err);
        setSuggestions([]);
      });
  }, [conversationId, messageData]);
  return { suggestLoading };
}
