import { useGetGroupConversationQuery, useLeaveGroupMutation } from "@/feature/Conversation/conversationApi";
import PhoneBookListLayout from "../components/PhoneBookListLayout";
import { toast } from "sonner";
import logger from "@/utils/logger";

export default function Groups() {
    const [leavegroup] = useLeaveGroupMutation()
    const { data, isLoading, isError, refetch } = useGetGroupConversationQuery();
    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Lỗi rồi!</p>;

    const handleLeaveGrouop = async (conversationId) => {
        try {
            await leavegroup({conversationId}).unwrap()
            toast.success("rời nhóm thành công")
        } catch (err) {
            logger.error(err)
            toast.error( err?.data?.error ||"lỗi không xác định")
        }
    }

    const handleNotification = async (conversationId) => {
        toast.warning("chức năng đang được phát triển")
        return
    }
    return (
        <PhoneBookListLayout
            subtitle="Nhóm và cộng đồng"
            icon="fa-user"
            title="Danh sách Nhóm và cộng đồng"
            count={data.length}
            >
            <ul>
                {data.map((c) => {
                    return (
                        <li key={c.id} className="flex items-center justify-between p-2 hover:bg-amber-50">
                            <p>{c.title}</p>
                            <div className="flex gap-2">
                                <button
                                onClick={() => handleNotification()}
                                    className="px-3 py-1 bg-blue-500 text-white text-sm userounded hover:bg-blue-600"
                                >
                                    Tắt thông báo
                                </button>
                                <button
                                    onClick={() => handleLeaveGrouop(c.id)}
                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                >
                                    Rời nhóm
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </PhoneBookListLayout>
    )
}