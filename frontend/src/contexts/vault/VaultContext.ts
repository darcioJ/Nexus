import { createContext } from 'react';
import { type VaultData } from '../../services/vaultService';

export interface VaultContextData {
  vault: VaultData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshVault: () => Promise<void>;
}

export const VaultContext = createContext<VaultContextData>({} as VaultContextData);