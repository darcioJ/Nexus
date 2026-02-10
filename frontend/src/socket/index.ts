// frontend/src/core/socket.ts
import { io } from "socket.io-client";
import { BASE_URL } from "../config/api.config"; // Mesma fonte de verdade

export const socket = io(BASE_URL, {
  autoConnect: false,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  upgrade: false,
});
