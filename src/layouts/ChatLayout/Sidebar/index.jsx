import { useState } from "react";
import Conversation from "./Conversation"
import NavigationRall from "./NavigationRaill"
import { useTheme } from "@/contexts/ThemeContext";

function Sidebar() {
    const url = location.hash.split("/")[1]
    const [type, setType] = useState(url);
    const [isOpen, setIsOpen] = useState(false)
    const {theme} = useTheme()
    return (
        <>
            {<div>
                <button
                    onClick={() => setIsOpen(true)}
                    className={`lg:hidden text-xl cursor-pointer p-2 top-0 ${isOpen ? "hidden" : "block"}`}>
                    <i className="fa-solid fa-align-justify"></i>
                </button>
            </div>}
            {isOpen && <div onClick={() => setIsOpen(false)} className={`
                fixed inset-0 bg-black/40 z-[1] lg:hidden
            `}/>}
            <div className={`fixed lg:static top-0 left-0 h-full z-[2] ${theme === "dark" ? "bg-neutral-700" : "bg-white"}
            transform transition-transform duration-300
             ${isOpen ? "translate-x-0" : "-translate-x-full"}
             lg:translate-x-0
             w-[280px]
            `}>
                <div className="py-[30px] px-[5px] h-full flex overflow-auto">
                    {isOpen && <div className="z-[3] fixed right-5 top-5">
                        <i onClick={() => setIsOpen(false)}
                        className="mr-auto fa-solid fa-xmark cursor-pointer py-2
                        hover:bg-amber-100 rounded-2xl
                        "></i>
                    </div>}
                    <div className="w-[20%] flex flex-col justify-between gap-2 items-center">
                        <NavigationRall setType={setType} type={type} />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 items-center">
                        <Conversation type={type} setIsOpen={setIsOpen} isOpen={isOpen}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar