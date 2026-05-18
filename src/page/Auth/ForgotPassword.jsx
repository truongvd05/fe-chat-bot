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
import { useForgotPasswordMutation, useForgotPasswordByPhoneMutation } from "@/feature/Auth/authApi";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useOTP } from "@/hooks/useOTP";
import { toast } from "sonner";

const emailSchema = yup.object({
    value: yup.string().email("Email không hợp lệ").required("Email là bắt buộc")
})

const phoneSchema = yup.object({
    value: yup.string()
        .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ")
        .required("Số điện thoại là bắt buộc"),
    otp: yup.string().when('$otpSent', {
        is: true,
        then: (s) => s.min(6, "OTP gồm 6 số").required("Vui lòng nhập OTP"),
        otherwise: (s) => s.optional()
    })
})

function ForgotPassword() {
    const [method, setMethod] = useState('email')
    const [successMessage, setSuccessMessage] = useState(false)
    const { otpSent, otpLoading, sendOTP, verifyOTP, resetOTP } = useOTP()

    const [forgotPassword, { isLoading: isEmailLoading }] = useForgotPasswordMutation()
    const [forgotPasswordByPhone, { isLoading: isPhoneLoading }] = useForgotPasswordByPhoneMutation()

    const isLoading = isEmailLoading || isPhoneLoading || otpLoading

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(method === 'email' ? emailSchema : phoneSchema),
        context: { otpSent }
    });

    const inputValue = watch("value");

    useEffect(() => {
        reset()
        resetOTP()
        setSuccessMessage(false)
    }, [method, reset])

    useEffect(() => {
        setSuccessMessage(false);
        clearErrors("value")
        clearErrors("otp")
        clearErrors("root")
    }, [inputValue])

    async function handleSendOTP() {
        toast.warning("Chức năng chưa dùng được do chủ web chưa có tiền đăng kí sms");
        return;
        await sendOTP(inputValue, {
            onError: (msg) => setError("root", { message: msg })
        })
    }

    const onSubmit = async (data) => {
        try {
            if (method === 'email') {
                await forgotPassword({ email: data.value }).unwrap()
                setSuccessMessage(true)
            } else {
                const firebaseToken = await verifyOTP(data.otp, {
                    onError: (msg) => setError("root", { message: msg })
                })
                if (!firebaseToken) return
                await forgotPasswordByPhone({
                    phonenumber: data.value,
                    firebase_token: firebaseToken
                }).unwrap()
                navigate(`/reset-password?token=${res.data.token}`)
                setSuccessMessage(true)
            }
        } catch (err) {
            setError("root", {
                type: "manual",
                message: err?.data?.error || "Có lỗi xảy ra, thử lại!"
            })
        }
    }

    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle className="m-auto">Quên mật khẩu</CardTitle>
            </CardHeader>

            <div className="flex w-[80%] m-auto rounded-lg overflow-hidden border mb-2">
                <button type="button"
                    onClick={() => setMethod('email')}
                    className={`flex-1 py-2 text-sm transition-colors ${method === 'email' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                    Email
                </button>
                <button type="button"
                    onClick={() => setMethod('phone')}
                    className={`flex-1 py-2 text-sm transition-colors ${method === 'phone' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                    Số điện thoại
                </button>
            </div>

            <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-[80%] m-auto gap-2">
                    {method === 'email' ? (
                        <Input
                            type="email"
                            autoComplete="email"
                            placeholder="Nhập email của bạn"
                            {...register("value")}
                        />
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <Input
                                    type="tel"
                                    placeholder="Số điện thoại (0xxxxxxxxx)"
                                    {...register("value")}
                                    disabled={otpSent}
                                />
                                {!otpSent && (
                                    <Button type="button" variant="outline"
                                        onClick={handleSendOTP}
                                        disabled={isLoading}
                                        className="whitespace-nowrap">
                                        {otpLoading ? <i className="fa-solid fa-spinner animate-spin"/> : "Gửi OTP"}
                                    </Button>
                                )}
                            </div>
                            {otpSent && (
                                <div className="flex flex-col gap-1">
                                    <Input
                                        type="text"
                                        placeholder="Nhập mã OTP 6 số"
                                        maxLength={6}
                                        {...register("otp")}
                                    />
                                    <button type="button"
                                        onClick={resetOTP}
                                        className="text-xs text-muted-foreground text-right hover:underline">
                                        Gửi lại OTP
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {errors.value && <span className="text-red-500 text-sm">{errors.value.message}</span>}
                {errors.otp && <span className="text-red-500 text-sm">{errors.otp.message}</span>}
                {errors.root && <span className="text-red-500 text-sm">{errors.root.message}</span>}
                {successMessage && (
                    <span className="text-sm text-green-500">
                        {method === 'email'
                            ? "Link đặt lại mật khẩu đã gửi về email!"
                            : "Xác thực thành công! Vui lòng đặt lại mật khẩu."}
                    </span>
                )}

                {(method === 'email' || otpSent) && (
                    <Button disabled={isLoading} className="block" type="submit">
                        {isLoading ? <i className="fa-solid fa-spinner animate-spin"/> : "Xác nhận"}
                    </Button>
                )}
            </form>

            <div id="recaptcha-container"/>

            <CardFooter className="flex flex-col">
                <NavLink to="/login">Quay lại đăng nhập</NavLink>
            </CardFooter>
        </Card>
    )
}

export default ForgotPassword