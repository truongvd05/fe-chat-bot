import { useDispatch } from 'react-redux';
import AppRoutes from './components/Approutes'
import { useEffect } from 'react';
import { setUserOffline, setUserOnline } from './feature/onlineUsers/onlineUsersSlice';
import { useSocket } from './contexts/SocketContext';

function App() {
    const dispatch = useDispatch();
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
    }, [socket, dispatch]); 
  return (
    <>
      <AppRoutes/>
    </>
  )
}

export default App
