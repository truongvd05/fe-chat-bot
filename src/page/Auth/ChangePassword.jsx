import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useForm } from "react-hook-form"
import { NavLink, useNavigate } from "react-router";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import PasswordInput from "@/components/PasswordInput";
import { useChangePasswordMutation } from "@/feature/User/userApi";
import { logOut } from "@/feature/User/userSlice";
import { useDispatch } from "react-redux";
import logger from "@/utils/logger";

const schema = yup.object({
    password: yup.string().min(6, "mật khẩu ít nhất 6 kí tự").required("Mật khẩu dùng là bắt buộc"),
    new_password: yup.string().notOneOf(
      [yup.ref("password")],
      "Mật khẩu mới phải khác mật khẩu cũ"
    ).min(6, "mật khẩu tối thiểu 6 kí tự").required("Mật khẩu là bắt buộc"),
    confirm_password: yup.string().oneOf([yup.ref("new_password")], "Mật khẩu không khớp").required("Vui lòng nhập lại mật khẩu"),
})

function ChangePassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema), mode: "onSubmit", reValidateMode: "onChange" });

    const [changePassword, {data, isLoading, isSuccess, isError, error}] = useChangePasswordMutation()
    const onSubmit = async (formData) => {
        try {
            await changePassword(formData).unwrap()
            dispatch(logOut())
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
        } catch (err) {
            logger.log(err);
        }
    }
    return (
            <Card className="w-full max-w-sm m-auto">
                <CardHeader>
                    <CardTitle className="m-auto">Đổi mật khẩu</CardTitle>
                </CardHeader>
                <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col w-[80%] m-auto gap-2">
                        <PasswordInput
                            placeholder="Mật khẩu cũ"
                            autoComplete="current-password"
                            register={register("password")}
                            error={errors.password}
                        />
                        <PasswordInput
                            placeholder="Mật khẩu mới"
                            autoComplete="new-password"
                            register={register("new_password")}
                            error={errors.new_password}
                        />
                        <PasswordInput
                            placeholder="Nhập lại mật khẩu mới"
                            autoComplete="new-password"
                            register={register("confirm_password")}
                            error={errors.confirm_password}
                        />
                    </div>
                    {isLoading && <p className="text-green-300">Đang xử lý..."</p>}
                    {isSuccess && <p className="text-green-300">Đổi mật khẩu thành công Vui Lòng đăng nhập lại</p>}
                    {error && <p className="text-red-300">{error.error || "lỗi"}</p>}
                    <Button disabled={isLoading} className="block" type="submit">Đổi mật khẩu</Button>
                </form>
                <CardFooter className=" flex flex-col gap-4">
                    {isSuccess && <Button onClick={() => navigate("/login")}>Login</Button>}
                    <NavLink onClick={() => navigate(-1)}>Back</NavLink>
                </CardFooter>
            </Card>
    )
}

export default ChangePassword




