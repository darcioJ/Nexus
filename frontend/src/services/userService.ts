import { api } from "../api"; // Sua instância central do Axios

/**
 * Interface de Resposta do Bio-Monitor
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "MASTER" | "PLAYER";
  createdAt: string;
}

interface UsersResponse {
  users: IUser[];
  count: number;
  timestamp: string;
}

export const userService = {
  /**
   * 📡 VARREDURA GERAL:
   * Recupera todos os sinais vitais registrados no Core.
   */
  getUsers: async (): Promise<UsersResponse> => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("❌ Nexus_Error [getUsers]: Falha na varredura de sinais.");
      throw error;
    }
  },

  /**
   * 🔄 RECONFIGURAÇÃO DE MATRIZ:
   * Altera permissões (role) ou dados cadastrais de um usuário.
   */
  updateUser: async (id: string, data: Partial<IUser>): Promise<IUser> => {
    try {
      const response = await api.patch(`/users/${id}`, data);
      return response.data.user;
    } catch (error) {
      console.error(
        `❌ Nexus_Error [updateUser]: Erro ao reconfigurar sinal ${id}.`,
      );
      throw error;
    }
  },

  /**
   * 🗑️ PURGAÇÃO DE REGISTRO:
   * Remove permanentemente um usuário e sua conta do sistema.
   * Cuidado: No backend, isso deve disparar a purgação em cascata da ficha.
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(
        `❌ Nexus_Error [deleteUser]: Falha na purgação do sinal ${id}.`,
      );
      throw error;
    }
  },
};
