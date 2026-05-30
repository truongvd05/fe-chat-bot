import { Navigate, Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useSelector } from "react-redux"
import { selectUser } from "@/feature/User/userSelector"
import { toast } from "sonner"
import { useEffect } from "react"

function ChatLayout(){
    const {user} = useSelector(selectUser)
    const navigate = useNavigate()
    useEffect(() => {
        if (user && !user.emailVerifiedAt) {
            toast.warning("Xác thực email để sử dụng đầy đủ tính năng", {
                duration: 5000,
                action: {
                    label: "Xác thực ngay",
                    onClick: () => navigate("/send-verify-email")
                }
            });
        }
    }, [user.id]);
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