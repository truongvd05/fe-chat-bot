import { useTheme } from "@/contexts/ThemeContext"

function Message({message, right, user}) {
    const {theme} = useTheme()
    console.log();
    
    return (
        <>
            <div className={`
            ${right ? "flex justify-end ml-auto" : "flex" } 
            w-[80%]
            `}>
                <p className={
                    `
                    whitespace-pre-wrap
                    ${user ? "break-all" : ""}
                    ${user && theme === "light" ? "bg-olive-100 " : ""}
                    ${right ? "border border-white" : ""}
                    px-2 py-3 rounded-2xl
                    `}>
                    {message.content}</p>
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