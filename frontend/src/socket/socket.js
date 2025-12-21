import { io } from 'socket.io-client';

const socket = io('https://api.codezy.space', {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
});

export default socket;