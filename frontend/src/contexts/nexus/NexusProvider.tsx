import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../../socket';
import { api } from '../../api';
import { triggerHaptic } from '../../utils/triggerHaptic';
import { useAuth } from '../../hooks/useAuth';
import { NexusContext } from './NexusContext';

import { motion, AnimatePresence } from 'framer-motion';

const impactSfx = new Audio('/sounds/impact.mp3');
const alertSfx = new Audio('/sounds/alert.mp3');

export const PulseOverlay = ({ effect }: { effect: { color: string, type: string } | null }) => {
    return (
        <AnimatePresence>
            {effect && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    style={{ backgroundColor: effect.color }}
                    className="fixed inset-0 z-500 pointer-events-none flex items-center justify-center"
                >
                    {/* Opcional: Efeito de Scanline ou Glitch durante o Impacto */}
                    {effect.type === 'IMPACT' && (
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 0.05 }}
                            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
                        />
                    )}

                    <div className="absolute inset-0 border-[20px] border-white/20 blur-xl" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [character, setCharacter] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [lastPulse, setLastPulse] = useState<any>(null);

    // Adicione este estado ao Provider
    const [pulseEffect, setPulseEffect] = useState<{ color: string; type: string } | null>(null);

    // --- 1. SINCRONIZAÇÃO DE DADOS ---
    const refreshCharacter = useCallback(async () => {
        const token = localStorage.getItem("@Nexus:Token");

        if (!token || !user) {
            setCharacter(null);
            setIsLoading(false);
            return;
        }

        // Se for Master, liberamos o loading mas não buscamos ficha
        if (user.role === 'MASTER') {
            setCharacter(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get("/characters/me");
            setCharacter(response.data);
        } catch (error: any) {
            console.error("❌ Nexus_Provider: Falha no Dossiê.", error);
            setCharacter(null);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => { refreshCharacter(); }, [refreshCharacter]);

    // --- 2. LINK EM TEMPO REAL (SOCKET) ---
    // Substitua o useEffect do Socket por este:
    useEffect(() => {
        if (!user?.id) return;

        // Conecta apenas se não estiver conectado
        if (!socket.connected) {
            socket.connect();
        }

        const onConnect = () => {
            setIsConnected(true);
            // Só sincronizamos a sala se o character já foi carregado ou se for Master
            if (character?._id || user.role === 'MASTER') {
                socket.emit("nexus:connect", {
                    userId: user.id,
                    charId: character?._id,
                    role: user.role,
                    name: character?.identity?.name || user.name
                });
            }
        };

        const onDisconnect = () => setIsConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        // Re-sincroniza a sala se o personagem carregar depois do socket
        if (socket.connected && character?._id) {
            socket.emit("nexus:connect", {
                userId: user.id,
                charId: character._id,
                role: user.role,
                name: character.identity?.name
            });
        }

        // 📡 EVENTO: STATUS VITAIS (HP/SAN/SOUL)
        socket.on("status_update", (payload: { stat: string, newValue: number }) => {
            setCharacter((prev: any) => {
                if (!prev) return null;

                // 🧠 A MUDANÇA ESTÁ AQUI: Precisamos entrar no sub-objeto 'stats'
                return {
                    ...prev,
                    stats: {
                        ...prev.stats,
                        [payload.stat]: payload.newValue
                    }
                };
            });

            // Feedback sensorial
            if (payload.newValue < 20) triggerHaptic("HEAVY");
            else triggerHaptic("LIGHT");
        });

        // 📡 EVENTO: CONDIÇÕES (Status Effects)
        socket.on("condition_update", (payload: string) => {
            console.log("💎 Nexus: Re-sincronizando condições...");

            setCharacter((prev: any) => {
                if (!prev) return null;
                return {
                    ...prev,
                    stats: {
                        ...prev.stats,
                        status: payload // Atualiza o ID do status dentro de stats
                    }
                };
            });

            refreshCharacter(); // Popula os detalhes via API
            triggerHaptic("MEDIUM");
        });

        // 📡 EVENTO: PULSO DO MESTRE (Recalibrado)
        socket.on("master:receive_pulse", (payload) => {
            const effectConfig = {
                IMPACT: {
                    color: 'rgba(244, 63, 94, 0.4)',
                    haptic: 'HEAVY',
                    sfx: impactSfx
                },
                ALERT: {
                    color: 'rgba(245, 158, 11, 0.3)',
                    haptic: 'MEDIUM',
                    sfx: alertSfx
                }
            };

            const config = effectConfig[payload.type as keyof typeof effectConfig];

            if (config) {
                // 1. Hardware Feedback
                triggerHaptic(config.haptic as any);

                // 2. Audio Feedback (Resetamos o tempo para permitir sons repetidos rápidos)
                config.sfx.currentTime = 0;
                config.sfx.play().catch(e => console.warn("Audio_Autoplay_Blocked: O sinal precisa de interação prévia."));

                // 3. Visual Feedback
                setPulseEffect({ color: config.color, type: payload.type });
                setTimeout(() => setPulseEffect(null), 500);
            }
        });

        // Dentro do useEffect do Socket no NexusProvider.tsx
        socket.on("connect_error", (err) => {
            console.error("❌ ERRO CRÍTICO DE CONEXÃO:", err.message);
            // Se aparecer "xhr poll error", é rede/Firewall.
            // Se aparecer "websocket error", seu roteador/PC bloqueia WebSockets.
        });

        socket.on("connect", () => {
            console.log("🟢 CONECTADO AO CORE!");
            setIsConnected(true);
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("status_update");
            socket.off("condition_update");
            socket.off("player:receive_pulse");
            // NÃO dê socket.disconnect() aqui se você quiser manter o link estável no mobile
        };
    }, [user?.id, character?._id]); // Removi o refreshCharacter daqui para evitar loops

    // --- 3. INTERFACE DE DISPARO (AÇÕES) ---
    const syncAction = useCallback((type: string, details: any) => {
        if (isConnected) {
            socket.emit("player:action", {
                charId: character?._id,
                userId: user?.id,
                type,
                details
            });
        }
    }, [isConnected, character?._id, user?.id]);

    return (
        <NexusContext.Provider value={{
            character,
            isLoading,
            isConnected,
            lastPulse,
            refreshCharacter,
            syncAction
        }}>
            {children}
            <PulseOverlay effect={pulseEffect} />
        </NexusContext.Provider>
    );
};