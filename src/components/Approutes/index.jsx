import { lazy, Suspense  } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import ChatLayout from "@/layouts/ChatLayout";
import ChatEmpty from '../ChatEmpty';
import NotFound from '@/page/NotFound';
import Friends from '@/page/PhoneBook/Friends';
import Groups from '@/page/PhoneBook/Groups';
import FriendsRequests from '@/page/PhoneBook/FriendRequests';
import GroupRequests from '@/page/PhoneBook/GroupRequests';
import SendVerifyEmail from '@/page/Auth/SendVerifyEmail';
import ChatUserWrapper from '@/page/ChatUser';

const Login = lazy(() => import("@/page/Auth/Login"))
const Register = lazy(() => import("@/page/Auth/Register"))
const ResetPassword = lazy(() => import("@/page/Auth/ResetPassword"))
const VerifyEmail = lazy(() => import("@/page/Auth/VerifyEmail"))
const ChangePassword = lazy(() => import("@/page/Auth/ChangePassword"))
const ForgotPassword = lazy(() => import("@/page/Auth/ForgotPassword"))
const Profile = lazy(() => import("@/page/Profile"))

function AppRoutes() {
    return (
    <Suspense fallback={null}>
        <Routes>
            <Route element={<ChatLayout/>}>
                <Route path="/" element={<Navigate to="/chat" replace/>}/>
                <Route path="/chat">
                    <Route index element={<ChatEmpty />} />
                    <Route path=":conversationId" element={<ChatUserWrapper />} />
                </Route>
                <Route path='/phone-book'>
                    <Route index element={<Navigate to="/phone-book/friends" replace />} />
                    <Route path='friends' element={<Friends />} />
                    <Route path='groups' element={<Groups />} />
                    <Route path='friend-requests' element={<FriendsRequests/>} />
                    <Route path='group-requests' element={<GroupRequests/>} />
                </Route>
            </Route>
            <Route element={<AuthLayout/>}>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/verify-email" element={<VerifyEmail/>}/>
                <Route path='/change-password' element={<ChangePassword/>}/>
                <Route path='/send-verify-email' element={<SendVerifyEmail/>}/>
            </Route>
            <Route path='/profile' element={<Profile/>}/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Suspense>
    )
}

export default AppRoutes