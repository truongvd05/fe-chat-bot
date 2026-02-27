import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/feature/Auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/feature/User/userSlice";

const schema = yup.object({
    email: yup.string().required("Vui lòng nhập Email"),
    password: yup.string().required("Vui lòng nhập mật khẩu")
})

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm({resolver: yupResolver(schema)});

    const emailValue = watch("email")
    const passwordValue  = watch("password")
    useEffect(() => {
        if(errors.err) {
            clearErrors("err")
        }
    }, [emailValue, passwordValue])

    const [login, {isLoading, error}] = useLoginMutation();
    
    const onSubmit = async (data) => {
        try {
            const result  = await login({
                email: data.email,
                password: data.password
            }).unwrap();
            console.log("Login success:", result);
            localStorage.setItem("access_token", result.token.access_token)
            localStorage.setItem("refresh_token", result.token.refresh_token)
            dispatch(setUser(result.user))
            navigate("/home")
        } catch (err) {
            console.log("Login failed:", err);
            setError("err", {
                type: "manual",
                message: err?.data?.error || "Đăng nhập thất bại",
        });
        }
    }
    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle className="m-auto">Log in with your account</CardTitle>
            </CardHeader>
            <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-[80%] m-auto gap-2">
                    <Input type="email" autoComplete="username" placeholder="Email" {...register("email", {required: true})}/>
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    <div className="relative w-[100%] m-auto cursor-pointer">
                        <Input type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="password" {...register("password", { required: true })}/>
                        <div
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                    >{showPassword ? <i className="fa-solid fa-eye-slash w-2"></i> : <i className="fa-solid fa-eye"></i>}</div>
                    </div>
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>
                {errors.err && <span className="text-red-500 text-sm">{errors.err.message}</span>}
                <Button disabled={isLoading} className="block" type="submit">Đăng nhập</Button>
            </form>
            <CardFooter className=" flex flex-col">
                <NavLink className="" to="/forgot-password">Forgot PassWord?</NavLink>
                <p>Bạn chưa có tài khoản? <NavLink to="/register" >Đăng ký</NavLink></p>
            </CardFooter>
        </Card>
    )
}

export default Login