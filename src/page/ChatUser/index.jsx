import { useGetConversationQuery } from "@/feature/Conversation/conversationApi"
import { useGetMessageQuery } from "@/feature/Message/messageApi"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import Message from "@/components/Message"
import { selectUser } from "@/feature/User/userSelector"
import { getSocket } from "@/socket/socket"
import { useSocket } from "@/contexts/SocketContext"

function ChatUser() {
    const socket = useSocket();
    const {user} = useSelector(selectUser)
    const { conversationId } = useParams()
    const bottomRef = useRef(null)
    const [content, setContent] = useState("")
    const [messages, setMessages] = useState([]);
    
    const { data: conversationData, isLoading: conversatonLoading, error: conversationError } = useGetConversationQuery(conversationId, {refetchOnMountOrArgChange: true})
    const { data: messageData, isLoading: messageLoading, error: messageError } = useGetMessageQuery(conversationId)
    const handleSendMessage = async () => {
        try {
            if (!conversationData) return
            if (!["DIRECT", "GROUP"].includes(conversationData.type)) return
            if(!conversationId || !content) return
            const socket = getSocket()
            if (!socket) return;
            socket.emit("send_message", {
                conversationId,
                content
            })
            setContent("")
        } catch(err) {
            console.log("Error:", err)
        }
    }
    useEffect(() => {
        if (messageData) {
        setMessages(messageData);
    }
    }, [messageData, conversationId]);

    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (message) => {
            if (message.conversationId === conversationId) {
                setMessages((prev) => [...prev, message])
            }
        }
        socket.on("receive_message", handleReceiveMessage);
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [conversationId, socket]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    if(!conversationData || messageLoading) return
    return (
        <>
            <div className="px-2 py-2 flex-1 h-full">
                <div className="flex flex-col flex-1 gap-4 pb-30">  
                    {messages?.map((message) => {
                        return (
                            <div key={message.id}>
                                <Message message={message} right={message.userId === user?.id} user={user}/>
                            </div>
                        )
                    })}
                    <div ref={bottomRef}></div>
                </div>
            </div>
            <div className="sticky bottom-10 w-[80%] mr-auto ml-auto relative">
                <Textarea id="textarea-message"
                value={content}
                onChange={(e)=> { setContent(e.target.value)}}
                className="overflow-hidden px-5 h-16 text-lg rounded-3xl" placeholder="Enter text"/>
                <button
                disabled={
                    !content.trim() ||
                    !conversationData ||
                    !["DIRECT", "GROUP"].includes(conversationData.type)
                }
                onClick={handleSendMessage}
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

export default ChatUser