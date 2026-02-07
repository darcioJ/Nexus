import React, { useState, useEffect } from 'react';
import { socket } from '../../socket';
import { SocketContext } from './SocketContext';
import { useAuth } from '../../hooks/useAuth'; // Importe o useAuth aqui

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth(); // Monitoramos o estado do usuário
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log("🟢 [NEXUS_CORE]: Link Estabelecido.");
        }

        function onDisconnect() {
            setIsConnected(false);
            console.log("🔴 [NEXUS_CORE]: Sinal Perdido.");
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        if (user) {
            if (!socket.connected) {
                console.log("📡 [NEXUS_CORE]: Operativo detectado. Iniciando conexão...");
                socket.connect();
            }
        } else {
            if (socket.connected) {
                console.log("🔌 [NEXUS_CORE]: Usuário deslogado. Cortando rádio...");
                socket.disconnect();
            }
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };

        // Adicionamos o 'user' como dependência. 
        // Agora, toda vez que alguém logar ou deslogar, esse efeito reavalia o rádio.
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};