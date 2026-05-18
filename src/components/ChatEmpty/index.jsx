import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const features = [
    {
        img: "https://chat.zalo.me/assets/inapp-welcome-screen-06-darkmode.336078e876ae12bf42474586745397f0.png",
        title: "Giao diện dark mode",
        desc: "Thư giản và bảo vệ mắt với chế độ giao diện mới trên zaloClone"
    },
    {
        img: "https://chat.zalo.me/assets/quick-message-onboard.3950179c175f636e91e3169b65d1b3e2.png",
        title: "Nhóm chat tiện lợi",
        desc: "Tạo nhóm, quản lý thành viên dễ dàng"
    },
    {
        img: "https://chat.zalo.me/assets/zbiz_onboard_vi_3x.62514921c8505730d07aff3fa8c4e9c3.png",
        title: "Gửi file mọi định dạng",
        desc: "Chia sẻ tài liệu, hình ảnh không giới hạn"
    },
    {
        img: "https://chat.zalo.me/assets/inapp-welcome-screen-04.1e316ea11f2bfc688dd4edadb29b9750.png",
        title: "Trải nghiêm xuyên xuốt?",
        desc: "Kết nối và giải quyết công việc với dữ liệu luôn được đồng bộ    "
    },
    {
        img: "https://chat.zalo.me/assets/inapp-welcome-screen-03.ba238595e7a8186393b3f47805a025eb.png",
        title: "Gửi file nặng?",
        desc: "Đã có zaloClone xử lí"
    },
]

const CARD_WIDTH = 280

function ChatEmpty() {
    const navigate = useNavigate()
    const [offset, setOffset] = useState(0)
    const maxOffset = (features.length - 1) * CARD_WIDTH
    const timerRef = useRef(null)

    const resetTimer = () => {
        clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setOffset(prev => {
                if (prev >= maxOffset) return 0      // về đầu khi hết
                return prev + CARD_WIDTH
            })
        }, 5000)
    }

    useEffect(() => {
        resetTimer()
        return () => clearInterval(timerRef.current)
    }, [])

    const goNext = () => {
        setOffset(prev => {
            if (prev >= maxOffset) return 0
            return prev + CARD_WIDTH
        })
        resetTimer()
    }

    const goPrev = () => {
        setOffset(prev => {
            if (prev <= 0) return maxOffset
            return prev - CARD_WIDTH
        })
        resetTimer()
    }
    return (
        <div className="min-h-screen bg-white flex flex-col gap-15">
            <motion.div
                className="flex flex-col items-center justify-center  gap-6 text-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl font-bold text-blue-600">Chào mừng đến với ZaloClone</h1>
                <p className="text-gray-500 max-w-md text-lg">
                    Kết nối dễ dàng — Nhắn tin, gọi điện, chia sẻ khoảnh khắc
                </p>
            </motion.div>

            <div className="pb-24 px-4">

                <div className="relative flex items-center gap-4 max-w-4xl mx-auto">
                    {/* Nút trái */}
                    <button
                        onClick={goPrev}
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-chevron-left" />
                    </button>

                    <div className="overflow-hidden flex-1">
                        <motion.div
                            className="flex gap-6"
                            animate={{ x: -offset }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-64 flex flex-col items-center text-center gap-4 p-4 rounded-2xl border shadow-sm"
                                >
                                    <img
                                        src={feature.img}
                                        className="w-48 h-48 object-cover rounded-xl"
                                    />
                                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Nút phải */}
                    <button
                        onClick={goNext}
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-chevron-right" />
                    </button>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {features.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setOffset(index * CARD_WIDTH)
                                resetTimer()
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                offset === index * CARD_WIDTH
                                    ? "bg-blue-600 w-4"
                                    : "bg-gray-300 w-2"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChatEmpty