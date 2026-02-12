import { useContext } from "react";
import { ArchiveContext } from "../contexts/archive/ArchiveContext";

/**
 * Hook para acessar o Códice do Nexus.
 * Permite leitura e manipulação de arquivos de Lore e Regras.
 */
export function useArchive() {
  const context = useContext(ArchiveContext);

  if (!context) {
    throw new Error("useArchive deve ser utilizado dentro de um ArchiveProvider");
  }

  return context;
}