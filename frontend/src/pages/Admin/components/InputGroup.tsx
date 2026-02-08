import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface InputGroupProps {
  label: string;
  children: React.ReactNode;
  error?: { message?: string } | string | boolean;
  className?: string;
}

export const InputGroup = ({ label, children, error, className = "" }: InputGroupProps) => {
  // Normaliza o erro para pegar a mensagem se for um objeto do react-hook-form
  const errorMessage = typeof error === 'object' ? error.message : typeof error === 'string' ? error : null;
  const hasError = Boolean(error);

  return (
    <div className={`space-y-1.5 flex flex-col group w-full ${className}`}>
      {/* HEADER: Label com transição de cor e tracking bio-monitor */}
      <div className="flex justify-between items-center px-2">
        <label className={`
          text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300
          ${hasError ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-indigo-500'}
        `}>
          {label}
        </label>

        {/* INDICADOR DE STATUS (Opcional) */}
        <div className={`w-1 h-1 rounded-full transition-all duration-500 ${hasError ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-slate-200 group-focus-within:bg-indigo-500'
          }`} />
      </div>

      <div className="relative">
        {/* SLOT DE INPUT: O container do children agora reage ao estado */}
        <div className={`
          relative transition-all duration-300
          ${hasError ? 'ring-1 ring-rose-500/50' : 'group-focus-within:translate-x-1'}
        `}>
          {children}
        </div>

        {/* MENSAGEM DE ERRO: Dinâmica e animada */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute -bottom-4 left-2 flex items-center gap-1 text-rose-500"
            >
              <AlertCircle size={8} />
              <span className="text-[7px] font-black uppercase tracking-wider">
                {errorMessage || "Campo Obrigatório"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};