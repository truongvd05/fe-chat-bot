function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-lg">Trang không tồn tại</p>
            <p className="text-gray-500">
                Nếu bạn gặp sự cố, vui lòng liên hệ{" "}
                <a href="mailto:truongbk444@gmail.com" className="underline">
                    truongbk444@gmail.com
                </a>
            </p>
            <a href="/" className="mt-2 underline">Về trang chủ</a>
        </div>
    );
}

export default NotFound;