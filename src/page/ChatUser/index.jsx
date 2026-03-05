import { conversationApi, useGetConversationQuery } from "@/feature/Conversation/conversationApi"
import { messageApi, useGetMessageQuery } from "@/feature/Message/messageApi"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import Message from "@/components/Message"
import { selectUser } from "@/feature/User/userSelector"
import { getSocket } from "@/socket/socket"
import { useSocket } from "@/contexts/SocketContext"
import useLoadMessages from "@/hoock/useLoadMessages"

function ChatUser() {
    const dispatch = useDispatch()
    const socket = useSocket();
    const {user} = useSelector(selectUser)
    const { conversationId } = useParams()
    const bottomRef = useRef(null)
    const topRef = useRef(null)
    const [content, setContent] = useState("")

    const { data: conversationData, isLoading: conversatonLoading, error: conversationError } =
    useGetConversationQuery(conversationId, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true
    })
    const { data: messageData, isLoading: messageLoading, error: messageError } = useGetMessageQuery({conversationId})
    const {loadMore} = useLoadMessages(conversationId, messageData)
    // xử lí khi gửi message
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

    // xử lí nhận message từ socket
    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (message) => {
            dispatch(messageApi.util.updateQueryData(
                "getMessage",
                message.conversationId,
                (draft) => {
                    draft.push(message)
                }
            ))
            // scroll xuống bot nếu là người gửi
            if(message.userId === user?.id){
                scrollBottom()
            }
        }
        socket.on("receive_message", handleReceiveMessage);
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [conversationId, socket]);

    // xử lí update unread về 0 khi click message
    useEffect(() => {
        if (!conversationId || !user?.id) return;
        dispatch(conversationApi.util.updateQueryData(
            "getConversations",
            undefined,
            (draft) => {
                const conversation = draft.find(
                (c) => c.id === conversationId
                );

                if (!conversation) return;

                const me = conversation.participants.find(
                (p) => p.user?.id === user.id
                );

                me.unreadCount = 0;
            }
        ))
    },  [conversationId, user?.id])

    // scroll xuống cuối khi chat
    useEffect(() => {
        scrollBottom()
    }, [conversationId]);
    const scrollBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                loadMore()
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    if (!conversationData || messageLoading) {
        return <div>Loading...</div>
    }
    const other = conversationData.participants.find(u => u.user.id !== user.id)
    
    return (
        <>
            <div ref={topRef} className="px-2 py-2 flex-1 h-full">
                <p className="text-2xl py-2 border-b mb-5">{other.user?.name}</p>
                <div className="flex flex-col flex-1 gap-4 pb-30">  
                    {messageData?.map((message) => {
                        return (
                            <div key={message.id}>
                                <Message message={message} right={message.userId === user?.id} user={user}/>
                            </div>
                        )
                    })}
                    <div ref={bottomRef}></div>
                </div>
            </div>
            <div className="bottom-10 w-[80%] mr-auto ml-auto relative">
                <Textarea id="textarea-message"
                value={content}
                onChange={(e)=> { setContent(e.target.value)}}
                className="overflow-hidden px-5 h-16 text-lg rounded-3xl pr-15"
                placeholder="Enter text"/>
                <button
                disabled={
                    !content.trim() ||
                    !conversationData ||
                    !["DIRECT", "GROUP"].includes(conversationData.type)
                }
                onClick={handleSendMessage}
                className="p-2 absolute right-2 top-1/2 -translate-y-1/2
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