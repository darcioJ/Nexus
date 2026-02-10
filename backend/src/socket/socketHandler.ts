// src/socket/socketHandler.ts
export const setupSocket = (io) => {
  const activePlayers = new Map();

  io.on("connection", (socket) => {
    console.log(`📡 Sinal detectado: ${socket.id}`);

    socket.on("nexus:connect", (characterData) => {
      const { charId, name, role } = characterData;

      // 1. ORGANIZAÇÃO DE SALAS
      socket.join("nexus_table"); // Todos os ativos entram na rede geral

      if (charId) {
        socket.join(charId); // Operativos entram em suas frequências privadas
      }

      // 2. REGISTRO DE TELEMETRIA
      activePlayers.set(socket.id, {
        ...characterData,
        lastSync: new Date(),
      });

      // 3. DISPARO DE ALERTA (Apenas para Operativos, para não floodar o Mestre)
      if (role !== "MASTER") {
        socket.to("nexus_table").emit("nexus:alert", {
          title: "Sinal Sincronizado",
          message: `${name.toUpperCase()} estabeleceu conexão com o Nexus.`,
          type: "SUCCESS",
        });
        console.log(`👤 Operativo Conectado: ${name} [Sala: ${charId}]`);
      } else {
        console.log(`👁️  Mestre assumiu o controle do Core.`);
      }

      // 4. ATUALIZAÇÃO DA LISTA GLOBAL
      io.to("nexus_table").emit(
        "nexus:player_list",
        Array.from(activePlayers.values()),
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
      const player = activePlayers.get(socket.id);

      if (player) {
        // Alerta de sinal perdido (Apenas se não for o Mestre saindo)
        if (player.role !== "MASTER") {
          socket.to("nexus_table").emit("nexus:alert", {
            title: "Sinal Perdido",
            message: `${player.name.toUpperCase() || "Desconhecido"} se desconectou do Nexus.`,
            type: "ERROR",
          });
        }
        console.log(`❌ Sinal perdido: ${player.name} [${socket.id}]`);
      }

      activePlayers.delete(socket.id);
      
      io.to("nexus_table").emit(
        "nexus:player_list",
        Array.from(activePlayers.values()),
      );
    });
  });
};
