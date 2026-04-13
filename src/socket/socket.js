import logger from "@/utils/logger";
import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  if (socket && socket.connected) return socket;

  // Cleanup trước khi tạo mới
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
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
    logger.log("disconnect socket");
    socket.removeAllListeners(); // clear hết listeners
    socket.disconnect();
    socket = null; // set null để connectSocket tạo mới được
  }
};
