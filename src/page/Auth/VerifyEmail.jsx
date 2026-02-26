import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useVerifyEmailMutation } from "@/feature/Auth/authApi";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function VerifyEmail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const token = searchParams.get("token");
    const [VerifyEmail, {isLoading}] = useVerifyEmailMutation()
    useEffect(() => {
        const Verify = async () => {
            setLoading(true)
            setError(false)
            try {
                const res = await VerifyEmail({token}).unwrap();
                console.log(res);
                // setTimeout(() => {
                //     navigate("/login", {
                //         state: { verified: true }
                //     })
                // }, 5000)
                setSuccess(res.success)
            } catch (err) {
                console.log(err);
                setError(true)
            } finally {
                setLoading(false);
            }
        }
        Verify();
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
                                {success && (
                                <>
                                    <p>Xác thực thành công</p>
                                    <i class="fa-solid fa-check text-green-500"></i>
                                </>
                                )}
                                {error && <span className="text-sm text-red-500">Liên kết đã hết hạn hoặc không hợp lệ</span>}
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