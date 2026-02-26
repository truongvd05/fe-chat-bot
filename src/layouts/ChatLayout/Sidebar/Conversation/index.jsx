import { useGetBotConversationsQuery, useGetConversationsQuery } from "@/feature/Conversation/conversationApi";
import { useNavigate } from "react-router-dom";
import Skeleton from "./Skeleton";
import { useTheme } from "@/contexts/ThemeContext";

function Conversation({ type, activeId, setActiveId  }) {
    const {theme, setTheme} = useTheme()
    
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
    if (!conversations?.length) return <p> chưa có đoạn chat nào </p>;
    
    return (conversations.map((item)=> {
                return (
                    <div key={item.id}
                    onClick={() => {
                        setActiveId(item.id)
                        navigate(`/chat/${item.id}`)
                    }}
                    className={`rounded-sm cursor-pointer
                        ${theme === "light" ? "hover:bg-gray-300 text-black" : "hover:bg-gray-500 text-white"}
                        ${activeId === item.id ? "bg-gray-400" : ""} py-[3px] px-[5px] w-full h-15`
                            }>
                        <div className="flex items-center">
                            <img src="" alt="" />
                            <div className="flex flex-col gap-2 flex-1">
                                <p>{item.title}</p>
                                {item.lastMessage && <p>{item.lastMessage}</p>}
                            </div>
                        </div>
                    </div>
                )
            })
    )
}

export default Conversation