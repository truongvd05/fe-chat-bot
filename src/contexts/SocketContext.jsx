import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/socket/socket";
import { useSelector } from "react-redux";
import { selectUser } from "@/feature/User/userSelector";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const user = useSelector(selectUser)
    const [socket, setSocket] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!user || !token) return;

        const s = connectSocket(token);

        s.on("connect", () => {
            console.log("Socket connected:", s.id);
            setSocket(s);
        });

        s.on("disconnect", () => {
            console.log("Socket disconnected");
            setSocket(null);
        });

        // Nếu đã connected sẵn
        if (s.connected) {
            setSocket(s);
        }

        return () => {
            s.off("connect");
            s.off("disconnect");
            s.disconnect();
            setSocket(null);
        };
    }, [user?.id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);