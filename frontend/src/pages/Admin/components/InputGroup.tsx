import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface InputGroupProps {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  error?: { message?: string } | string | boolean;
  className?: string;
}

export const InputGroup = ({ label, children, icon, error, className = "" }: InputGroupProps) => {
  const errorMessage = typeof error === 'object' ? error.message : typeof error === 'string' ? error : null;
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-2 group w-full relative ${className}`}>
      
      {/* HEADER: Bio-Monitor & Label */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          {/* Ícone do Grupo (Opcional) */}
          {icon && (
            <div className={`transition-colors duration-500 ${hasError ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-emerald-500'}`}>
              {React.cloneElement(icon as React.ReactElement, { size: 12, strokeWidth: 2.5 })}
            </div>
          )}
          
          <label className={`
            text-[11px] font-bold tracking-tight transition-all duration-300
            ${hasError ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-slate-900'}
          `}>
            {label}
          </label>
        </div>

        {/* LED DE SINCRONIA (PULSE) */}
        <div className="relative w-2 h-2">
          <div className={`
            absolute inset-0 rounded-full transition-all duration-500 blur-[2px]
            ${hasError ? 'bg-rose-500 animate-pulse' : 'bg-slate-200 group-focus-within:bg-emerald-400'}
          `} />
          <div className={`
            relative w-full h-full rounded-full border border-white shadow-sm transition-colors duration-500
            ${hasError ? 'bg-rose-500' : 'bg-slate-100 group-focus-within:bg-emerald-500'}
          `} />
        </div>
      </div>

      {/* CHASSIS DO INPUT (SLOT CERÂMICO) */}
      <div className="relative">
        <div className={`
          relative rounded-[1.5rem] transition-all duration-500
        `}>
          {/* Refração de Erro (Bloom Lateral) */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute -inset-2 bg-rose-500/5 blur-xl rounded-[2rem] pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Renderização do Input (Children) */}
          <div className="relative z-10">
            {children}
          </div>
        </div>

        {/* MENSAGEM DE ERRO: FEEDBACK NEURAL */}
        <div className="h-4 mt-1 px-4"> 
          <AnimatePresence mode="wait">
            {hasError && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="flex items-center gap-1.5 text-rose-500"
              >
                <AlertTriangle size={10} strokeWidth={3} />
                <span className="text-[9px] font-black uppercase tracking-widest italic">
                  {errorMessage || "Inconsistência de sinal"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DETALHE TÉCNICO: DECORAÇÃO DE HARDWARE */}
      <div className="absolute -left-1 top-8 bottom-8 w-[1px] bg-linear-to-b from-transparent via-slate-100 to-transparent transition-all duration-700" />
    </div>
  );
};