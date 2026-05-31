import { useGetFriendQuery, useUnFriendMutation } from "@/feature/User/userApi";
import PhoneBookListLayout from "../components/PhoneBookListLayout";
import logger from "@/utils/logger";
import { toast } from "sonner";
import UserProfileModal from "@/components/UserProfileModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateDirectConversationMutation } from "@/feature/Conversation/conversationApi";

export default function Friends() {
    const { data, isLoading, isError } = useGetFriendQuery();
    const [deleteFriend] = useUnFriendMutation();
    const [createDirectConversation, { isLoading: createDirectConversationLoading }] = useCreateDirectConversationMutation();
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Lỗi rồi!</p>;
    if (!data) return null;

    const handleDeleteFriend = async (e, targetUserId) => {
        e.stopPropagation();
        try {
            await deleteFriend({ targetUserId }).unwrap();
            toast.success("Hủy kết bạn thành công");
        } catch (err) {
            logger.error(err);
            toast.error("Lỗi khi hủy kết bạn");
        }
    };

    const handleMessage = async (e, targetUserId) => {
        e.stopPropagation();
        try {
            const res = await createDirectConversation(targetUserId).unwrap();
            navigate(`/chat/${res.id}`);
        } catch (err) {
            logger.error(err);
            toast.error("Không thể mở cuộc trò chuyện");
        }
    };

    return (
        <PhoneBookListLayout subtitle="Bạn bè" icon="fa-user" title="Danh sách bạn bè" count={data?.length}>
            <ul className="bg-white p-5 flex flex-col gap-3">
                {data?.map((user) => (
                    <li key={user.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(true);
                            setSelectedUser(user);
                        }}
                        className="flex items-center cursor-pointer justify-between p-2 hover:bg-amber-50 border rounded-2xl">
                        <span>{user.name}</span>
                        <div className="flex gap-2">
                            {/* ✅ nút nhắn tin */}
                            <button
                                onClick={(e) => handleMessage(e, user.id)}
                                disabled={createDirectConversationLoading}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                Nhắn tin
                            </button>
                            <button
                                onClick={(e) => handleDeleteFriend(e, user.id)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                                Hủy kết bạn
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {open && (
                <UserProfileModal
                    isOpen={open}
                    user={selectedUser}
                    onClose={() => setOpen(false)}
                />
            )}
        </PhoneBookListLayout>
    );
}