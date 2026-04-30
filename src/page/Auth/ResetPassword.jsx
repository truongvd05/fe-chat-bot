import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { NavLink, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "@/feature/Auth/authApi";
import PasswordInput from "@/components/PasswordInput";
import logger from "@/utils/logger";

const schema = yup.object({
    password: yup.string().min(6, "mật khẩu tối thiểu 6 kí tự").required("Mật khẩu là bắt buộc"),
    new_password: yup.string().oneOf([yup.ref("password")], "Mật khẩu không trùng khớp").required("Nhập lại mật khẩu")
})

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({resolver: yupResolver(schema), mode: "onSubmit", reValidateMode: "onChange" });

    const [ResetPassword, {isLoading: isResetPasswordLoading, error, isSuccess}] = useResetPasswordMutation();

    const onSubmit = async (data) => {
        try {
            await ResetPassword({
                token: token,
                password: data.password,
                new_password: data.new_password
            }).unwrap();
        } catch (err) {
            setError("root", {
                type: "manual",
                message: err?.data?.error || "Đăng nhập thất bại",
        });
        }
    }
    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle className="m-auto">Quên mật khẩu</CardTitle>
            </CardHeader>
            <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isResetPasswordLoading} 
                className={`w-full flex flex-col items-center gap-2 
                    ${isResetPasswordLoading ? "opacity-70" : ""}`}
                    >
                    <div className="flex flex-col w-[80%] m-auto gap-2">
                        <PasswordInput
                            placeholder="Mật khẩu mới"
                            autoComplete="password"
                            register={register("password")}
                            error={errors.password}
                        />
                        <PasswordInput
                            placeholder="Nhập lại mật khẩu mới"
                            autoComplete="new-password"
                            register={register("new_password")}
                            error={errors.new_password}
                        />
                    </div>
                </fieldset>
                {errors.root && <p className="text-red-500">{errors.root.message || "Đã có lỗi xảy ra"}</p>}
                {isResetPasswordLoading && <i className="fa-solid fa-spinner animate-spin text-gray-400"></i>}
                <Button disabled={isResetPasswordLoading} className="block" type="submit">Đổi mật khẩu</Button>
            </form>
            {isSuccess && <CardFooter className="flex flex-col"> 
                <NavLink className="text-sm text-green-500" to="/login">Đổi mật khẩu thành công vui lòng đăng nhập lại</NavLink>
            </CardFooter>}
            <CardFooter className="flex flex-col"> 
                <NavLink className="" to="/login">Back</NavLink>
            </CardFooter>
        </Card>
    )
}

export default ResetPassword