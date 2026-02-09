// useForger.ts (simplificado)
import { useContext } from 'react';
import { ForgerContext } from '../contexts/forger/ForgerContext';

export const useForger = () => useContext(ForgerContext);