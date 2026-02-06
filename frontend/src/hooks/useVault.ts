import { useContext } from 'react';
import { VaultContext } from '../contexts/vault/VaultContext'; // Ajuste o caminho se necessário

export const useVault = () => {
  const context = useContext(VaultContext);
  
  if (!context) {
    throw new Error("useVault deve ser consumido dentro de um VaultProvider");
  }

  // Garantimos que, se o vault for null, retornamos arrays vazios para não quebrar o destructuring
  const vault = context.vault;

  return {
    // Espalhamos os dados do vault com fallback para evitar erros de undefined
    weapons: vault?.weapons || [],
    clubs: vault?.clubs || [],
    statusEffects: vault?.statusEffects || [],
    archetypes: vault?.archetypes || [],
    attributes: vault?.attributes || [],
    essences: vault?.essences || [],
    
    // Metadados do Contexto
    vault: context.vault,
    isLoading: context.isLoading,
    isRefreshing: context.isRefreshing, 
    error: context.error,
    refreshVault: context.refreshVault
  };
};