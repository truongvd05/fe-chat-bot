import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/socket/socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        if (!token) {
            disconnectSocket();
            setSocket(null);
            return;
        }

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
            disconnectSocket();
            setSocket(null);
        };
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);