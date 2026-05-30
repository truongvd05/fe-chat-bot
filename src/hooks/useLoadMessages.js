import {
  messageApi,
  useLazyGetMessageQuery,
} from "@/feature/Message/messageApi";
import logger from "@/utils/logger";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function useLoadMessages(conversationId, messages) {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(false);
  const loadingRef = useRef(false);
  const messagesRef = useRef(messages);
  const [triggerGetMessage] = useLazyGetMessageQuery();

  messagesRef.current = messages;

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    const currentMessages = messagesRef.current;

    if (!currentMessages?.length) return;

    loadingRef.current = true;
    const oldestMessage = currentMessages[0];

    try {
      const oldMessages = await triggerGetMessage({
        conversationId,
        c: oldestMessage.id,
      }).unwrap();

      // hêt message
      if (oldMessages.length < 10) {
        setHasMore(true);
      }

      // check trùng key
      const existingIds = new Set(currentMessages.map((m) => m.id));
      const uniqueMessages = oldMessages.filter((m) => !existingIds.has(m.id));

      dispatch(
        messageApi.util.updateQueryData(
          "getMessage",
          { conversationId },
          (draft) => {
            draft.unshift(...uniqueMessages);
          },
        ),
      );
      return uniqueMessages.length;
    } catch (err) {
      logger.log(err);
    } finally {
      loadingRef.current = false;
    }
  }, [conversationId, dispatch, triggerGetMessage]);

  return {
    loadMore,
    hasMore,
  };
}
