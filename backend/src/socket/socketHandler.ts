// src/socket/socketHandler.ts
export const setupSocket = (io) => {
  const activePlayers = new Map();

  io.on("connection", (socket) => {
    console.log(`📡 Sinal detectado: ${socket.id}`);

    socket.on("nexus:connect", (characterData) => {
      const { charId, name } = characterData;

      socket.join(charId); // CRÍTICO: Permite que io.to(charId) funcione
      socket.join("nexus_table"); // Sala geral para o mestre

      activePlayers.set(socket.id, {
        ...characterData,
        charId,
        lastSync: new Date(),
      });

      io.to("nexus_table").emit(
        "nexus:player_list",
        Array.from(activePlayers.values()),
      );
      console.log(`👤 Sinal Sincronizado: ${name} na sala [${charId}]`);
    });

    socket.on("nexus:join", (characterData) => {
      activePlayers.set(socket.id, { ...characterData, lastSync: new Date() });
      socket.join("nexus_table");

      io.to("nexus_table").emit(
        "nexus:player_list",
        Array.from(activePlayers.values()),
      );
      console.log(
        `👤 Sincronizado: ${characterData.identity?.name || "Desconhecido"}`,
      );
    });

    socket.on("master:apply_effect", async (payload) => {
      const target =
        payload.targetId === "ALL" ? "nexus_table" : payload.targetId;
      io.to(target).emit("player:receive_effect", payload);
      console.log(`⚡ Pulso de efeito: ${payload.type} -> ${payload.value}`);
    });

    // 📡 PULSO DE COMANDO: IMPACTO E ALERTA
    socket.on("master:send_pulse", (payload) => {
      const { charId, type } = payload;

      // Se o mestre enviar para "ALL", mandamos para a mesa toda,
      // caso contrário, apenas para a sala (room) do personagem específico.
      const target = charId === "ALL" ? "nexus_table" : charId;

      // Emitimos o evento que o celular do jogador está ouvindo
      io.to(target).emit("master:receive_pulse", {
        type, // 'IMPACT' ou 'ALERT'
        origin: "MASTER_OVERRIDE",
        timestamp: new Date(),
      });

      console.log(`⚡ [PULSO]: ${type} disparado para ${target}`);
    });

    socket.on("disconnect", () => {
      activePlayers.delete(socket.id);
      io.to("nexus_table").emit(
        "nexus:player_list",
        Array.from(activePlayers.values()),
      );
      console.log(`❌ Sinal perdido: ${socket.id}`);
    });
  });
};
