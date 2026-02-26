import { useTheme } from "@/contexts/ThemeContext"

function Message({message, right, key}) {
    const {theme, setTheme} = useTheme()
    
    return (
        <div key={key} className={`
        ${right ? "flex justify-end ml-auto" : "" } 
        w-[80%] whitespace-pre-wrap break-words
        `}>
            <p className={`
                ${right && theme === "light" ? "bg-olive-100 " : ""}
                ${right ? "border border-white" : ""}
                px-2 py-3 rounded-2xl
                `}>
                {message.content}</p>
        </div>
    )
}   


export default Message