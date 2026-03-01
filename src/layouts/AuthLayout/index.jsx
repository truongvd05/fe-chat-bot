import { Outlet } from "react-router-dom"

function AuthLayout() {
    return (
        <div className="h-screen flex">
            <Outlet/>
        </div>
    )
}

export default AuthLayout