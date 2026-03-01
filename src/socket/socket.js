import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  if (socket && socket.connected) return socket;
  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_BASE_URL_SOCKET, {
    auth: {
      token,
    },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
