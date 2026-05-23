import { useGetFriendRequestQuery } from "@/feature/User/userApi";
import PhoneBookRequestLayout from "../components/PhoneBookRequestLayout";

export default function FriendsRequests() {
    const { data, isLoading, isError } = useGetFriendRequestQuery();
    
    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Lỗi rồi!</p>;
    if(data.length === 0) {
        return (
        <>
            <p>Bạn không có lời mời nào</p>
        </>

        )
    }
    return (
        <PhoneBookRequestLayout icon="fa-user" title="Lời mời kết bạn">
            <ul className="bg-white p-5">
                {data.map((r) => (
                    <li key={r.friendRequestId} className="flex items-center justify-between p-2 hover:bg-amber-50">
                        <span>{r.name}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => acceptFriend(r.friendRequestId)}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                                Chấp nhận
                            </button>
                            <button
                                onClick={() => rejectFriend(r.friendRequestId)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                                Từ chối
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </PhoneBookRequestLayout>
    )
}