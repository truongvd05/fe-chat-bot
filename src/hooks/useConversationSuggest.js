import { useLazyGetSuggestQuery } from "@/feature/Message/messageApi";
import logger from "@/utils/logger";
import { useEffect, useRef, useState } from "react";

// hook chỉ gọi 1 lần
export function useConversationSuggest({
  messageData,
  user,
  conversationId,
  setSuggestions,
}) {
  const [triggerSuggest, { isFetching: suggestLoading }] =
    useLazyGetSuggestQuery();

  const hasTriggered = useRef(false);
  const abortRef = useRef(null);

  useEffect(() => {
    setSuggestions([]);
  }, [conversationId]);

  useEffect(() => {
    if (hasTriggered.current) return;
    if (!messageData?.length || !user) return;

    const lastMessage = messageData[messageData.length - 1];
    if (String(lastMessage.userId) === String(user.id)) return;

    hasTriggered.current = true;

    // Hủy request cũ nếu đang chạy
    if (abortRef.current) {
      abortRef.current.abort();
    }

    // Reset khi đổi conversation
    console.log(lastMessage);

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
        logger.log("suggest error:", err);
        setSuggestions([]);
      });
    // hủy request khi đổi conversation khác
    return () => {
      promise.abort();
    };
  }, [conversationId, messageData]);
  return { suggestLoading };
}
