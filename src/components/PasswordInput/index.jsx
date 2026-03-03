import { useState } from "react"
import { Input } from "@/components/ui/input"


function PasswordInput ({
  placeholder,
  autoComplete,
  register,
  error,
}) {
    const [show, setShow] = useState(false)
    return (
        <div className="w-full">
            <div className="relative w-full">
                <Input  type={show ? "text" : "password"} autoComplete={autoComplete} placeholder={placeholder} {...register}/>
                <button
                    tabIndex={-1} 
                    type="button"
                    onClick={() => setShow(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                    {show ? (
                        <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                        <i className="fa-solid fa-eye"></i>
                    )}
                </button>
            </div>
            {error && (
            <span className="text-red-500 text-sm mt-1 block">
                {error.message}
            </span>
            )}
        </div>
    )
}

export default PasswordInput