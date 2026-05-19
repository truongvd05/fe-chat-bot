import { useGetFriendQuery } from "@/feature/User/userApi";
import PhoneBookListLayout from "../components/PhoneBookListLayout";

export default function Friends() {
    const { data, isLoading, isError, refetch } = useGetFriendQuery();
    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Lỗi rồi!</p>;
    return (
        <PhoneBookListLayout subtitle="Bạn bè" icon="fa-user" title="Danh sách bạn bè" count={data.length} >
            
        </PhoneBookListLayout>
    )
}