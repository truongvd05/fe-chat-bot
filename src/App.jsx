import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './components/Approutes'
import { useEffect } from 'react';
import { setUserOffline, setUserOnline } from './feature/onlineUsers/onlineUsersSlice';
import { useSocket } from './contexts/SocketContext';
import { Toaster } from "sonner"
import { selectUser } from './feature/User/userSelector';

function App() {
    const {user} = useSelector(selectUser)
    const dispatch = useDispatch();
    // connect socket when user loggin
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return;
        const handleUserOnline = (userId) => dispatch(setUserOnline(userId));
        const handleUserOffline = (userId) => dispatch(setUserOffline(userId));

        socket.on("userOnline", handleUserOnline);
        socket.on("userOffline", handleUserOffline);

        return () => {
            socket.off("userOnline", handleUserOnline);
            socket.off("userOffline", handleUserOffline);
        };
    }, [socket, dispatch, user?.id]); 
  return (
    <>
      <Toaster richColors position="top-right" />
      <AppRoutes/>
    </>
  )
}

export default App
