import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  socket = io(import.meta.env.VITE_BASE_URL_SOCKET, {
    auth: {
      token,
    },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;
