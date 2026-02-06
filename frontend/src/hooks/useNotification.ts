import { useContext } from 'react';
import { NotificationContext } from '../contexts/notification/NotificationContext';
import { triggerHaptic } from '../utils/triggerHaptic';

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }

  // Criamos um helper interno que utiliza o notify do contexto
  const notifyError = (error: any, customTitle?: string) => {
    // Lógica centralizada de captura de erro do seu Backend
    const message = error.response?.data?.message || "Falha na comunicação com o Core.";
    
    context.notify({
      title: customTitle || "Erro de Protocolo",
      message: message,
      type: 'ERROR'
    });

    triggerHaptic('HEAVY');
  };

  return { 
    ...context, // Retorna o 'notify' original
    notifyError // Retorna o novo facilitador
  };
};