import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { socket } from "../socket";
import { triggerHaptic } from "../utils/triggerHaptic";

export const useMasterNexus = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- 1. AUXILIAR DE ESTADO (Centraliza a atualização de um personagem) ---
  const updateCharState = useCallback(
    (charId: string, updateFn: (char: any) => any) => {
      setCharacters((prev) =>
        prev.map((c) => (c._id === charId ? updateFn(c) : c)),
      );
    },
    [],
  );

  // --- 2. COMANDOS DE VARREDURA (API) ---
  const fetchAllSinals = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);

      const { data } = await api.get("/characters");
      setCharacters(data);
    } catch (error) {
      console.error("❌ Master_Nexus: Falha na telemetria.", error);
      triggerHaptic("HEAVY");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // --- 3. INTERVENÇÕES DE COMANDO (Ações do Mestre) ---

  // Modulação de HP/SAN
  const modulate = useCallback(
    async (charId: string, stat: string, value: number) => {
      triggerHaptic("MEDIUM");

      // Atualização Otimista
      updateCharState(charId, (c) => {
        const max = stat === "hp" ? c.stats.maxHp : c.stats.maxSan;
        const nextValue = Math.min(
          Math.max((c.stats[stat] || 0) + value, 0),
          max,
        );
        return { ...c, stats: { ...c.stats, [stat]: nextValue } };
      });

      try {
        await api.patch(`/characters/${charId}/modulate`, { stat, value });
      } catch (error) {
        fetchAllSinals(true); // Reverte para o estado do banco se falhar
      }
    },
    [updateCharState, fetchAllSinals],
  );

  // Alteração de Status/Condição
  const changeStatus = useCallback(
    async (charId: string, statusId: string | null) => {
      triggerHaptic("LIGHT");

      updateCharState(charId, (c) => ({
        ...c,
        stats: { ...c.stats, status: statusId },
      }));

      try {
        await api.patch(`/characters/${charId}/status`, { statusId });
      } catch (error) {
        fetchAllSinals(true);
      }
    },
    [updateCharState, fetchAllSinals],
  );

  const sendPulse = useCallback((charId: string, type: "IMPACT" | "ALERT") => {
    triggerHaptic(type === "IMPACT" ? "HEAVY" : "MEDIUM");

    // Emite para o servidor que enviará para o jogador específico
    socket.emit("master:send_pulse", {
      charId,
      type, // IMPACT ou ALERT
      timestamp: new Date().toISOString(),
    });
  }, []);

  // --- 4. SINCRONIA DE RÁDIO (Sockets) ---
  useEffect(() => {
    fetchAllSinals();

    const handleStatus = (p: {
      charId: string;
      stat: string;
      newValue: number;
    }) => {
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
  }, [fetchAllSinals, updateCharState]);

  return {
    characters,
    isLoading,
    isRefreshing,
    refresh: () => fetchAllSinals(true),
    modulate,
    changeStatus,
    sendPulse,
  };
};
