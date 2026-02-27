import { useGetBotConversationQuery } from "@/feature/Conversation/conversationApi";
import { messageApi, useGetMessageQuery, useSendBotMessageMutation } from "@/feature/Message/messageApi";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea"
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

function Chat() {
    const dispatch = useDispatch()
    const { conversationId } = useParams()
    const bottomRef = useRef(null)
    const { data: conversationData, isLoading: conversatonLoading, error: conversationError } = useGetBotConversationQuery(conversationId)
    const { data: messageData, isLoading: messageLoading, error: messageError } = useGetMessageQuery(conversationId)
    const [ sendMessage, {isLoading: sendMessaeLoading, error: sendMessageError}] = useSendBotMessageMutation()

    const [content, setContent] = useState("")

    const handleSendMessage = async () => {
        try {
            await sendMessage({conversationId, content}).unwrap()
            setContent("")
        } catch(err) {
            console.log("Error:", err)
        }
    }
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageData]);


    useEffect(() => {
        const token = localStorage.getItem("access_token")
        if(!conversationId) return;
        const event = new EventSource(
            `${import.meta.env.VITE_BASE_URL}conversation/${conversationId}/stream?token=${token}`,
            { withCredentials: true }
        )
        event.addEventListener("connected", (e) => {
            console.log("SSE connected");
        })
        event.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log("New message:", data);
            if (data.type === "bot_stream") {
                dispatch(
                    messageApi.util.updateQueryData(
                        "getMessage",
                        conversationId,
                        (draft) => {
                            const last = draft[draft.length - 1];
                            if (last?.role === "bot") {
                                last.content += data.content;
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
        event.onerror = (err) => {
            console.error("SSE error", err);
            event.close();
        }
        return () => {
            event.close()
        }
    }, [conversationId])
    return (
        <>
            <div className="px-2 py-2 flex-1 h-full">
                <p className="text-2xl py-2">{conversationData?.title}</p>
                <div className="flex flex-col flex-1 gap-4 pb-30">  
                    {messageData?.map((message) => {
                        return (
                            <div ref={bottomRef} key={message.id} className={`${message.role === "user" ? "" : "border-b border-t"}`}>
                                <Message message={message} right={message.role === "user"}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="sticky bottom-10 w-[80%] mr-auto ml-auto relative">
                <Textarea id="textarea-message"
                value={content}
                onChange={(e)=> { setContent(e.target.value)}}
                className="overflow-hidden px-5 h-16 text-lg rounded-3xl" placeholder="Enter text"/>
                <button
                onClick={handleSendMessage}
                disabled={!content}
                className="p-3 absolute right-5 top-1/2 -translate-y-1/2
                disabled:opacity-40
                disabled:cursor-not-allowed"
                >
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
            </div>
        </>
    )
}

export default Chat 