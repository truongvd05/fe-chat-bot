import { Input } from "@/components/ui/input";

function FieldStatusInput({
    type = "text",
    placeholder,
    register,
    loading,
    success,
    error,
}) {
    return (
        <div className="w-full">
            <div className="relative">
                <Input
                    type={type}
                    placeholder={placeholder}
                    {...register}
                />

                {loading && (
                    <i className="fa-solid fa-spinner absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"></i>
                )}

                {!loading && success && (
                    <i className="fa-solid fa-check absolute right-3 top-1/2 -translate-y-1/2 text-green-500"></i>
                )}
            </div>

            {error && (
                <span className="text-red-500 text-sm">
                    {error.message}
                </span>
            )}
        </div>
    );
}

export default FieldStatusInput;