import { useGetGroupConversationQuery } from "@/feature/Conversation/conversationApi";
import PhoneBookListLayout from "../components/PhoneBookListLayout";

export default function Groups() {
    const { data, isLoading, isError, refetch } = useGetGroupConversationQuery();
    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Lỗi rồi!</p>;
    console.log(data);
    
    
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
                        <li key={c.id}>
                            <p>{c.title}</p>
                        </li>
                    )
                })}
            </ul>
        </PhoneBookListLayout>
    )
}