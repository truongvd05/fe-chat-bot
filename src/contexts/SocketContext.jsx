import { createContext, useContext, useEffect, useRef, useState } from "react";
import { connectSocket, disconnectSocket } from "@/socket/socket";
import { useSelector } from "react-redux";
import { selectTOken, selectUser } from "@/feature/User/userSelector";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useSelector(selectUser)
    const token = useSelector(selectTOken)
    const [socket, setSocket] = useState(null);
    const isConnectedRef = useRef(false)

    useEffect(() => {
        if (!user || !token) return;

        if (isConnectedRef.current) return;

        const s = connectSocket(token);

        s.on("connect", () => {
            console.log("Socket connected:", s.id);
            isConnectedRef.current = true
            setSocket(s);
        });

        s.on("disconnect", () => {
            console.log("Socket disconnected");
            isConnectedRef.current = false
            setSocket(null);
        });

        if (s.connected) {
            isConnectedRef.current = true
            setSocket(s);
        }

        return () => {
            s.off("connect");
            s.off("disconnect");
        };
    }, [user?.id, token]);

    useEffect(() => {
        if (!user) {
            disconnectSocket()
            isConnectedRef.current = false
            setSocket(null)
        }
    }, [user])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);