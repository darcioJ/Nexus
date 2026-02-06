// frontend/src/core/socket.ts
import { io } from "socket.io-client";

// No presencial, substitua pelo IP do seu PC na rede local
const SOCKET_URL = `http://192.168.0.12:3001`;

console.log(SOCKET_URL)

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 10,
  transports: ["websocket"], // ⚡️ CRÍTICO: Força o túnel direto
  upgrade: false, // Evita a tentativa de polling
});
