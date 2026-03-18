import { Navigate, Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useSelector } from "react-redux"
import { selectUser } from "@/feature/User/userSelector"
import User from "@/components/User"

function ChatLayout(){
    const {user} = useSelector(selectUser)
    
    if(!user) {
        return <Navigate to="/login" replace/>
    }
    return (
    <div className="overflow-x-hidden">
        <div className="fixed top-0 bottom-0 w-70 z-10">
            <Sidebar/>
        </div>

        <div className="min-h-screen border-r border-l flex-1 flex flex-col md:mr-25 md:ml-25 lg:ml-70  lg:mr-37.5 xl:mr-70 min-w-0  pb-30 ">
            <Outlet/>
        </div>

        <div className="fixed right-0 top-0 bottom-0 z-0">
            <User/>
        </div>
    </div>
    )
}

export default ChatLayout