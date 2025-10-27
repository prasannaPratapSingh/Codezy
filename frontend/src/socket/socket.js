import { io } from 'socket.io-client';

const socket = io('https://final-code-qrxd.onrender.com', {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
});

export default socket;