import AuthLayout from "@/layouts/AuthLayout";
import ChatLayout from "@/layouts/ChatLayout";
import ForgotPassword from "@/page/Auth/ForgotPassword";
import Login from "@/page/Auth/Login";
import Register from "@/page/Auth/Register";
import ResetPassword from "@/page/Auth/ResetPassword";
import VerifyEmail from "@/page/Auth/VerifyEmail";
import Chat from "@/page/Chat";
import Home from "@/page/Home";
import { HashRouter, Route, Routes } from "react-router-dom";

function AppRoutes() {
    return (
    <HashRouter>
        <Routes>
            <Route element={<ChatLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/chat/:conversationId" element={<Chat/>}/>
            </Route>
            <Route element={<AuthLayout/>}>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/verify-email" element={<VerifyEmail/>}/>
            </Route>
        </Routes>
    </HashRouter>
    )
}

export default AppRoutes