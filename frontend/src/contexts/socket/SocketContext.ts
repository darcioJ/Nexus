import { createContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextData {
    socket: Socket;
    isConnected: boolean;
}

export const SocketContext = createContext<SocketContextData>({} as SocketContextData);