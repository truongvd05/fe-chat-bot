import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "@/feature/User/userSelector"

function AuthLayout() {
    const user = useSelector(selectUser)
    if(!user) {
        return <Navigate to="/login" replace/>
    }
    return (
        <div className="h-screen flex">
            <Outlet/>
        </div>
    )
}

export default AuthLayout