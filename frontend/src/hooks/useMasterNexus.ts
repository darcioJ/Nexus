import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useSocket } from "./useSocket"; // O rádio unificado
import { useNotification } from "./useNotification";
import { triggerHaptic } from "../utils/triggerHaptic";

export const useMasterNexus = () => {
  const { socket, isConnected, emit } = useSocket();
  const { notifyError } = useNotification();
  
  const [characters, setCharacters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- 1. AUXILIAR DE ESTADO ---
  const updateCharState = useCallback((charId: string, updateFn: (char: any) => any) => {
    setCharacters((prev) => prev.map((c) => (c._id === charId ? updateFn(c) : c)));
  }, []);

  // --- 2. COMANDOS DE VARREDURA (API) ---
  const fetchAllSinals = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);

      const { data } = await api.get("/characters");
      setCharacters(data);
    } catch (error) {
      console.error("❌ Master_Nexus: Falha na telemetria.", error);
      notifyError(error, "Falha na Varredura");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [notifyError]);

  // --- 3. INTERVENÇÕES DE COMANDO ---

  // Modulação de HP/SAN (Otimista + Patch)
  const modulate = useCallback(async (charId: string, stat: string, value: number) => {
    triggerHaptic("MEDIUM");

    updateCharState(charId, (c) => {
      const max = stat === "hp" ? c.stats.maxHp : c.stats.maxSan;
      const nextValue = Math.min(Math.max((c.stats[stat] || 0) + value, 0), max);
      return { ...c, stats: { ...c.stats, [stat]: nextValue } };
    });

    try {
      await api.patch(`/characters/${charId}/modulate`, { stat, value });
    } catch (error) {
      fetchAllSinals(true); // Reverte se falhar
    }
  }, [updateCharState, fetchAllSinals]);

  // Alteração de Status
  const changeStatus = useCallback(async (charId: string, statusId: string | null) => {
    triggerHaptic("LIGHT");
    updateCharState(charId, (c) => ({ ...c, stats: { ...c.stats, status: statusId } }));

    try {
      await api.patch(`/characters/${charId}/status`, { statusId });
    } catch (error) {
      fetchAllSinals(true);
    }
  }, [updateCharState, fetchAllSinals]);

  // Disparo de Pulso Tático
  const sendPulse = useCallback((charId: string, type: "IMPACT" | "ALERT") => {
    // Usando o emit do hook que já gerencia o haptic!
    emit("master:send_pulse", {
      charId,
      type,
      timestamp: new Date().toISOString(),
    }, type === "IMPACT" ? "HEAVY" : "MEDIUM");
  }, [emit]);

  // --- 4. SINCRONIA DE RÁDIO (Socket Listeners) ---
  useEffect(() => {
    if (!isConnected) return;

    fetchAllSinals();

    const handleStatus = (p: { charId: string; stat: string; newValue: number }) => {
      updateCharState(p.charId, (c) => ({
        ...c,
        stats: { ...c.stats, [p.stat]: p.newValue },
      }));
    };

    const handleCondition = (p: { charId: string; statusId: string }) => {
      updateCharState(p.charId, (c) => ({
        ...c,
        stats: { ...c.stats, status: p.statusId },
      }));
    };

    socket.on("status_update", handleStatus);
    socket.on("condition_update", handleCondition);

    return () => {
      socket.off("status_update", handleStatus);
      socket.off("condition_update", handleCondition);
    };
  }, [isConnected, fetchAllSinals, updateCharState, socket]);

  return {
    characters,
    isLoading,
    isRefreshing,
    isConnected, // Adicionado para o mestre saber se o rádio está on
    refresh: () => fetchAllSinals(true),
    modulate,
    changeStatus,
    sendPulse,
  };
};