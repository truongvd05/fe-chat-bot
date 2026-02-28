import { useTheme } from "@/contexts/ThemeContext"

function Message({message, right, user}) {
    const {theme} = useTheme()
    return (
        <div className={`
        ${right ? "flex justify-end ml-auto" : "flex" } 
        w-[80%] whitespace-pre-wrap break-words
        `}>
            <p className={`
                ${user && theme === "light" ? "bg-olive-100 " : ""}
                ${right ? "border border-white" : ""}
                px-2 py-3 rounded-2xl
                `}>
                {message.content}</p>
        </div>
    )
}   


export default Message