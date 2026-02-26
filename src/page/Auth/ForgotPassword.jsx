import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as yup from "yup"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPasswordMutation } from "@/feature/Auth/authApi";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const schema = yup.object({
    email: yup.string().email("email không hợp lệ").required("Email là bắt buộc")
})

function ForgotPassword() {
    const [forgotPassword, {isLoading}] = useForgotPasswordMutation()
        const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm( {resolver: yupResolver(schema) });

    const [ successMessage, setSuccessMessage ] = useState(false);

    const emailValue = watch("email");
    const onSubmit = async (data) => {
        if(!data) return;
        try {
            await forgotPassword({email: data.email}).unwrap();
            setSuccessMessage(true)
        } catch (err) {
            console.log(err);
            setSuccessMessage(false)
            setError("root", {
                type: "manual",
                message: err?.data.error
            })
        }
    }

    useEffect(()=> {
        setSuccessMessage(false);
    }, [emailValue])

return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle className="m-auto">Forgot password</CardTitle>
            </CardHeader>
            <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-[80%] m-auto gap-2">
                    <Input autoComplete="email" type="text" placeholder="Email" {...register("email", { required: true })}/>
                </div>
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                {successMessage && <span className="text-sm text-green-500">Liên kết đặt lại mật khẩu đã được gửi tới email của bạn</span>}
                {errors.root && <span className="text-red-500 text-sm">{errors.root.message || "lỗi"}</span>}
                <Button disabled={isLoading} className="block" type="submit">Đồng ý</Button>
            </form>
            <CardFooter className=" flex flex-col">
                <NavLink className="" to="/login">Đã có tài khoản</NavLink>
            </CardFooter>
        </Card>
    )
}

export default ForgotPassword