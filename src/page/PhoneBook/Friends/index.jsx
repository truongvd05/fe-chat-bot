import { useGetFriendQuery } from "@/feature/User/userApi";
import PhoneBookListLayout from "../components/PhoneBookListLayout";

export default function Friends() {
    const { data, isLoading, isError, refetch } = useGetFriendQuery();
    console.log(data);
    
    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Lỗi rồi!</p>;
    return (
        <PhoneBookListLayout subtitle="Bạn bè" icon="fa-user" title="Danh sách bạn bè" count={data.length} >
            <ul className="bg-white p-5">
                {data.map((user) => (
                    <li key={user.friendRequestId} className="flex items-center justify-between p-2 hover:bg-amber-50">
                        <span>{user.name}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBlock(user.id)}
                                className="px-3 py-1 bg-blue-500 text-white text-sm userounded hover:bg-blue-600"
                            >
                                block
                            </button>
                            <button
                                onClick={() => HandleDeleteFriend(user.id)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                                Xóa bạn
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </PhoneBookListLayout>
    )
}