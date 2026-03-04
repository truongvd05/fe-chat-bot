import { conversationApi, useGetBotConversationsQuery, useGetConversationsQuery } from "@/feature/Conversation/conversationApi";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "./Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/feature/User/userSelector";
import IconNewBots from "./IconNewBots";
import IconFriend from "./IconFriend";
import { useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

function Conversation({ type, setIsOpen }) {
    const socket = useSocket()
    const dispatch = useDispatch()
    const {user} = useSelector(selectUser)
    const {theme} = useTheme()
    const {conversationId} = useParams()

    const navigate = useNavigate()
    const { data: botData,
        isLoading: botLoading,
    } = useGetBotConversationsQuery("bots", {
        skip: type !== "bots",
    })

    const { data: chatData,
        isLoading: chatLoading,
    } = useGetConversationsQuery(undefined, {
        skip: type !== "chat",
    })
    
    const isLoading = botLoading || chatLoading;
    
    const data = type === "bots" ? botData : chatData;

    useEffect(() => {
        if (!socket) return;
        const handleReceiveConversation = (conversation) => {
        dispatch(
            conversationApi.util.updateQueryData(
                "getConversations",
                undefined,
                (draft) => {
                    const index = draft.findIndex(
                        c => c.id === conversation.id
                    )
                    // xoá khỏi vị trí cũ
                    if (index !== -1) {
                        draft.splice(index, 1)
                    }
                    const me = conversation.participants?.find(
                    (p) => p.user?.id === user.id
                    )
                    if (conversation.id === conversationId) {
                        me.unreadCount = 0
                    } else {
                        me.unreadCount += 1
                    }
                    // thêm lên đầu
                    draft.unshift(conversation)
                }
            )
        )
    }
        socket.on("conversation_updated", handleReceiveConversation);
        return () => {
            socket.off("conversation_updated", handleReceiveConversation);
        };
    }, [conversationId, socket]);
    if(isLoading) return <Skeleton/>
    return (
    <div className="w-full">
        {type === "chat" ? <IconFriend/> : <IconNewBots/>}  
        {!data?.length && (
            <p>Bạn chưa chọn đoạn chat</p>
        )}
        {(data?.map((item)=> {
            let otheruser;
            let count;
            if (type !== "BOT") {
                const otherParticipant = item?.participants?.find(
                    p => p.user?.id !== user?.id
                );
                const unreadCount = item.participants?.find(p => p.user?.id === user.id)
                otheruser = otherParticipant?.user;
                count = unreadCount?.unreadCount
                
            }
            return (
                <div key={item.id}
                onClick={() => {
                    setIsOpen(false)
                    if(type === "chat") {
                        navigate(`/${type}/${item.id}`)
                    } else {
                        navigate(`/${type}/${item.id}`)
                    }
                }}
                className={`rounded-sm cursor-pointer 
                    ${theme === "light" ? "hover:bg-gray-300 text-black" : "hover:bg-gray-500 text-white"}
                    ${conversationId === item.id ? "bg-gray-400" : ""} py-[3px] px-[5px] w-full h-15`
                        }>
                    <div className="flex items-center">
                        <div className="flex flex-col gap-2 flex-1">
                            <span className="relative">
                                {type === "chat" ? otheruser?.name : item?.title}
                                {count > 0 && <p className="absolute top-0 right-0 text-red-500 bg-red-300 rounded-full h-[20px] w-[15px] flex justify-center items-center">{count}</p>}
                            </span>
                            {item.lastMessage?.content && 
                            <p className="text-sm opacity-70 truncate w-45">
                                {type === "bots" && (item.lastMessage?.userId === user.id ?  "Bạn" : item?.lastMessage?.role)}
                                {type === "chat" && item.lastMessage?.userId === user.id ? "Bạn" 
                                    : item.lastMessage.user?.name}
                                    : {item.lastMessage.content}
                                </p>}
                        </div>
                    </div>
                </div>
            )
        })
        )}
    </div>
)
}
export default Conversation