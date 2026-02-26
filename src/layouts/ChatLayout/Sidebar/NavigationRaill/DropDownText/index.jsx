import React from "react";

const DropDownText= React.forwardRef(({text, children, red, ...props}, ref) => {
    return (
        <div {...props} ref={ref} className={`flex justify-between gap-8 w-full ${red ? "text-red-500" : ""}`}>
            <p className="flex-1">{text}</p>
            {children && <span className={`w-[20px] justify-center flex m-auto `}>
                {children}
            </span>}
        </div>  
    )
})

DropDownText.displayName = "DropDownText";

export default DropDownText;