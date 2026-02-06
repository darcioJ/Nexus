import React, { useState, useEffect, useCallback } from 'react';
import { vaultService, type VaultData } from '../../services/vaultService';
import { VaultContext } from './VaultContext';

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vault, setVault] = useState<VaultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Centralizamos a lógica de carga aqui
  const loadVault = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);

      const data = await vaultService.getSnapshot();
      setVault(data);
      setError(null);
    } catch (err: any) {
      // O erro já vem formatado pelo nosso interceptor da api.ts
      setError(err.message || 'Falha na varredura do Vault');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Sincronia inicial
  useEffect(() => {
    loadVault();
  }, [loadVault]);

  return (
    <VaultContext.Provider value={{
      vault,
      isLoading,
      isRefreshing,
      error,
      refreshVault: () => loadVault(true) // Refresh silencioso por padrão
    }}>
      {children}
    </VaultContext.Provider>
  );
};