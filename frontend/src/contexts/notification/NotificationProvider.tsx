import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { NotificationContext, type NotificationOptions } from './NotificationContext';
import { SystemNotification } from '../../components/common/SystemNotification';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<NotificationOptions>({
    message: '',
    title: '',
    type: 'INFO'
  });

  // Função memorizada para evitar re-renderizações de quem consome o hook
  const notify = useCallback((options: NotificationOptions) => {
    setConfig({
      message: options.message,
      title: options.title || '',
      type: options.type || 'INFO'
    });
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {/* PORTAL DE SEGURANÇA: Injeta a UI no topo do DOM */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <SystemNotification
          isVisible={isOpen}
          message={config.message}
          title={config.title}
          type={config.type}
          onClose={handleClose}
        />,
        document.body
      )}
    </NotificationContext.Provider>
  );
};