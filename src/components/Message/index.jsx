import { useTheme } from "@/contexts/ThemeContext"
import Markdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

function Message({message, right, user}) {
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
  if(!message?.content) return null;
    return (
        <>
            <div className={`${right ? "flex justify-end ml-auto" : "flex" } w-[80%]`}>
                {user ? <p className={bubbleClass}>
                    {message.content}
                </p> : 
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
                </div>
                }
            </div>
            {message.status === "sending" && (
            <span className="text-xs text-gray-400 ml-2">
                Đang gửi...
            </span>
            )}
        </>
    )
}   


export default Message