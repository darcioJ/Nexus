// useForger.ts (simplificado)
import { useContext } from 'react';
import { ForgerContext } from '../contexts/ForgerContext';

export const useForger = () => useContext(ForgerContext);