import { createContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CharacterData } from '../models/character';

interface ForgerContextData {
  methods: UseFormReturn<CharacterData>;
  step: number;
  hasError: boolean;
  canProceed: boolean;
  isLastStep: boolean;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  setStep: (step: number) => void;
}

export const ForgerContext = createContext<ForgerContextData>({} as ForgerContextData);