import { Navigate, Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useSelector } from "react-redux"
import { selectUser } from "@/feature/User/userSelector"
import { useEffect } from "react"
import { connectSocket } from "@/socket/socket"
import User from "@/components/User"

function ChatLayout(){
    const navigate = useNavigate()
    const user = useSelector(selectUser)
    const access_token = localStorage.getItem("access_token")
    if(!user?.user) {
        return <Navigate to="/login" replace/>
    }
    useEffect(() => {
        if(access_token){
            connectSocket(access_token)
        }
    }, [access_token])
    
    return (
    <div className="flex  min-h-screen overflow-x-hidden">
        <div className="fixed flex top-0 bottom-0 w-[280px]">
            <Sidebar/>
        </div>

        <div className="flex-1 flex flex-col ml-[60px] mr-[60px] lg:ml-[280px] lg:mr-[280px] min-w-0">
            <Outlet/>
        </div>

        <div className="fixed hidden lg:block right-0 top-0 bottom-0 w-[280px] border-l">
            <User/>
        </div>
    </div>
    )
}

export default ChatLayout