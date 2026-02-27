import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useSelector } from "react-redux"
import { selectUser } from "@/feature/User/userSelector"

function ChatLayout(){
    const navigate = useNavigate()
    const user = useSelector(selectUser)
    if(!user?.user) {
        navigate("/login")
        return
    }
    return (
    <div className="flex min-h-screen">
        <div className="fixed top-0 bottom-0 w-[280px] border-r flex overflow-auto">
            <Sidebar/>
        </div>

        <div className="flex-1 flex flex-col ml-[280px] mr-[280px] ">
            <div className="sticky top-0 flex border-b pt-1 pb-5 bg-background">
                <h1 onClick={()=> navigate("/home")}
                className=" ml-auto mr-auto text-center
                cursor-pointer">
                CHATBOT</h1>
            </div>
            <Outlet/>
        </div>

        <div className="fixed right-0 top-0 bottom-0 w-[280px] border-l">Right Sidebar</div>
    </div>
    )
}

export default ChatLayout