import { useState } from "react";
import Conversation from "./Conversation"
import NavigationRall from "./NavigationRaill"


function Sidebar() {
    const url = location.hash.split("/")[1]
    const [type, setType] = useState(url);
    

    return (
        <div className="flex py-[30px] px-[5px] w-full border-r overflow-auto">
            <div className="w-[20%] flex flex-col justify-between gap-2 items-center">
                <NavigationRall setType={setType} type={type} />
            </div>
            <div className="flex-1 flex flex-col gap-2 items-center">
                <Conversation type={type} />
            </div>
        </div>
    )
}

export default Sidebar