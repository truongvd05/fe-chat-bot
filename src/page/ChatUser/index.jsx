import { conversationApi, useAddMembersInConversationMutation, useGetConversationQuery, useKickMembersInConversationMutation, useLazySearchAvailableUsersQuery, useLeaveGroupMutation, usePromoteToAdminConversationMutation } from "@/feature/Conversation/conversationApi"
import { messageApi, useGetMessageQuery, useSendMessageWithFilesMutation } from "@/feature/Message/messageApi"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import Message from "@/components/Message"
import { selectTOken, selectUser } from "@/feature/User/userSelector"
import { getSocket } from "@/socket/socket"
import { useSocket } from "@/contexts/SocketContext"
import useLoadMessages from "@/hoock/useLoadMessages"
import MessageSkeleton from "@/components/MessageSkeleton"
import { useVirtualizer } from "@tanstack/react-virtual";
import { useScrollManager } from "@/hoock/useScrollManager"
import MemberModal from "./MemberModal"
import MemberSelectModal from "@/layouts/ChatLayout/Sidebar/Conversation/MemberSelectModal"
import { toast } from "sonner";

function ChatUser() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = useSocket();
    const parentRef = useRef()
    const { user } = useSelector(selectUser)
    const token = useSelector(selectTOken)
    const { conversationId } = useParams()
    const [content, setContent] = useState("")
    const [open, onOpenChange] = useState(false)
    const fileInputRef = useRef(null)
    const [files, setFiles] = useState([])
    const { data: messageData, isLoading: messageLoading, error: messageError } = useGetMessageQuery({conversationId})
    const [ addMembers, {isLoading: addMembersLoading, error: addMembersError }] = useAddMembersInConversationMutation()
    const [ kickMembers, {isLoading: kickMembersLoading, error: kickMembersError }] = useKickMembersInConversationMutation()
    const [ sendMessageWithFiles, {isLoading: sendMessageWithFilesLoading, error: sendMessageWithFilesError }] = useSendMessageWithFilesMutation()
    const [ PromoteToAdmin, {isLoading: PromoteToAdminLoading, error: PromoteToAdminError }] = usePromoteToAdminConversationMutation()
    const [ LeaveGroup, {isLoading: LeaveGroupAdminLoading, error: LeaveGroupAdminError }] = useLeaveGroupMutation()

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

    const { data: conversationData, isLoading: conversatonLoading, error: conversationError, refetch: refetchConversation } =
    useGetConversationQuery(conversationId, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true
    })
    const other = conversationData?.participants?.find(u => u.user.id !== user.id)

    // xử lí khi gửi message
    const handleSendMessage = async () => {
        try {
            if (!conversationData) return
            if (!["DIRECT", "GROUP"].includes(conversationData.type)) return
            if(!conversationId || (!content.trim() && files.length === 0)) return
            const socket = getSocket()
            if(files.length > 0) {
                await sendMessageWithFiles({conversationId, content, files}).unwrap()
            } else {
                console.log(1);
                if (!socket) return;
                socket.emit("send_message", {
                    conversationId,
                    content
                })
            }
            scrollBottom()
            setContent("")
            setFiles([])
            if (fileInputRef.current) fileInputRef.current.value = ""
        } catch(err) {
            console.log("Error:", err)
        }
    }
    
    // xử lí nhận message từ socket
    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (message) => {
            if (message.conversationId !== conversationId) return
            // nếu là ảnh bỏ qua vì đã có rtk xử lí
            if (message.userId === user?.id && message.attachments?.length > 0) return;
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
    
    useEffect(() => {
        if (!socket) return;

        const handleGroupEvent = (data) => {
            const { conversationId: convId, action, member } = data;
            if (convId !== conversationId) return;
            console.log(action);
            
            const isMe = member
                ?.map(String)
                .includes(String(user?.id));

            if (isMe) {
                    if (action === "kick") {
                        toast.error("Bạn đã bị xóa khỏi nhóm");
                        navigate("/chat");
                    }

                    if (action === "leave") {
                        toast.success("Bạn đã rời nhóm");
                        console.log(2); 
                        navigate("/chat");
                    }

                    if (action === "add") {
                        console.log(1);
                        
                        toast.success("Bạn đã được thêm vào nhóm");
                    }

                    if (action === "promote") {
                        toast.success("Bạn đã được thăng quyền admin");
                    }
                }
                refetchConversation();
                dispatch(conversationApi.util.invalidateTags(["Conversation"]));
        };


        socket.on("group_event", handleGroupEvent);

        return () => {
            socket.off("group_event", handleGroupEvent);
        };
    }, [socket, conversationId, dispatch, refetchConversation, navigate, user?.id]);

    return (
        <>
            <MemberModal
                members={conversationData?.participants}
                open={open}
                onOpenChange={onOpenChange}
                onKick={(selectedMembers) => kickMembers({ conversationId, memberIds: selectedMembers }).unwrap()}
                onPromote={(selectedMembers) => PromoteToAdmin({ conversationId, memberIds: selectedMembers }).unwrap()}
                onLeave={() => LeaveGroup({ conversationId }).unwrap()}
                owner={conversationData?.ownerId}
                />
            <div className="flex flex-col h-full overflow-hidden">
                <div className="sticky ml-10 md:ml-1 text-2xl py-2 border-b mb-5 top-1">
                    <p >{conversationData?.type === "DIRECT" ? other?.user?.name : conversationData?.title}</p>
                    {conversationData?.type === "GROUP" && 
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
                    </div>}
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
                    {files.length > 0 && (
                        <div className="flex gap-2 px-2 pb-2 flex-wrap">
                            {files.map((file, i) => (
                                <div key={i} className="relative">
                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 flex items-center justify-center border rounded text-xs text-center p-1">
                                            {file.name}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="relative">
                        <Textarea id="textarea-message"
                        value={content}
                        onChange={(e)=> { setContent(e.target.value)}}
                        className="overflow-hidden h-16 text-lg rounded-3xl pr-15 pl-12"
                        placeholder="Enter text"/>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="p-2 absolute left-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                        >
                            <i className="fa-solid fa-paperclip"></i>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => setFiles(Array.from(e.target.files))}
                            accept="image/*,video/*,application/pdf"
                        />
                        <button
                        disabled={
                            (!content.trim() && files.length === 0) || // ✅
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