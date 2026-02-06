import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap
} from 'lucide-react';
import { triggerHaptic } from '../../utils/triggerHaptic';

import { NOTIFICATION_VARIANTS } from '../../config/notification.config';

export const SystemNotification = ({
  isVisible,
  message = "Inconsistência de Dados detectada.",
  title = "",// Opcional: Sobrescreve o título padrão da variante
  type = "ERROR", // Padrão é erro para segurança
  onClose
}) => {
  // Seleciona a configuração baseada no tipo enviado
  const variant = NOTIFICATION_VARIANTS[type as keyof typeof NOTIFICATION_VARIANTS] || NOTIFICATION_VARIANTS.ERROR;
  const Icon = variant.icon;

  React.useEffect(() => {
    if (isVisible && onClose) {
      // Feedback tátil diferenciado por tipo
      triggerHaptic(type === 'ERROR' ? 'HEAVY' : 'MEDIUM');
      const timer = setTimeout(() => onClose(), 4500); // 4.5s para leitura confortável
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, type]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 60, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 20, opacity: 0, scale: 0.95 }}
          className="fixed bottom-12 left-4 right-4 md:left-auto md:right-8 md:w-105 z-500"
        >
          <div className="relative bg-white/80 backdrop-blur-3xl border-2 border-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]">

            {/* 1. DECORAÇÃO FANTASMA (Marca d'água técnica) */}
            <div className="absolute -right-6 -bottom-8 opacity-[0.03] rotate-[-15deg] pointer-events-none select-none z-0">
              <Zap size={140} strokeWidth={1} style={{ color: variant.color }} />
            </div>

            {/* 2. LIGHT LEAK (Glow de ambiência) */}
            <div
              className="absolute -top-16 -left-16 w-48 h-48 blur-[70px] opacity-20 rounded-full animate-pulse z-0"
              style={{ backgroundColor: variant.color }}
            />

            {/* 3. CONTEÚDO PRINCIPAL */}
            <div className="relative p-6 flex items-start gap-5 z-10 pb-9">
              {/* ACENTO LATERAL DE ALTO CONTRASTE */}
              <div
                className="absolute left-0 top-0 w-2 h-full"
                style={{
                  backgroundColor: variant.color,
                  boxShadow: `4px 0 20px ${variant.color}40`
                }}
              />

              {/* ICON CLUSTER */}
              <div className="relative shrink-0 w-14 h-14">
                <div
                  className="absolute inset-0 rounded-2xl opacity-15 animate-ping"
                  style={{ backgroundColor: variant.color }}
                />
                <div className="relative w-14 h-14 bg-white border border-slate-50 rounded-2xl flex items-center justify-center shadow-sm">
                  <Icon size={28} strokeWidth={2.5} style={{ color: variant.color }} />
                </div>
              </div>

              {/* ÁREA DE TEXTO */}
              <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] font-mono" style={{ color: variant.color }}>
                    {variant.label}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[6px] font-mono text-slate-400 font-black uppercase">
                    {variant.statusText}
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-[14px] font-black text-slate-900 uppercase tracking-tighter italic leading-tight truncate">
                    {title || (type === 'ERROR' ? 'Interrupção de Fluxo' : 'Ação Processada')}
                  </h5>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. BARRA DE TEMPO (Fibra Óptica) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100/50 z-20">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4.5, ease: "linear" }}
                className="h-full relative"
                style={{ backgroundColor: variant.color }}
              >
                <div className="absolute inset-0 bg-white/40 h-px" />
              </motion.div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};