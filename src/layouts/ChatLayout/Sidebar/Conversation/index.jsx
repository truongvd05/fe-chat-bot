import { conversationApi, useGetConversationsQuery } from "@/feature/Conversation/conversationApi";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "./Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/feature/User/userSelector";
import IconFriend from "./IconFriend";
import { useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import MemberSelectModal from "./MemberSelectModal";
import { useLazyFindUserQuery } from "@/feature/User/userApi";
import { useCreateGroupConversationMutation } from "@/feature/Conversation/conversationApi";

function Conversation() {
    const socket = useSocket()
    const dispatch = useDispatch()
    const {user} = useSelector(selectUser)
    const {theme} = useTheme()
    const {conversationId} = useParams()
    const navigate = useNavigate()

    const { data: chatData,
        isLoading: chatLoading,
        refetch: refetchConversations,
    } = useGetConversationsQuery()
    
    const [triggerFindUser, {
        data: findUserData,
        isLoading: findUserLoading,
        isError: findUserError,
        error,
        reset: resetFIndUser 
    }] = useLazyFindUserQuery();

    const [ createGroupConversation, {
        isLoading: createGruopLoading,
        error: createGroupError
    }] = useCreateGroupConversationMutation()
    
    
    useEffect(() => {
        if (!socket) return;
        const handleReceiveConversation = (conversation) => {
        dispatch(
            conversationApi.util.updateQueryData(
                "getConversations",
                undefined,
                (draft) => {
                    console.log(conversation);
                    
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

    useEffect(() => {
        if (!socket) return;
        
       // THÊM: Khi có member bị kick/rời nhóm
        const handleGroupEvent = ({ conversationId: convId }) => {
            console.log("Member removed event:", convId);
            refetchConversations();
        };
        
        socket.on("group_event", handleGroupEvent);//
        
        return () => {
            socket.off("group_event", handleGroupEvent);//
        };
    }, [conversationId, socket, dispatch, user.id, refetchConversations]);
    
    if(chatLoading) return <Skeleton/>

    return (
    <div className="w-full">
        <>
            <IconFriend/>
            <MemberSelectModal
                title="tạo nhóm"
                trigger={<i className="fa-solid fa-users"></i>}
                onSearch={(value) => triggerFindUser(value).unwrap()}
                onSubmit={async({name, memberIds}) => {
                    if (!name.trim()) return;
                    await createGroupConversation({name, memberIds}).unwrap()}
                }
                
                loading={findUserLoading}
                error={findUserError}
                data={findUserData}
                reset={resetFIndUser}
                />
        </>
        {(chatData?.map((item)=> {
            const me = item.participants.find(p => String(p.user?.id) === String(user.id))
            const other = item.participants.find(p => String(p.user?.id) !== String(user.id))
            const unreadCount = me?.unreadCount ?? 0
            
            const friendName = other?.user?.name || null

           return (
                <div key={item.id}
                onClick={() => {
                    navigate(`/chat/${item.id}`)
                }}
                className={`rounded-sm cursor-pointer relative
                    ${theme === "light" ? "hover:bg-gray-300 text-black" : "hover:bg-gray-500 text-white"}
                    ${conversationId === item.id ? "bg-gray-400" : ""} py-0.75 px-1.25 w-full h-15`
                        }>
                    {unreadCount > 0 && (
                        <span className="absolute right-0 -top-2 text-red-500 ">{unreadCount}</span>
                    )}
                    <div className="flex items-center">
                        <div className="flex flex-col gap-2 flex-1">
                            <span className="relative">{item.type === "DIRECT" ? friendName : item.title}</span>
                            {item.lastMessage?.content && 
                            <p className="text-sm opacity-70 truncate w-45">
                                {item.lastMessage?.userId === user.id ? "Bạn" 
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