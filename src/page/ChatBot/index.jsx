import { useGetBotConversationQuery } from "@/feature/Conversation/conversationApi";
import { messageApi, useGetMessageQuery, useSendBotMessageMutation } from "@/feature/Message/messageApi";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea"
import Message from "../../components/Message";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useLoadMessages from "@/hoock/useLoadMessages";
import { selectTOken } from "@/feature/User/userSelector";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useScrollManager } from "@/hoock/useScrollManager";
import MessageSkeleton from "@/components/MessageSkeleton";
import logger from "@/utils/logger";

function ChatBot() {
    const dispatch = useDispatch()
    const { conversationId } = useParams()
    const token = useSelector(selectTOken)
    const parentRef = useRef();
    const [content, setContent] = useState("")

    const { data: conversationData, isLoading: conversatonLoading, error: conversationError } = useGetBotConversationQuery(conversationId)
    const { data: messageData, isLoading: messageLoading, error: messageError } = useGetMessageQuery({conversationId})
    const [ sendBotMessage, {isLoading: sendMessaeLoading, error: sendMessageError}] = useSendBotMessageMutation()
    const {loadMore} = useLoadMessages(conversationId, messageData)

    const rowVirtualizer = useVirtualizer({
        count: messageData?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 5,
        measureElement: (el) => el?.getBoundingClientRect().height
    });

    const { scrollBottom, scrollBottomRef  } = useScrollManager({
        messageData,
        conversationId,
        loadMore,
        rowVirtualizer,
        parentRef,
    })

    const handleSendMessage = async () => {
        try {
            await sendBotMessage({conversationId, content}).unwrap()
            setContent("")
            scrollBottom()
        } catch(err) {
            logger.log("Error:", err)
        }
    }

    useEffect(() => {
        if(!conversationId) return;

        const event = new EventSource(
            `${import.meta.env.VITE_BASE_URL}conversation/${conversationId}/stream?token=${token}`,
            { withCredentials: true }
        )
        event.addEventListener("connected", (e) => {
            logger.log("SSE connected");
        })
        event.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "bot_stream") {
                dispatch(
                    messageApi.util.updateQueryData(
                        "getMessage",
                        {conversationId},
                        (draft) => {
                            const last = draft[draft.length - 1];
                            if (last?.role === "bot") {
                                last.content += data.content;
                                scrollBottomRef.current?.()
                            } else {
                                draft.push({
                                    id: Date.now(),
                                    role: "bot",
                                    content: data.content
                                });
                            }
                        }
                    )
                );
            }
        }
        // xử lí token hết hạn thì kết nối lại SSE
        event.onerror = async (err) => {
            console.error("SSE error", err);
            event.close();
        }
        return () => {
            event.close()
        }
    }, [conversationId, token])
    
    return (
        <>
            <div className="flex flex-col h-full">
                <p className="sticky ml-10 md:ml-1 text-2xl py-2">{conversationData?.title}</p>
                <div ref={parentRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-20 pl-2 pr-2"
                    style={{ overflowAnchor: "none" }}
                >  
                    {(!conversationData || messageLoading) ? (
                    <>
                        <MessageSkeleton />
                        <MessageSkeleton right />
                        <MessageSkeleton />
                        <MessageSkeleton right />
                        <MessageSkeleton />
                    </>
                ) : <div style={{
                        height: rowVirtualizer.getTotalSize(),
                        minHeight: "100%",
                        position: "relative",
                        }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const message = messageData[virtualRow.index];
                                return (
                                    <div
                                        key={message.id}
                                        ref={rowVirtualizer.measureElement}
                                        data-index={virtualRow.index}
                                        className="absolute top-0 left-0 w-full px-1 py-1" style={{transform: `translateY(${virtualRow.start}px)`}}
                                    >
                                        <div>
                                            <Message message={message} right={message.role === "user"} user={message.role === "user"}/>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>}
                </div>
                <div className="sticky bottom-10 mr-auto ml-auto w-[70%] max-h-37.5 ">
                    <Textarea id="textarea-message"
                    value={content}
                    onChange={(e)=> { setContent(e.target.value)}}
                    className="px-5 text-lg rounded-3xl pr-12.5 min-h-10 max-h-37.5"
                    placeholder="Enter text"/>
                    <button
                    onClick={handleSendMessage}
                    disabled={!content}
                    className="p-2 absolute right-5 top-1/2 -translate-y-1/2  
                    disabled:opacity-40 
                    disabled:cursor-not-allowed h-full">
                        <i className="fa-regular fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </>
    )
}

export default ChatBot 