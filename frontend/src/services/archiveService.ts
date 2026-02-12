import { api } from "../api"; // Sua instância configurada do Axios

/**
 * CATEGORIAS DO CÓDICE
 * Define o tipo de processamento e filtragem na Nexuspédia.
 */
export type ArchiveCategory = "LORE" | "REGRAS" | "LOGS" | "SISTEMA";

/**
 * INTERFACE DE REGISTRO DO CÓDICE
 * Representa um documento oficial de lore ou mecânica no Nexus.
 */
export interface IArchive {
  _id: string; // ID gerado pelo MongoDB
  title: string; // Título do registro
  category: ArchiveCategory; // Classificação sistêmica
  previewText: string; // Resumo para o card
  content: string; // Conteúdo completo (Suporta Markdown)
  tags: string[]; // Indexadores de busca
  author: string; // Criador do log (ex: Mestre_Nexus)
  isPublished: boolean; // Status de visibilidade para players
  createdAt: string; // Data de injeção no sistema
  updatedAt: string; // Última re-calibragem de dados
}

/**
 * DTO para criação/atualização
 * Usado para payloads de POST e PUT.
 */
export type ArchivePayload = Partial<
  Omit<IArchive, "_id" | "createdAt" | "updatedAt">
>;

/**
 * SERVIÇO DE COMUNICAÇÃO: CÓDICE DE ARQUIVOS
 * Responsável pela indexação, recuperação e purga de registros.
 */
export const archiveService = {
  /**
   * Recupera todos os logs do Códice.
   * Se logado como Mestre, o sinal traz rascunhos.
   */
  async getAll(): Promise<IArchive[]> {
    const { data } = await api.get<IArchive[]>("/archives");
    return data;
  },

  /**
   * Captura um registro específico por ID.
   */
  async getById(id: string): Promise<IArchive> {
    const { data } = await api.get<IArchive>(`/archives/${id}`);
    return data;
  },

  /**
   * Injeta um novo log no banco de dados (Exclusivo Mestre).
   */
  async create(payload: Partial<IArchive>): Promise<IArchive> {
    const { data } = await api.post<IArchive>("/archives", payload);
    return data;
  },

  /**
   * Re-calibra os dados de um registro existente (Exclusivo Mestre).
   */
  async update(id: string, payload: Partial<IArchive>): Promise<IArchive> {
    const { data } = await api.put<IArchive>(`/archives/${id}`, payload);
    return data;
  },

  /**
   * Incinera um registro permanentemente (Exclusivo Mestre).
   */
  async delete(id: string): Promise<{ message: string }> {
    const { data } = await api.delete(`/archives/${id}`);
    return data;
  },
};
