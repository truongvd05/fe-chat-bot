import { Navigate, Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useSelector } from "react-redux"
import { selectUser } from "@/feature/User/userSelector"

function ChatLayout(){
    const {user} = useSelector(selectUser)
    
    if(!user) {
        return <Navigate to="/login" replace/>
    }
    return (
    <div className="overflow-x-hidden">
        <div className="fixed top-0 bottom-0 z-10 ">
            <Sidebar/>
        </div>

        <div className="h-screen border-r border-l flex-1 flex flex-col md:ml-25 lg:ml-100  min-w-0 pb-5">
            <Outlet/>
        </div>
    </div>
    )
}

export default ChatLayout