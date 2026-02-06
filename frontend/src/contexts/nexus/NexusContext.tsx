// src/context/NexusContext.ts
import { createContext } from 'react';

export interface NexusContextData {
  character: any;
  isLoading: boolean;
  isConnected: boolean;
  lastPulse: any;
  refreshCharacter: () => Promise<void>;
  syncAction: (type: string, details: any) => void;
}

export const NexusContext = createContext<NexusContextData>({} as NexusContextData);