import { useGetBotConversationQuery } from "@/feature/Conversation/conversationApi";
import { useGetMessageQuery } from "@/feature/Message/messageApi";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea"
import Message from "./Message";

function Chat() {
    const { conversationId } = useParams()
    const { data: conversationData, isLoading: conversatonLoading, error: conversationError } = useGetBotConversationQuery(conversationId)
    const { data: messageData, isLoading: messageLoading, error: messageError } = useGetMessageQuery(conversationId)
    return (
        <>
            <div className="px-2 py-2 flex-1">
                <p className="text-2xl py-2">{conversationData?.title}</p>
                <div className="flex flex-col flex-1 gap-4 pb-30">
                    {messageData?.map((message) => {
                        return (
                            <div key={message.id} className={`${message.role === "user" ? "" : "border-b border-t"}`}>
                                <Message  message={message} right={message.role === "user"}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="sticky bottom-10 w-[80%] mr-auto ml-auto relative">
                <Textarea id="textarea-message"
                className="overflow-hidden px-5 h-16 text-lg rounded-3xl" placeholder="Enter text"/>
                <i className="p-3 cursor-pointer right-5 absolute top-1/2
                -translate-y-1/2 fa-regular fa-paper-plane
                hover:text-blue-500
                "></i>
            </div>
        </>
    )
}

export default Chat 