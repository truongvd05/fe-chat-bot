import { useCallback, useEffect, useRef } from "react";

export function useScrollManager({
  messageData,
  conversationId,
  loadMore,
  rowVirtualizer,
  parentRef,
}) {
  const isAutoFillingRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  const isInitializedRef = useRef(false);
  const scrollBottomRef = useRef(null);
  // Reset khi đổi conversation
  useEffect(() => {
    isInitializedRef.current = false;
    isAutoFillingRef.current = false;
    isLoadingMoreRef.current = false;
  }, [conversationId]);

  const scrollBottom = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  scrollBottomRef.current = scrollBottom;
  // lấy thêm message nếu chưa đủ thanh cuộn
  const tryAutoFill = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight && !isLoadingMoreRef.current) {
      isAutoFillingRef.current = true;
      isLoadingMoreRef.current = true;
      loadMore().finally(() => {
        isLoadingMoreRef.current = false;
      });
    } else {
      isAutoFillingRef.current = false;
    }
  }, [loadMore]);

  useEffect(() => {
    if (!messageData?.length || isInitializedRef.current) return;
    if (!rowVirtualizer.getTotalSize()) return;
    // 2 reques vì dom không kịp thêm element nên không scroll xuống đáy được
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = parentRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
        isInitializedRef.current = true;
        setTimeout(() => tryAutoFill(), 50);
      });
    });
  }, [messageData?.length, rowVirtualizer.getTotalSize()]);

  // Scroll khi có message mới từ socket
  const handleNewMessage = useCallback(
    (isOwner) => {
      if (isAutoFillingRef.current) return;
      const el = parentRef.current;
      if (!el) return;
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      if (isOwner || isNearBottom) scrollBottom();
    },
    [scrollBottom],
  );

  useEffect(() => {
    if (!isAutoFillingRef.current) return;
    tryAutoFill();
  }, [messageData?.length]);
  // Scroll lên để load thêm
  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el || isLoadingMoreRef.current || !isInitializedRef.current) return;
    if (el.scrollTop < 10) {
      isLoadingMoreRef.current = true;
      loadMore().then((loadCount) => {
        isLoadingMoreRef.current = false;
        if (!loadCount) return;
        requestAnimationFrame(() => {
          rowVirtualizer.scrollToIndex(loadCount, {
            align: "start",
            behavior: "auto",
          });
        });
      });
    }
  }, [loadMore, rowVirtualizer]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { scrollBottom, scrollBottomRef, handleNewMessage };
}
