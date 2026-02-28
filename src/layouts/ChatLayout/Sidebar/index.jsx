import { useState } from "react";
import Conversation from "./Conversation"
import NavigationRall from "./NavigationRaill"


function Sidebar() {
    const url = location.hash.split("/")[1]
    const [type, setType] = useState(url);

    return (
        <>
            <div className="py-[30px] px-[5px] w-[20%]  flex flex-col justify-between gap-2 items-center">
                <NavigationRall setType={setType} type={type} />
            </div>
            <div className="py-[30px] px-[5px] flex-1 flex flex-col gap-2 items-center">
                <Conversation type={type} />
            </div>
        </>
    )
}

export default Sidebar