import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://172.17.10.127:3000'; // Replace with your server URL

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
