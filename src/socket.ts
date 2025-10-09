import { io, Socket } from 'socket.io-client';

// Use a development-friendly default. Replace with production websocket endpoint when deploying.
const URL = 'ws://localhost:3000';

console.log(`Socket connecting to: ${URL}`);


// autoConnect: false is crucial to manually connect only when the user is logged in.
export const socket: Socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
});