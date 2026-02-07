import { createContext } from 'react';
import { type ModalType } from '../../config/confirm.config';

export interface ConfirmOptions {
  title: string;
  description: string;
  type?: ModalType;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);