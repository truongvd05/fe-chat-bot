import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useResendVerifyEmailMutation } from "@/feature/User/userApi";
import { Link } from "react-router-dom";

function SendVerifyEmail() {
    const [sendVerifyEmail, { isSuccess, isError, isLoading }] = useResendVerifyEmailMutation()

    const handleSend = async () => {
        try {
            await sendVerifyEmail().unwrap()
        } catch (err) {
            toast.error(err?.data?.error || "Có lỗi xảy ra, thử lại!")
        }
    }

    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle className="m-auto">Gửi mã xác thực</CardTitle>
            </CardHeader>
            <div className="w-[80%] m-auto gap-2 text-center">
                {isSuccess ? (
                    <>
                        <div className="flex gap-3">
                            <p>Chúng tôi đã gửi mã về Email của bạn</p>
                            <i className="fa-solid fa-check text-green-500"></i>
                        </div>
                        <Button className="mt-5">
                            <Link to="/">Home</Link>
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleSend} disabled={isLoading} className="mt-5">
                        {isLoading ? (
                            <>
                                Đang gửi...
                                <i className="fa-solid fa-spinner animate-spin ml-2"></i>
                            </>
                        ) : "Gửi mã xác thực"}
                    </Button>
                )}
            </div>
        </Card>
    )
}

export default SendVerifyEmail