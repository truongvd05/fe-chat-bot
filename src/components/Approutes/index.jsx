import { lazy } from 'react';
import { HashRouter, Route, Routes } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import ChatLayout from "@/layouts/ChatLayout";
import Home from "@/page/Home";
import ChatEmpty from '../ChatEmpty';
import ChatUser from '@/page/ChatUser';

const Login = lazy(() => import("@/page/Auth/Login"))
const Register = lazy(() => import("@/page/Auth/Register"))
const ResetPassword = lazy(() => import("@/page/Auth/ResetPassword"))
const VerifyEmail = lazy(() => import("@/page/Auth/VerifyEmail"))
const ForgotPassword = lazy(() => import("@/page/Auth/ForgotPassword"))
const ChatBot = lazy(() => import("@/page/ChatBot"))

function AppRoutes() {
    return (
    <HashRouter>
        <Routes>
            <Route element={<ChatLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/chat">
                    <Route index element={<ChatEmpty />} />
                    <Route path=":conversationId" element={<ChatUser />} />
                </Route>
                <Route path="/bots">
                    <Route index element={<ChatEmpty />} />
                    <Route path=":conversationId" element={<ChatBot />} />
                </Route>
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