import { useTheme } from "@/contexts/ThemeContext"
import Markdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

function Message({message, right, user, showName, showTime}) {
    const {theme} = useTheme()

    const bubbleClass = `
        whitespace-pre-wrap
        wrap-break-word
        max-w-full
        px-3 py-2
        rounded-2xl
        ${theme === "light" ? "bg-olive-100" : ""}
        ${right ? "border border-white" : ""}
    `;

    const {attachments} = message;
    
    if(!message?.content && (!attachments || attachments.length === 0)) return null;

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    };
    return (
        <>
            {showName && !right && (
                <span className="text-xs font-semibold text-gray-500 ml-1 mt-1">
                    {message.user?.name}
                </span>
            )}
            <div key={message.id} className={`${right ? "flex justify-end ml-auto" : "flex" } w-[80%]`}>
                {user ? (
                // Tin nhắn người dùng
                <div className={bubbleClass}>
                    {message.content && <p className="m-0">{message.content}</p>}
                    {attachments && attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {attachments.map((p) => (
                                <img
                                    key={p.id}
                                    src={p.fileUrl.replace('/src/uploads/', 'http://localhost:3000/uploads/')}
                                    alt={p.fileName}
                                    className="max-h-60 object-contain rounded-lg"
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // Tin nhắn AI
                <div className={`${bubbleClass}
                    prose prose-sm max-w-none
                    prose-p:my-0
                    prose-pre:bg-black
                    prose-pre:text-white
                    prose-pre:p-3
                    prose-pre:rounded-lg
                    prose-pre:overflow-x-auto`}>
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                        {message.content}
                    </Markdown>
                    {attachments && attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {attachments.map((p) => (
                                <img
                                    key={p.id}
                                    src={p.fileUrl.replace('/src/uploads/', '/uploads/')}
                                    alt={p.fileName}
                                    className="max-h-60 object-contain rounded-lg"
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            </div>
            {showTime && message.createdAt && (
                <span className={`flex text-xs text-gray-400 ${right ? "justify-end mr-1" : "ml-1"}`}>
                    {formatTime(message.createdAt)}
                </span>
            )}
            {message.status === "sending" && (
            <span className="text-xs text-gray-400 flex ml-auto">
                Đang gửi...
            </span>
            )}
        </>
    )
}   


export default Message