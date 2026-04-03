import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useVerifyEmailMutation } from "@/feature/Auth/authApi";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [VerifyEmail, {isLoading, isError, isSuccess}] = useVerifyEmailMutation()

    useEffect(() => {
        if (!token) return;
        VerifyEmail({token})
    }, [token])

return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle className="m-auto">Xác thực Email</CardTitle>
            </CardHeader>
            <div className="w-[80%] m-auto gap-2 text-center">
                {isLoading && (
                    <div className="flex gap-2 items-center justify-center">
                        <p>Đang xác minh...</p>
                        <i className="fa-solid fa-spinner animate-spin text-gray-400"></i>
                    </div>)}
                    {!isLoading  && (
                        <>
                            <div className="flex gap-2 items-center justify-center mb-2">
                                {isSuccess && (
                                <>
                                    <p>Xác thực thành công</p>
                                    <i className="fa-solid fa-check text-green-500"></i>
                                </>
                                )}
                                {isError && <span className="text-sm text-red-500">Liên kết đã hết hạn hoặc không hợp lệ</span>}
                            </div>
                            <Button>
                                <Link to={`/login`}>Login</Link>
                            </Button>
                        </>
                    )}
            </div>
        </Card>
    )
}

export default VerifyEmail