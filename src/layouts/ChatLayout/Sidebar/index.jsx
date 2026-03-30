import { useState } from "react";
import Conversation from "./Conversation"
import NavigationRall from "./NavigationRaill"
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation()
    const type = location.pathname.split("/")[1];
    const [isOpen, setIsOpen] = useState(false)
    const {theme} = useTheme()
    return (
        <>
            {<button
                onClick={() => setIsOpen(true)}
                className={`lg:hidden inline-flex text-xl cursor-pointer p-2 top-0 ${isOpen ? "hidden" : "flex"}`}>
                <i className="fa-solid fa-align-justify"></i>
            </button>}
            {isOpen && <div onClick={() => setIsOpen(false)} className={`
                fixed inset-0 bg-black/40 z-10 lg:hidden
            `}/>}
            <div className={`fixed lg:static top-0 left-0 h-full z-11
                ${theme === "dark" ? "bg-neutral-700" : "bg-white"}
                transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
                w-70
                `}>
                <div className="py-7.5 px-1.5 h-full flex overflow-auto">
                    {isOpen && <div className="z-12 fixed right-5 top-5">
                        <i onClick={() => setIsOpen(false)}
                        className="mr-auto fa-solid fa-xmark cursor-pointer py-2
                        hover:bg-amber-100 rounded-2xl
                        "></i>
                    </div>}
                    <div className="w-[20%] flex flex-col justify-between gap-2 items-center">
                        <NavigationRall type={type} />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 items-center overflow-x-hidden">
                        <Conversation type={type} setIsOpen={setIsOpen} isOpen={isOpen}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar