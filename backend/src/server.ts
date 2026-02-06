import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectVault } from "./lib/mongodb.js";
import { setupSocket } from "./socket/socketHandler.js";

// Import de Rotas
import authRoutes from "./routes/authRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import forgeRoutes from "./routes/forgeRoutes.js";

import archetypeRoutes from "./routes/archetypeRoutes.js";
import attributeRoutes from "./routes/attributeRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import essenceRoutes from "./routes/essenceRoutes.js";
import statusEffectRoutes from "./routes/statusEffectRoutes.js";
import weaponRoutes from "./routes/weaponRoutes.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true, // Adicione isso para garantir a passagem de headers
  },
  allowEIO3: true, // Compatibilidade com versões anteriores se necessário
  transports: ["websocket", "polling"], // Permita ambos no servidor por segurança
});

// Middleware Global
app.use(cors());
app.use(express.json());
app.set("socketio", io); // Disponibiliza o IO para os controllers

// Conexões
connectVault();
setupSocket(io);

// Orquestração de Rotas
app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/users", userRoutes);

app.use("/api/forge", forgeRoutes);

app.use("/api/archetypes", archetypeRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/essences", essenceRoutes);
app.use("/api/status-effects", statusEffectRoutes);
app.use("/api/weapons", weaponRoutes);

// Boot
const PORT = 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 PRISMA NEXUS: Transmitindo sinal na porta ${PORT}`);
});
