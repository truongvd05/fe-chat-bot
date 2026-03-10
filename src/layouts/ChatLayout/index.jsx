import { Navigate, Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useSelector } from "react-redux"
import { selectUser } from "@/feature/User/userSelector"
import { useEffect } from "react"
import { connectSocket } from "@/socket/socket"
import User from "@/components/User"

function ChatLayout(){
    const {user} = useSelector(selectUser)
    
    useEffect(() => {
        const access_token = localStorage.getItem("access_token")
        if(access_token){
            connectSocket(access_token)
        }
    }, [user?.id])

    if(!user?.user) {
        return <Navigate to="/login" replace/>
    }
    return (
    <div className="flex min-h-screen overflow-x-hidden">
        <div className="fixed flex top-0 bottom-0 w-[280px]">
            <Sidebar/>
        </div>

        <div className="flex-1 flex flex-col ml-[60px] mr-[60px] lg:ml-[280px] md:mr-[100px]  lg:mr-[150px] xl:mr-[280px] min-w-0 border-r border-l">
            <Outlet/>
        </div>

        <div className="fixed right-0 top-0 bottom-0 z-[0]">
            <User/>
        </div>
    </div>
    )
}

export default ChatLayout