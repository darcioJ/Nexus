import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { triggerHaptic } from "../utils/triggerHaptic";
import { API_URL } from "../config/api.config"; // Importando a detecção dinâmica

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Evita requisições "eternas" que travam a UI
});

// 2. INTERCEPTOR DE REQUISIÇÃO (Dossiê de Autenticação)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("@Nexus:Token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. INTERCEPTOR DE RESPOSTA (Tratamento de Crise)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const message =
      (error.response?.data as any)?.message || "Erro de conexão com o Core";

    // Trata erros específicos de forma global
    switch (status) {
      case 401: // Não autorizado: Token expirou ou é inválido
        console.error("🚨 SINAL CORROMPIDO: Sessão expirada.");
        localStorage.removeItem("@Nexus:Token");
        localStorage.removeItem("@Nexus:User");

        window.location.href = "/auth";
        break;

      case 403: // Proibido: Usuário não tem permissão (ex: Player tentando rota de Master)
        triggerHaptic("HEAVY");
        console.warn("⚠️ ACESSO NEGADO: Nível de autorização insuficiente.");
        break;

      case 500: // Erro no Servidor
        console.error("🔥 EXPLOSÃO NO CORE: Erro interno do servidor.");
        break;

      default:
        console.error(`❌ NEXUS_ERROR [${status}]: ${message}`);
    }

    return Promise.reject({
      status,
      message,
      originalError: error,
    });
  },
);
