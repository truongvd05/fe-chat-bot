import { conversationApi, useAddMembersInConversationMutation, useGetConversationQuery, useKickMembersInConversationMutation, useLazySearchAvailableUsersQuery, useLeaveGroupMutation, usePromoteToAdminConversationMutation } from "@/feature/Conversation/conversationApi"
import { messageApi, useGetMessageQuery, useSendMessageWithFilesMutation } from "@/feature/Message/messageApi"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
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
import { toast } from "sonner";
import { selectIsUserOnline } from "@/feature/onlineUsers/onlineUsersSelector"
import logger from "@/utils/logger"
import shouldShowUser from "@/utils/shouldShowUser "
import shouldShowTime from "@/utils/shouldShowTime"

function ChatUser() {
    const [value, setValue] = useState(0)
    return (
        <Child value={value}>child</Child>
    )
}

export default ChatUser