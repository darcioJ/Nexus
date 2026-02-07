import React, { useState, useCallback } from 'react';
import { ConfirmContext, type ConfirmOptions } from './ConfirmContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfirmOptions | null>(null);
  
  // Usamos um objeto para evitar que o React execute a função de resolve no set
  const [promise, setPromise] = useState<{ resolve: (v: boolean) => void } | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    // Se já houver um modal aberto, ignoramos ou rejeitamos a anterior (Segurança Nexus)
    setConfig(options);

    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (promise) {
      promise.resolve(false); // Libera o await com 'false'
    }
    setConfig(null);
    setPromise(null);
  }, [promise]);

  const handleConfirm = useCallback(() => {
    if (promise) {
      promise.resolve(true); // Libera o await com 'true'
    }
    setConfig(null);
    setPromise(null);
  }, [promise]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {/* Renderização condicional baseada na existência da config */}
      {config && (
        <ConfirmModal
          isOpen={!!config}
          type={config.type}
          title={config.title}
          description={config.description}
          confirmLabel={config.confirmLabel}
          cancelLabel={config.cancelLabel}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      )}
    </ConfirmContext.Provider>
  );
};