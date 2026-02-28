import { useGetBotConversationsQuery, useGetConversationsQuery } from "@/feature/Conversation/conversationApi";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "./Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import AddFriend from "./AddFriend";
import { useSelector } from "react-redux";
import { selectUser } from "@/feature/User/userSelector";

function Conversation({ type  }) {
    const {user} = useSelector(selectUser)
    const {theme} = useTheme()
    const {conversationId} = useParams()

    const navigate = useNavigate()
    const { data: botData,
        isLoading: botLoading,
    } = useGetBotConversationsQuery("bots", {
        skip: type !== "bots",
    })

    const { data: chatData,
        isLoading: chatLoading,
    } = useGetConversationsQuery(undefined, {
        skip: type !== "chat",
    })
    
    const isLoading = botLoading || chatLoading;
    
    const conversations = type === "bots" ? botData : chatData;
    
    if(isLoading) return <Skeleton/>
    return (
    <div>
        {type === "chat" && <AddFriend/>}
        {!conversations?.length && (
            <p>Chưa có đoạn chat nào</p>
        )}
        {(conversations?.map((item)=> {
            return (
                <div key={item.id}
                onClick={() => {
                    if(type === "chat") {
                        navigate(`/${type}/${item.id}?u=${item.participants[0].user.id}`)
                    } else {
                        navigate(`/${type}/${item.id}`)
                    }
                }}
                className={`rounded-sm cursor-pointer
                    ${theme === "light" ? "hover:bg-gray-300 text-black" : "hover:bg-gray-500 text-white"}
                    ${conversationId === item.id ? "bg-gray-400" : ""} py-[3px] px-[5px] w-full h-15`
                        }>
                    <div className="flex items-center">
                        <div className="flex flex-col gap-2 flex-1">
                            {type === "chat" ? <p>{item.participants[0].user.email}</p>  : <p>{item.title}</p>}
                            {item.lastMessage?.content && <p className="text-sm opacity-70">
                                {(item.lastMessage.user?.id === user.id) ?  "Bạn" : item.lastMessage.user?.name ?? item.lastMessage.user?.email}: {item.lastMessage.content}</p>}
                        </div>
                    </div>
                </div>
            )
        })
        )}
    </div>
)
}
export default Conversation