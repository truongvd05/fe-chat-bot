import { useAddMembersInConversationMutation, useGetConversationQuery, useKickMembersInConversationMutation, useLazySearchAvailableUsersQuery, useLeaveGroupMutation, usePromoteToAdminConversationMutation } from "@/feature/Conversation/conversationApi"
import { useEditMessageMutation, useGetMessageQuery, useSendMessageWithFilesMutation } from "@/feature/Message/messageApi"
import { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import Message from "@/components/Message"
import { selectUser } from "@/feature/User/userSelector"
import { useSocket } from "@/contexts/SocketContext"
import useLoadMessages from "@/hooks/useLoadMessages"
import MessageSkeleton from "@/components/MessageSkeleton"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useScrollManager } from "@/hooks/useScrollManager"
import MemberSelectModal from "@/layouts/ChatLayout/Sidebar/Conversation/MemberSelectModal"
import { selectIsUserOnline } from "@/feature/onlineUsers/onlineUsersSelector"
import shouldShowUser from "@/utils/shouldShowUser "
import shouldShowTime from "@/utils/shouldShowTime"

// Hooks mới tách ra
import { useChatSocket } from "@/hooks/useChatSocket"
import { useChatActions } from "@/hooks/useChatActions"
import { useUnreadReset } from "@/hooks/useUnreadReset"
import MemberModal from "./conponents/MemberModal"
import { useConversationSuggest } from "@/hooks/useConversationSuggest"

