import { io } from "socket.io-client";
import { socket_io } from "../Utils";

let socket = null;

export const initSocketConnection = () => {
  if (!socket) {
    socket = io(socket_io);
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
