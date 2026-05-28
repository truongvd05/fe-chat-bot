import { useGetFriendQuery, useUnFriendMutation } from "@/feature/User/userApi";
import PhoneBookListLayout from "../components/PhoneBookListLayout";
import logger from "@/utils/logger";
import { toast } from "sonner";
import UserProfileModal from "@/components/UserProfileModal";
import { useState } from "react";

export default function Friends() {
    const { data, isLoading, isError, refetch } = useGetFriendQuery();
    const [deleteFriend] = useUnFriendMutation()
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    
    
    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Lỗi rồi!</p>;

    const HandleDeleteFriend = async (e, targetUserId) => {
        e.stopPropagation();
        try {
            await deleteFriend({targetUserId}).unwrap()
            toast.error("Hủy kết bạn thành công")
        } catch (err) {
            logger.error(err)
            toast.error("lỗi")
        }
    }

    if(!data) return

    return (
        <PhoneBookListLayout subtitle="Bạn bè" icon="fa-user" title="Danh sách bạn bè" count={data?.length} >
            <ul className="bg-white p-5">
                {data?.map((user) => (
                    <li key={user.id}
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                            setSelectedUser(user)
                            }
                        } 
                        className="flex items-center justify-between p-2 hover:bg-amber-50">
                        <span>{user.name}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => HandleDeleteFriend(e, user.id)}
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
    )
}