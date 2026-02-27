import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useMemo, useState } from "react";
import { useRegisterMutation, useValidateEmailMutation } from "@/feature/Auth/authApi";
import debounce from "lodash.debounce";
import { NavLink, useNavigate } from "react-router-dom";

const schema = yup.object({
    username: yup.string().min(3, "tên ít nhất 3 kí tự").required("Tên người dùng là bắt buộc"),
    email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    password: yup.string().min(6, "mật khẩu tối thiểu 6 kí tự").required("Mật khẩu là bắt buộc"),
    password_confirmation: yup.string().oneOf([yup.ref("password")], "Mật khẩu không trùng khớp").required("Nhập lại mật khẩu")
})

function Register() {
        const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const [toast, setToast] = useState(false)
    const navigate = useNavigate()
    
    const [registerUser, {
        isLoading: isRegisterLoading,
        error: isErrorRegister
    }] = useRegisterMutation();
    const [validateEmail, {isLoading: isCheckingEmail }] = useValidateEmailMutation()

    const onSubmit = async (data) => {
        try {
            const res = await registerUser({
                name: data.username,
                email: data.email,
                password: data.password,
                confirm_password: data.password_confirmation
            }).unwrap();

            console.log(res);
            localStorage.setItem("access_token", res.access_token)
            localStorage.setItem("refresh_token", res.refresh_token)
            setToast(true);
            setTimeout(() => {
                navigate("/login")
            }, 6000);
        } catch (err) {
            setError("root", {
                type: "manual",
                message: err?.data?.error
            })            
        } finally {
            setTimeout(()=> {
                setToast(false);
            }, 5000)
        }
    }

    const emailvalue = watch("email")

    const checkEmail = useMemo(() => {
        return debounce(async (email) => {
            if(!email) return;
            try {
                await validateEmail({email}).unwrap();
                clearErrors("email");
            } catch (err) {
                setError("email", {
                    type: "manual",
                    message: err.data.error || "email không hợp lệ",
                });
            }
        }, 800);
    }, [clearErrors, setError]);

    useEffect(() => {
        checkEmail(emailvalue);
        clearErrors("root")
      }, [emailvalue, checkEmail]);
    //   cleanup
    useEffect(() => {
        return () => {
            checkEmail.cancel();
        };
    }, [checkEmail]);
    
    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle className="m-auto">Register</CardTitle>
            </CardHeader>
            <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-[80%] m-auto gap-2">
                    <Input type="text" autoComplete="username" placeholder="Tên người dùng" {...register("username", { required: true })}/>
                    {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                    <div className="relative">
                        <Input autoComplete="email" type="email" placeholder="Email" {...register("email", { required: true })}/>
                        {isCheckingEmail && <i className="fa-solid fa-spinner absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"></i>}
                    </div>
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    <Input type="password" autoComplete="new-password" placeholder="Mật khẩu" {...register("password", { required: true })}/>
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    <Input type="password" autoComplete="new-password" placeholder="Xác nhận mật khẩu" {...register("password_confirmation", { required: true })}/>
                    {errors.password_confirmation && <span className="text-red-500 text-sm">{errors.password_confirmation.message}</span>}
                </div>
                {errors.root && <p className="text-red-500">{errors.root.message || "Đã có lỗi xảy ra"}</p>}
                {isRegisterLoading && <i className="fa-solid fa-spinner animate-spin text-gray-400"></i>}
                <Button disabled={isRegisterLoading} className="block" type="submit">Đăng kí</Button>
            </form>
            <CardFooter className=" flex flex-col"> 
                <NavLink className="" to="/login">Đã có tài khoản</NavLink>
            </CardFooter>
            <div
                className={`
                    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    text-center rounded-2xl px-6 py-4
                    bg-popover text-green-600
                    transition-all duration-200
                    border
                    ${toast
                    ? "opacity-100 scale-100 z-50"
                    : "opacity-0 scale-90 pointer-events-none -z-10"}
                `}
                >
                Chúng tôi đã gửi một liên kết xác thực tới email của bạn.
                Vui lòng kiểm tra email để xác thực tài khoản
            </div>
        </Card>
    )
}

export default Register