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
import { useEffect, useState } from "react";
import { useRegisterMutation, useValidateEmailMutation, useValidatePhoneMutation } from "@/feature/Auth/authApi";
import { NavLink, useNavigate } from "react-router-dom";
import PasswordInput from "@/components/PasswordInput";
import useFieldValidator from "@/hooks/useFieldValidator";
import FieldStatusInput from "@/components/FieldStatusInput";

const schema = yup.object({
    username: yup.string().min(3, "tên ít nhất 3 kí tự").required("Tên người dùng là bắt buộc"),
    email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    phonenumber: yup.string()
        .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ")
        .required("Số điện thoại là bắt buộc"),
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

    const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();

    const [validateEmail, {
        isLoading: isEmailLoading,
        isSuccess: isEmailValid,
        error: emailError,
    }] = useValidateEmailMutation()

    const [validatePhone, {
        isLoading: isPhoneLoading,
        isSuccess: isPhoneValid,
    }] = useValidatePhoneMutation()

    const onSubmit = async (data) => {
        try {
            const res = await registerUser({
                name: data.username,
                email: data.email,
                phonenumber: data.phonenumber,
                password: data.password,
                confirm_password: data.password_confirmation,
            }).unwrap();
            localStorage.setItem("access_token", res.access_token)
            localStorage.setItem("refresh_token", res.refresh_token)
            setToast(true);
            setTimeout(() => navigate("/login"), 6000);
        } catch (err) {
            setError("root", {
                type: "manual",
                message: err?.data?.error
            })
        } finally {
            setTimeout(() => setToast(false), 5000)
        }
    }

    const emailvalue = watch("email")
    const phoneValue = watch("phonenumber")

    useFieldValidator({
        value: emailvalue,
        validate: (email) => validateEmail({email}).unwrap(),
        onSuccess: () => clearErrors("email"),
        onError: () => setError("email", {type: "manual", message: "Email đã tồn tại"}),
    })

    useFieldValidator({
        value: phoneValue,
        regex: /^(0)(3|5|7|8|9)([0-9]{8})$/,
        validate: (phonenumber) => validatePhone({phonenumber}).unwrap(),
        onSuccess: () => clearErrors("phonenumber"),
        onError: () => setError("phonenumber", {type: "manual", message: "Số điện thoại đã được dùng"}),
    })

    useEffect(() => {
        clearErrors("email")
        clearErrors("phonenumber")
    }, [emailvalue, phoneValue]);


    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle className="m-auto">Đăng ký</CardTitle>
            </CardHeader>
            <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isRegisterLoading}
                    className={`w-full flex flex-col items-center gap-2 ${isRegisterLoading ? "opacity-70" : ""}`}>
                    <div className="flex flex-col w-[80%] m-auto gap-2">

                        <Input type="text" autoComplete="username" placeholder="Tên người dùng"
                            {...register("username")} />
                        {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}

                        <FieldStatusInput
                            type="email"
                            placeholder="Email"
                            register={register("email")}
                            loading={isEmailLoading}
                            success={isEmailValid}
                            error={errors.email}
                        />
                        <FieldStatusInput
                            type="tel"
                            placeholder="Số điện thoại (0xxxxxxxxx)"
                            register={register("phonenumber")}
                            loading={isPhoneLoading}
                            success={isPhoneValid}
                            error={errors.phonenumber}
                        />

                        <PasswordInput
                            placeholder="Mật khẩu"
                            autoComplete="new-password"
                            register={register("password")}
                            error={errors.password}
                        />
                        <PasswordInput
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                            register={register("password_confirmation")}
                            error={errors.password_confirmation}
                        />
                    </div>
                </fieldset>
                {errors.root && <p className="text-red-500">{errors.root.message || "Đã có lỗi xảy ra"}</p>}
                {isRegisterLoading && <i className="fa-solid fa-spinner animate-spin text-gray-400"></i>}
                <Button disabled={isRegisterLoading} className="block" type="submit">Đăng ký</Button>
            </form>
            <CardFooter className="flex flex-col">
                <NavLink to="/login">Đã có tài khoản</NavLink>
            </CardFooter>
            <div className={`
                fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                text-center rounded-2xl px-6 py-4
                bg-popover text-green-600
                transition-all duration-200 border
                ${toast ? "opacity-100 scale-100 z-50" : "opacity-0 scale-90 pointer-events-none -z-10"}
            `}>
                Chúng tôi đã gửi một liên kết xác thực tới email của bạn.
                Vui lòng kiểm tra email để xác thực tài khoản
            </div>
        </Card>
    )
}

export default Register