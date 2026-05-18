import { useTheme } from "@/contexts/ThemeContext"
import { selectUser } from "@/feature/User/userSelector";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom"

import {
  MoreVertical,
  Reply,
  Pencil,
  Trash2
} from "lucide-react";

function Message({canModify, message, right, showName, showTime, onEdit, onDelete, onReply}) {
    const {theme} = useTheme()
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
    const { user: currentUser } = useSelector(selectUser)
    const [showMenu, setShowMenu] = useState(false);
    const btnRef = useRef(null)
    const menuRef = useRef(null)
    
    const handleToggleMenu = () => {
        if (!showMenu && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect()
            setMenuPos({
                top: rect.bottom + 4,
                left: right ? rect.right - 160 : rect.left
            })
        }
        setShowMenu(prev => !prev)
    }

    useEffect(() => {
        if (!showMenu) return
        const handler = (e) => {
        if ( !btnRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) {
            setShowMenu(false)
        }
    }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [showMenu])


    const bubbleClass = `
        relative
        group
        whitespace-pre-wrap
        max-w-full
        px-3 py-2
        rounded-2xl
        wrap-anywhere 
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
            <div key={message.id} className={`relative group ${right ? "flex justify-end ml-auto" : "flex" } w-[70%]`}>
                <div className={bubbleClass}>
                    <div className={` absolute top-1 ${right ? "-left-10" : "-right-10"} opacity-0 group-hover:opacity-100 transition`}>
                    <button
                        onClick={handleToggleMenu}
                        ref={btnRef}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
                        >
                        <MoreVertical size={18} />
                    </button>
                    {showMenu && createPortal(
                        <div ref={menuRef} 
                            style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
                            className="w-40 rounded-xl border bg-white dark:bg-zinc-900 shadow-lg overflow-hidden"
                        >
                            <button onClick={() => { onReply?.(message); setShowMenu(false) }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                <Reply size={16} /> Reply
                            </button>

                            {canModify && (
                                <>
                                    <button
                                        onClick={() => {
                                            onEdit?.(message);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                    >
                                        <Pencil size={16} />
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() => {
                                            onDelete?.(message);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                    >
                                        <Trash2 size={16} />
                                        Xóa
                                    </button>
                                </>
                            )}
                        </div>,
                        document.body
                    )}
                </div>
                    {message.parentMessage && (
                        <div className="border-l-2 border-purple-400 pl-2 mb-1 text-xs text-gray-400 rounded">
                            <span className="font-semibold text-purple-400">
                                {message.parentMessage.user?.name}
                            </span>
                            <p className="truncate max-w-50">{message.parentMessage.content}</p>
                        </div>
                    )}
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
            </div>
            {message.isEdited && <p className={`flex m-0 text-xs opacity-60 ${right ? "justify-end mr-1" : "ml-1"}`}>Đã chỉnh sửa<a href=""></a></p>}
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