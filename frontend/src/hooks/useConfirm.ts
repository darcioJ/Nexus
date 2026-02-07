import { useContext, useCallback } from 'react';
import { ConfirmContext, type ConfirmOptions } from '../contexts/confirm/ConfirmContext';
import { triggerHaptic } from '../utils/triggerHaptic';

export const useConfirm = () => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm deve ser usado dentro de um ConfirmProvider');
  }

  // 1. CONFIRMAÇÃO DE RISCO (Deleções, Expurgos)
  const confirmDanger = useCallback(
    (title: string, description: string, confirmLabel = "Confirmar_Expurgo") => {
      triggerHaptic('MEDIUM'); // Feedback ao abrir o modal
      return context.confirm({
        title,
        description,
        type: 'danger',
        confirmLabel,
        cancelLabel: "Abortar"
      });
    },
    [context]
  );

  // 2. CONFIRMAÇÃO DE ALERTA (Mudanças importantes, sobrescritas)
  const confirmWarning = useCallback(
    (title: string, description: string, confirmLabel = "Prosseguir") => {
      triggerHaptic('LIGHT');
      return context.confirm({
        title,
        description,
        type: 'warning',
        confirmLabel,
        cancelLabel: "Voltar"
      });
    },
    [context]
  );

  // 3. CONFIRMAÇÃO INFORMATIVA (Ações de rotina)
  const confirmInfo = useCallback(
    (title: string, description: string, confirmLabel = "Ok") => {
      return context.confirm({
        title,
        description,
        type: 'info',
        confirmLabel,
        cancelLabel: "Fechar"
      });
    },
    [context]
  );

  return {
    confirm: context.confirm, // Mantém o acesso ao método original (flexível)
    confirmDanger,
    confirmWarning,
    confirmInfo
  };
};