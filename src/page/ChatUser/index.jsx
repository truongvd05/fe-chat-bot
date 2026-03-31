import { conversationApi, useAddMembersInConversationMutation, useGetConversationQuery, useKickMembersInConversationMutation, useLazySearchAvailableUsersQuery } from "@/feature/Conversation/conversationApi"
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
import MessageSkeleton from "@/components/MessageSkeleton"
import { useVirtualizer } from "@tanstack/react-virtual";
import { useScrollManager } from "@/hoock/useScrollManager"
import MemberModal from "./MemberModal"
import MemberSelectModal from "@/layouts/ChatLayout/Sidebar/Conversation/MemberSelectModal"

function ChatUser() {
    const dispatch = useDispatch()
    const socket = useSocket();
    const parentRef = useRef()
    const {user} = useSelector(selectUser)
    const { conversationId } = useParams()
    const [content, setContent] = useState("")
    const [open, onOpenChange] = useState(false)
    const { data: messageData, isLoading: messageLoading, error: messageError } = useGetMessageQuery({conversationId})
    const [ addMembers, {isLoading: addMembersLoading, error: addMembersError }] = useAddMembersInConversationMutation()
    const [ kickMembers, {isLoading: kickMembersLoading, error: kickMembersError }] = useKickMembersInConversationMutation()

    const [triggerSearchAvailableUsers, {
        data: searchAvailableUsersData,
        isLoading: searchAvailableUsersLoading,
        isError: searchAvailableUsersError,
        error,
        reset: resetSearchAvailableUsers  
    }] = useLazySearchAvailableUsersQuery();

    const {loadMore} = useLoadMessages(conversationId, messageData)

    const rowVirtualizer = useVirtualizer({
        count: messageData?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 5,
        measureElement: (el) => el?.getBoundingClientRect().height
    });

    const { scrollBottom, handleNewMessage } = useScrollManager({
        messageData,
        conversationId,
        loadMore,
        rowVirtualizer,
        parentRef,
    })

    const { data: conversationData, isLoading: conversatonLoading, error: conversationError } =
    useGetConversationQuery(conversationId, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true
    })

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
            scrollBottom()
            setContent("")
        } catch(err) {
            console.log("Error:", err)
        }
    }
    
    // xử lí nhận message từ socket
    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (message) => {
            if (message.conversationId !== conversationId) return
            dispatch(messageApi.util.updateQueryData(
                "getMessage",
                {conversationId: message.conversationId},
                (draft) => {
                    const exists = draft.some(m => m.id === message.id)
                    if (!exists) {
                        draft.push(message)
                    }
                }
            ))
            // scroll xuống bottom nếu là người gửi
            handleNewMessage(message.userId === user?.id)
        }
        socket.on("receive_message", handleReceiveMessage);
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [conversationId, socket, user?.id, dispatch, handleNewMessage]);

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

    const other = conversationData?.participants?.find(u => u.user.id !== user.id)
    
    return (
        <>
            <MemberModal
                members={conversationData?.participants}
                open={open}
                onOpenChange={onOpenChange}
                onKick={(selectedMembers) => kickMembers({ conversationId, memberIds: selectedMembers }).unwrap()}
                />
            <div className="flex flex-col h-full overflow-hidden">
                <div className="sticky ml-10 md:ml-1 text-2xl py-2 border-b mb-5 top-1">
                    <p >{conversationData?.type === "DIRECT" ? other?.user?.name : conversationData?.title}</p>
                    <div className="flex gap-2 text-sm items-center justify-between pr-5">
                        <div className="flex items-center" onClick={() => onOpenChange(true)}>
                            <i className="fa-solid fa-user"></i>
                            <p className="cursor-pointer">{conversationData?.participants?.length} thành viên</p>
                        </div>
                        <MemberSelectModal
                            trigger={<i className="fa-solid fa-plus"></i>}
                            onSearch={(value) => triggerSearchAvailableUsers({conversationId, q: value}).unwrap()}
                            onSubmit={async({memberIds}) => addMembers({memberIds, conversationId}).unwrap()}
                            loading={searchAvailableUsersLoading}
                            error={searchAvailableUsersError}
                            data={searchAvailableUsersData}
                            reset={resetSearchAvailableUsers}
                            />
                    </div>
                </div>
                <div ref={parentRef} className="flex-1 min-h-0 overflow-y-scroll pb-20 pl-2 pr-2"
                    style={{ overflowAnchor: "none" }} >
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
                                        className="absolute top-0 left-0 w-full"
                                        style={{transform: `translateY(${virtualRow.start}px)`}}
                                    >
                                        <div className={`${message.role === "user" ? "" : "border-b border-t"}`} >
                                            <Message message={message} right={message.userId === user?.id} user={message.role === "user"}/>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>}
                </div>
                <div className="sticky mr-auto ml-auto w-[70%] md:w-[70%] lg:w-[70%]">
                    <div className="relative">
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
                </div>
            </div>
        </>
    )
}

export default ChatUser