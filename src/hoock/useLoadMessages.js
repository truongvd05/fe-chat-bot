import {
  messageApi,
  useLazyGetMessageQuery,
} from "@/feature/Message/messageApi";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function useLoadMessages(conversationId, messages) {
  const dispatch = useDispatch();
  // dùng ref để tránh closure vì hook này dùng cho 2 component
  const messagesRef = useRef(messages);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);

  const [triggerGetMessage] = useLazyGetMessageQuery();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    hasMoreRef.current = true;
  }, [conversationId]);

  const loadMore = useCallback(async () => {
    if (!hasMoreRef.current) return;
    if (loadingRef.current) return;

    const currentMessages = messagesRef.current;
    if (!currentMessages?.length) return;

    const oldestMessage = currentMessages[0];
    loadingRef.current = true;

    try {
      const oldMessages = await triggerGetMessage({
        conversationId,
        c: oldestMessage.createdAt,
      }).unwrap();
      // hêt message
      if (oldMessages.length < 10) {
        hasMoreRef.current = false;
      }

      dispatch(
        messageApi.util.updateQueryData(
          "getMessage",
          { conversationId },
          (draft) => {
            draft.unshift(...oldMessages);
          },
        ),
      );
    } catch (err) {
      console.log(err);
    } finally {
      loadingRef.current = false;
    }
  }, [conversationId, dispatch, triggerGetMessage]);

  return {
    loadMore,
  };
}
