import { useContext } from 'react';
import { SocketContext } from '../contexts/socket/SocketContext';
import { triggerHaptic } from '../utils/triggerHaptic';

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket deve ser usado dentro de um SocketProvider');
    }

    // Atalho para emitir sinais com feedback tátil automático
    const emit = (event: string, data: any, haptic?: 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'SUCCESS') => {
        if (haptic) triggerHaptic(haptic);
        context.socket.emit(event, data);
    };

    return { 
        socket: context.socket, 
        isConnected: context.isConnected, 
        emit 
    };
};