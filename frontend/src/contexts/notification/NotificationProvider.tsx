import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion'; // 🟢 Importe aqui
import { NotificationContext, type NotificationOptions } from './NotificationContext';
import { SystemNotification } from '../../components/common/SystemNotification';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<NotificationOptions>({
    message: '',
    title: '',
    type: 'INFO'
  });

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

      {/* 📡 PORTAL DE TELEMETRIA */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <SystemNotification
              key="nexus-notification-portal" // 🟢 KEY É OBRIGATÓRIA para o AnimatePresence funcionar
              isVisible={isOpen}
              message={config.message}
              title={config.title}
              type={config.type}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </NotificationContext.Provider>
  );
};