import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Hooks e Contextos ---
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useNotification } from '../../hooks/useNotification';
import { api } from '../../api';
import { triggerHaptic } from '../../utils/triggerHaptic';
import { NexusContext } from './NexusContext';

// --- Sons de Telemetria ---
const impactSfx = new Audio('/sounds/impact.mp3');
const alertSfx = new Audio('/sounds/alert.mp3');

export const PulseOverlay = ({ effect }: { effect: { color: string, type: string } | null }) => (
    <AnimatePresence>
        {effect && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                style={{ backgroundColor: effect.color }}
                className="fixed inset-0 z-500 pointer-events-none flex items-center justify-center"
            >
                {effect.type === 'IMPACT' && (
                    <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ repeat: Infinity, duration: 0.05 }}
                        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
                    />
                )}
                <div className="absolute inset-0 border-20 border-white/20 blur-xl" />
            </motion.div>
        )}
    </AnimatePresence>
);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { socket, isConnected, emit } = useSocket();
    const { notifySuccess, notifyError } = useNotification();

    // 🛡️ TRAVAS DE IDENTIDADE: Rastreamos tanto o Socket quanto o CharId
    const lastEmittedSocket = useRef<string | null>(null);
    const lastEmittedCharId = useRef<string | null>(null);

    const [character, setCharacter] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pulseEffect, setPulseEffect] = useState<{ color: string; type: string } | null>(null);
    const [lastPulse, setLastPulse] = useState<any>(null);

    // --- 1. SINCRONIZAÇÃO DE DADOS ---
    const refreshCharacter = useCallback(async () => {
        if (!user || user.role === 'MASTER') {
            setIsLoading(false);
            return;
        }
        try {
            const response = await api.get("/characters/me");
            setCharacter(response.data);
        } catch (error: any) {
            console.error("❌ Nexus_Provider: Erro no Dossiê.", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => { refreshCharacter(); }, [refreshCharacter]);

    const handleInventorySave = useCallback(async (data: any, itemId?: string) => {
        if (!character?._id) return;
        setIsLoading(true);
        triggerHaptic('MEDIUM');

        try {
            if (itemId) {
                // EDITAR ITEM EXISTENTE
                await api.patch(`/characters/${character._id}/inventory/${itemId}`, data);
                notifySuccess("Sinal Recalibrado", `Item [${data.name}] atualizado.`);
            } else {
                // ADICIONAR NOVO ITEM
                await api.post(`/characters/${character._id}/inventory`, data);
                notifySuccess("Indexação Concluída", `[${data.name}] adicionado ao Vault.`);
            }
            await refreshCharacter(); // 🔄 Sincroniza a ficha após a mudança
        } catch (err) {
            notifyError("Falha na Sincronia", "Não foi possível persistir o item no Vault.");
        } finally {
            setIsLoading(false);
        }
    }, [character?._id, refreshCharacter, notifySuccess, notifyError]);

    const handleInventoryDelete = useCallback(async (itemId: string) => {
        if (!character?._id) return;
        triggerHaptic('HEAVY');

        try {
            await api.delete(`/characters/${character._id}/inventory/${itemId}`);
            notifySuccess("Purgação Concluída", "Item removido do manifesto.");
            await refreshCharacter();
        } catch (err) {
            notifyError("Erro de Purgação", "Falha ao remover item do sinal.");
        }
    }, [character?._id, refreshCharacter, notifySuccess, notifyError]);

    // --- 2. LÓGICA DE EVENTOS (SOCKET) ---
    useEffect(() => {
        if (!isConnected || !user?.id) {
            lastEmittedSocket.current = null;
            lastEmittedCharId.current = null;
            return;
        }

        // --- A. SINCRONIZAR SALA (Lógica Multi-Estágio) ---
        // Emitimos se o Socket mudou OU se o Character finalmente carregou
        const currentCharId = character?._id || null;

        if (socket.id !== lastEmittedSocket.current || currentCharId !== lastEmittedCharId.current) {
            emit("nexus:connect", {
                userId: user.id,
                charId: currentCharId,
                role: user.role,
                name: character?.identity?.name || user.name
            });

            lastEmittedSocket.current = socket.id || null;
            lastEmittedCharId.current = currentCharId;
            console.log(`📡 Nexus_Sync: Identidade enviada [${user.name}]`);
        }

        // --- B. LISTENERS ---
        const handleNexusAlert = (data: any) => {
            // Evita que o usuário veja a própria entrada, mas permite que o Mestre veja tudo
            const isMe = data.message.toLowerCase().includes(user.name.toLowerCase());
            if (isMe && user.role !== 'MASTER') return;

            if (data.type === 'ERROR') notifyError(data.title, data.message);
            else notifySuccess(data.title, data.message);
        };

        const handleStatusUpdate = (p: { charId: string, stat: string, newValue: number }) => {
            // Filtro de personagem (Sinal Cruzado)
            if (user.role !== 'MASTER' && p.charId !== character?._id) return;

            setCharacter((prev: any) => {
                if (!prev) return null;
                return { ...prev, stats: { ...prev.stats, [p.stat]: p.newValue } };
            });
            triggerHaptic(p.newValue < 20 ? "HEAVY" : "LIGHT");
        };

        const handlePulse = (payload: any) => {
            setLastPulse(payload);
            const config = {
                IMPACT: { color: 'rgba(244,63,94,0.4)', haptic: 'HEAVY', sfx: impactSfx },
                ALERT: { color: 'rgba(245,158,11,0.3)', haptic: 'MEDIUM', sfx: alertSfx }
            }[payload.type as 'IMPACT' | 'ALERT'];

            if (config) {
                triggerHaptic(config.haptic as any);
                config.sfx.currentTime = 0;
                config.sfx.play().catch(() => { });
                setPulseEffect({ color: config.color, type: payload.type });
                setTimeout(() => setPulseEffect(null), 500);
            }
        };

        socket.on("nexus:alert", handleNexusAlert);
        socket.on("status_update", handleStatusUpdate);
        socket.on("master:receive_pulse", handlePulse);

        return () => {
            socket.off("nexus:alert", handleNexusAlert);
            socket.off("status_update", handleStatusUpdate);
            socket.off("master:receive_pulse", handlePulse);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, user, character?._id, socket, notifySuccess, notifyError, emit]);

    // --- 3. INTERFACE DE DISPARO (AÇÕES) ---
    const syncAction = useCallback((type: string, details: any) => {
        emit("player:action", {
            charId: character?._id,
            userId: user?.id,
            type,
            details
        }, 'MEDIUM');
    }, [emit, character?._id, user?.id]);

    return (
        <NexusContext.Provider value={{
            character, isLoading, isConnected, lastPulse,
            refreshCharacter, syncAction, handleInventorySave, handleInventoryDelete
        }}>
            {children}
            <PulseOverlay effect={pulseEffect} />
        </NexusContext.Provider>
    );
};