import React, { useState, useCallback } from "react";
import { ArchiveContext } from "./ArchiveContext";
import { archiveService, type IArchive, type ArchivePayload } from "../../services/archiveService";

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [archives, setArchives] = useState<IArchive[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await archiveService.getAll();
      setArchives(data);
    } catch (err) {
      setError("Falha na sincronia com o Códice.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = async (id: string) => {
    try {
      return await archiveService.getById(id);
    } catch (err) {
      setError("Erro ao descriptografar log específico.");
    }
  };

  const addArchive = async (payload: ArchivePayload) => {
    try {
      const newItem = await archiveService.create(payload);
      setArchives((prev) => [newItem, ...prev]);
    } catch (err) {
      setError("Falha ao injetar novo registro.");
      throw err;
    }
  };

  const editArchive = async (id: string, payload: ArchivePayload) => {
    try {
      const updated = await archiveService.update(id, payload);
      setArchives((prev) => prev.map((item) => (item._id === id ? updated : item)));
    } catch (err) {
      setError("Erro na re-calibragem dos dados.");
      throw err;
    }
  };

  const removeArchive = async (id: string) => {
    try {
      await archiveService.delete(id);
      setArchives((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError("Protocolo de incineração falhou.");
      throw err;
    }
  };

  return (
    <ArchiveContext.Provider
      value={{
        archives,
        loading,
        error,
        fetchAll,
        fetchById,
        addArchive,
        editArchive,
        removeArchive,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};