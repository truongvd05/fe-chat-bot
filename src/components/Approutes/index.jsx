import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import ChatLayout from "@/layouts/ChatLayout";
import ChatEmpty from '../ChatEmpty';
import NotFound from '@/page/NotFound';

const Login = lazy(() => import("@/page/Auth/Login"))
const Register = lazy(() => import("@/page/Auth/Register"))
const ResetPassword = lazy(() => import("@/page/Auth/ResetPassword"))
const VerifyEmail = lazy(() => import("@/page/Auth/VerifyEmail"))
const ChangePassword = lazy(() => import("@/page/Auth/ChangePassword"))
const ForgotPassword = lazy(() => import("@/page/Auth/ForgotPassword"))
const Profile = lazy(() => import("@/page/Profile"))
const ChatUser = lazy(() => import("@/page/ChatUser"))

function AppRoutes() {
    
    return (
    <BrowserRouter>
        <Routes>
            <Route element={<ChatLayout/>}>
                <Route path="/" element={<Navigate to="/chat" replace/>}/>
                <Route path="/chat">
                    <Route index element={<ChatEmpty />} />
                    <Route path=":conversationId" element={<ChatUser />} />
                </Route>
            </Route>
            <Route element={<AuthLayout/>}>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/verify-email" element={<VerifyEmail/>}/>
                <Route path='/change-password' element={<ChangePassword/>}/>
            </Route>
            <Route path='/profile' element={<Profile/>}/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
    )
}

export default AppRoutes