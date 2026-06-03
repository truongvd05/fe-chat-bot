import { lazy, Suspense  } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import ChatLayout from "@/layouts/ChatLayout";
import ChatUserWrapper from '@/page/ChatUser';
import ChatEmpty from '../ChatEmpty';

const Login = lazy(() => import("@/page/Auth/Login"))
const Register = lazy(() => import("@/page/Auth/Register"))
const ResetPassword = lazy(() => import("@/page/Auth/ResetPassword"))
const VerifyEmail = lazy(() => import("@/page/Auth/VerifyEmail"))
const ChangePassword = lazy(() => import("@/page/Auth/ChangePassword"))
const ForgotPassword = lazy(() => import("@/page/Auth/ForgotPassword"))
const Profile = lazy(() => import("@/page/Profile"))
const NotFound = lazy(() => import("@/page/NotFound"))
const Friends = lazy(() => import("@/page/PhoneBook/Friends"))
const FriendsRequests = lazy(() => import("@/page/PhoneBook/FriendRequests"))
const Groups = lazy(() => import("@/page/PhoneBook/Groups"))
const GroupRequests = lazy(() => import("@/page/PhoneBook/GroupRequests"))
const SendVerifyEmail = lazy(() => import("@/page/Auth/SendVerifyEmail"))

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