function ChatUser() {
    const socket = useSocket()
    const parentRef = useRef()
    const fileInputRef = useRef(null)
    const { user } = useSelector(selectUser)
    const { conversationId } = useParams()
    const [suggestions, setSuggestions] = useState([]);

    const [content, setContent] = useState("")
    const [open, onOpenChange] = useState(false)
    const [files, setFiles] = useState([])
    const [editingMessage, setEditingMessage] = useState(null)
    const [replyingMessage, setReplyingMessage] = useState(null)

    const { data: messageData, isLoading: messageLoading } = useGetMessageQuery({ conversationId })
    const [addMembers] = useAddMembersInConversationMutation()
    const [kickMembers] = useKickMembersInConversationMutation()
    const [sendMessageWithFiles] = useSendMessageWithFilesMutation()
    const [editMessage] = useEditMessageMutation()
    const [PromoteToAdmin] = usePromoteToAdminConversationMutation()
    const [LeaveGroup] = useLeaveGroupMutation()
    const [triggerSearchAvailableUsers, { data: searchAvailableUsersData, isLoading: searchAvailableUsersLoading, isError: searchAvailableUsersError, reset: resetSearchAvailableUsers }] = useLazySearchAvailableUsersQuery()

    const { data: conversationData, isLoading: conversatonLoading, refetch: refetchConversation } =
        useGetConversationQuery(conversationId, {
            skip: !conversationId,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        })

    const other = conversationData?.participants?.find(u => u.user.id !== user.id)
    const isOtherOnline = useSelector(selectIsUserOnline(other?.user?.id))

    const { loadMore, hasMore } = useLoadMessages(conversationId, messageData)
    const rowVirtualizer = useVirtualizer({
        count: messageData?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 5,
        measureElement: (el) => el?.getBoundingClientRect().height
    })
    const { scrollBottom, handleNewMessage } = useScrollManager({
        messageData, conversationId, loadMore, rowVirtualizer, parentRef,
    })

    const { typingUsers, isThinking  } = useChatSocket({ socket, setSuggestions, conversationId, user, refetchConversation, handleNewMessage })

    const { suggestLoading } = useConversationSuggest({
        messageData,
        user,
        conversationId,
        setSuggestions,
    });


    const { handleSendMessage, handleTyping, handleDeleteMeesage } = useChatActions({
        conversationId, conversationData, user, sendMessageWithFiles, scrollBottom, editMessage,
        content, setContent, files, setFiles, fileInputRef, setReplyingMessage,
        editingMessage, setEditingMessage, replyingMessage,
    })

    useUnreadReset({ conversationId, userId: user?.id })


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
                {/* Header */}
                <div className="sticky ml-10 md:ml-1 text-2xl py-2 border-b mb-5 top-1">
                    <div className="flex items-center">
                        <p>{conversationData?.type === "DIRECT" ? other?.user?.name : conversationData?.title}</p>
                        {conversationData?.type === "DIRECT" && (
                            <span className={`w-2 h-2 rounded-full inline-block ml-2 ${isOtherOnline ? "bg-green-500" : "bg-red-500"}`} />
                        )}
                    </div>
                    {conversationData?.type === "GROUP" &&
                        <div className="flex gap-2 text-sm items-center justify-between pr-5">
                            <div className="flex items-center" onClick={() => onOpenChange(true)}>
                                <i className="fa-solid fa-user"></i>
                                <p className="cursor-pointer">{conversationData?.participants?.length} thành viên</p>
                            </div>
                            <MemberSelectModal
                                trigger={<i className="fa-solid fa-plus"></i>}
                                onSearch={(value) => triggerSearchAvailableUsers({ conversationId, q: value }).unwrap()}
                                onSubmit={async ({ memberIds }) => addMembers({ memberIds, conversationId }).unwrap()}
                                loading={searchAvailableUsersLoading}
                                error={searchAvailableUsersError}
                                data={searchAvailableUsersData}
                                reset={resetSearchAvailableUsers}
                            />
                        </div>}
                </div>

                {/* Message list */}
                <div ref={parentRef} className="flex-1 min-h-0 overflow-y-scroll pb-20 pl-2 pr-2"
                    style={{ overflowAnchor: "none" }}>
                    {(!conversationData || messageLoading) ? (
                        <>
                            <MessageSkeleton />
                            <MessageSkeleton right />
                            <MessageSkeleton />
                            <MessageSkeleton right />
                            <MessageSkeleton />
                        </>
                    ) : (
                        <div style={{ height: rowVirtualizer.getTotalSize(), minHeight: "100%", position: "relative" }}>
                            {hasMore && <p className="text-center text-sm opacity-50 ">Đã tải hết tin nhắn</p>}
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const message = messageData[virtualRow.index]
                                return (
                                    <div key={message.id} ref={rowVirtualizer.measureElement}
                                        data-index={virtualRow.index}
                                        className="absolute top-0 left-0 w-full mt-10"
                                        style={{ transform: `translateY(${virtualRow.start}px)` }}>
                                        <div className={`${message.role === "user" ? "" : "border-b border-t"}`}>
                                            <Message
                                                canModify={message.role === "user" && message.userId === user?.id && conversationData?.type !== "BOT"}
                                                message={message}
                                                right={message.userId === user?.id}
                                                showName={shouldShowUser(messageData, virtualRow.index)}
                                                showTime={shouldShowTime(messageData, virtualRow.index)}
                                                onEdit={() => setEditingMessage({ id: message.id, content: message.content })}
                                                onDelete={() => handleDeleteMeesage({ id: message.id })}
                                                onReply={() => setReplyingMessage({ id: message.id, content: message.content, senderName: message.user?.name })}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                    <div className="pl-4 pb-1 text-sm text-gray-400 italic">
                        {typingUsers.length === 1
                            ? (() => {
                                const typingUser = conversationData?.participants?.find(p => p.user.id === typingUsers[0])
                                return `${typingUser?.user?.name ?? "Ai đó"} đang gõ...`
                            })()
                            : `${typingUsers.length} người đang gõ...`}
                    </div>
                )}
                {(user.aiSuggest &&(suggestLoading || isThinking)) && (
                <div className="pl-4 pb-1 text-sm text-blue-400 italic flex items-center gap-2">
                    <span className="animate-pulse">✦</span>
                    AI đang gợi ý câu trả lời...
                </div>
                )}
                {/* Input area */}
                <div className="sticky mr-auto ml-auto w-[70%] md:w-[70%] lg:w-[70%]">
                    {files.length > 0 && (
                        <div className="flex gap-2 px-2 pb-2 flex-wrap">
                            {files.map((file, i) => (
                                <div key={i} className="relative">
                                    {file.type.startsWith("image/") ? (
                                        <img src={URL.createObjectURL(file)} className="w-16 h-16 object-cover rounded" />
                                    ) : (
                                        <div className="w-16 h-16 flex items-center justify-center border rounded text-xs text-center p-1">
                                            {file.name}
                                        </div>
                                    )}
                                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {suggestions.length > 0 && (
                        <div className="flex gap-2 px-2 pb-2 flex-wrap">
                            {suggestions.map((text, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setContent(text);
                                        setSuggestions([]);
                                    }}
                                    className="text-sm px-3 py-1 rounded-full border hover:bg-accent transition-colors"
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    )}
                    <div>
                        {(editingMessage || replyingMessage) && (
                            <div className={`flex items-center justify-between px-3 py-2 mb-1 rounded-t-xl border-l-4 
                                ${editingMessage ? "border-yellow-400 bg-yellow-50/10" : "border-purple-500 bg-purple-50/10"}`}>
                                <div className="flex items-center gap-2 text-sm">
                                    <i className={`fa-solid ${editingMessage ? "fa-pen" : "fa-reply"}`} />
                                    <span className="text-muted-foreground">
                                        {editingMessage ? "Chỉnh sửa tin nhắn" : `Trả lời ${replyingMessage.senderName}`}
                                    </span>
                                    <span className="text-foreground truncate max-w-50">
                                        {editingMessage?.content ?? replyingMessage?.content}
                                    </span>
                                </div>
                                <button onClick={() => { setEditingMessage(null); setReplyingMessage(null); setContent("") }}>
                                    <i className="fa-solid fa-xmark opacity-60 hover:opacity-100" />
                                </button>
                            </div>
                        )}
                        <div className="relative">
                            <Textarea id="textarea-message"
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    handleTyping(socket)
                                    if (e.target.value) setSuggestions([]);
                                }}
                                className="overflow-y-auto text-lg rounded-3xl pr-15 pl-12 min-h-10 max-h-37.5"
                                placeholder="Enter text" />
                            <button onClick={() => fileInputRef.current.click()}
                                className="p-2 absolute left-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">
                                <i className="fa-solid fa-paperclip"></i>
                            </button>
                            <input ref={fileInputRef} type="file" multiple className="hidden"
                                onChange={(e) => setFiles(Array.from(e.target.files))}
                                accept="image/*,video/*,application/pdf" />
                            <button
                                disabled={(!content.trim() && files.length === 0) || !conversationData || !["DIRECT", "GROUP"].includes(conversationData.type)}
                                onClick={handleSendMessage}
                                className="p-2 absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-40 disabled:cursor-not-allowed">
                                <i className="fa-regular fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatUser