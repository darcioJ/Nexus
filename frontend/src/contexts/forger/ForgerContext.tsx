import { createContext } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type CharacterData } from '../../models/character';

interface ForgerContextData {
  methods: UseFormReturn<CharacterData>;
  step: number;
  hasError: boolean;
  setHasError: (val: boolean) => void; // Adicione esta linha
  canProceed: boolean;
  isLastStep: boolean;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  setStep: (step: number) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCropperOpen: boolean;
  tempImageSrc: string | null;
  closeCropper: () => void;
  processCroppedImage: (base64: string) => void;
}

export const ForgerContext = createContext<ForgerContextData>({} as ForgerContextData);