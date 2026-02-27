import { useTheme } from "@/contexts/ThemeContext";
import React from "react"

const NavIcon = React.forwardRef(({ icon, className, active , ...props}, ref) => {
        const {theme} = useTheme()
        return (
            <div
            ref={ref}
            {...props}
            className={`cursor-pointer ${theme === "light" ? "hover:bg-gray-300 text-black" : "hover:bg-gray-500 text-white"} p-1 
            rounded-sm transition-all duration-200 relative
            ${active ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-gray-200"}
            `}
            >
                <i className={`${icon} text-3xl ${className} `}></i>
            </div>
        )
    }
)

NavIcon.displayName = "NavIcon";

export default NavIcon