import { createContext, useContext, useEffect, useRef, useState } from "react";
import { connectSocket, disconnectSocket } from "@/socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { selectTOken, selectUser } from "@/feature/User/userSelector";
import { setOnlineUsers } from "@/feature/onlineUsers/onlineUsersSlice";
import logger from "@/utils/logger";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useSelector(selectUser)
    const token = useSelector(selectTOken)
    const dispatch = useDispatch()
    const [socket, setSocket] = useState(null);
    const isConnectedRef = useRef(false)

    useEffect(() => {
        if (!user || !token) return;

        if (isConnectedRef.current) return;

        const s = connectSocket(token);

        s.on("connect", () => {
            logger.log("Socket connected:", s.id);
            isConnectedRef.current = true
            setSocket(s);
        });

        s.on("online_users", (userIds) => {
            logger.log("online_users received:", userIds)
            dispatch(setOnlineUsers(userIds))
        })

        s.on("disconnect", () => {
            logger.log("Socket disconnected");
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