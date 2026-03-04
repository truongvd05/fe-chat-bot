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
    <div className="flex min-h-screen overflow-x-hidden">
        <div className="fixed flex top-0 bottom-0 w-[280px]">
            <Sidebar/>
        </div>

        <div className="flex-1 flex flex-col ml-[60px] mr-[60px] lg:ml-[280px] md:mr-[100px]  lg:mr-[150px] xl:mr-[280px] min-w-0 border-r border-l">
            <Outlet/>
        </div>

        <div className="fixed right-0 top-0 bottom-0 z-[0]">
            <User/>
            <div onClick={() => {
                window.scrollTo({
                top: 0,
                behavior: "smooth"
                });
            }}
            className="bg-amber-200 cursor-pointer rounded-full h-[40px] w-[40px] flex items-center justify-center fixed bottom-3 right-3 md:bottom-10 md:right-10">
                <i className=" fa-solid fa-arrow-up
                 text-2xl  
                "></i>
            </div>
        </div>
    </div>
    )
}

export default ChatLayout