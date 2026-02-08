import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Terminal, Activity, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/triggerHaptic';
import { NOTIFICATION_VARIANTS } from '../../config/notification.config';

// --- FÍSICA DE MOVIMENTO RECALIBRADA ---
const containerVariants: Variants = {
  hidden: {
    y: -80, // Começa acima (Top-Center)
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
      mass: 0.8,
    }
  },
  exit: {
    y: -20,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: "circIn" }
  }
};

// Ajuste para mobile (vem de baixo para cima)
const mobileVariants: Variants = {
  hidden: { y: 80, opacity: 0, scale: 0.92 },
  visible: { y: 0, opacity: 1, scale: 1 },
  exit: { y: 50, opacity: 0, scale: 0.95 }
};

export const SystemNotification = ({
  isVisible,
  message = "Inconsistência de Dados detectada.",
  title = "",
  type = "ERROR",
  onClose
}: {
  isVisible: boolean;
  message?: string;
  title?: string;
  type?: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  onClose?: () => void;
}) => {
  const variant = NOTIFICATION_VARIANTS[type as keyof typeof NOTIFICATION_VARIANTS] ?? NOTIFICATION_VARIANTS.ERROR;
  const Icon = variant.icon;
  const isMobile = window.innerWidth < 768;

  React.useEffect(() => {
    if (isVisible && onClose) {
      if (type === 'ERROR') triggerHaptic('HEAVY');
      else if (type === 'SUCCESS') triggerHaptic('SUCCESS');
      else triggerHaptic('MEDIUM');

      const timer = setTimeout(() => onClose(), 4500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, type]);

  // Gradiente Prismatico Refinado
  const prismaticGradient = `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, ${variant.color}20 25%, rgba(255,255,255,0) 50%, ${variant.color}30 75%, rgba(255,255,255,0.7) 100%)`;

  return (
    <motion.div
      variants={isMobile ? mobileVariants : containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`
        fixed z-999 pointer-events-auto flex justify-center
        ${isMobile ? 'bottom-8 inset-x-4' : 'top-8 left-0 right-0'}
      `}
    >
      <div className="relative w-full max-w-md group">

        {/* --- AURA DE ENERGIA (GLOW) --- */}
        <div
          className="absolute -inset-4 opacity-15 blur-3xl transition-opacity duration-700 group-hover:opacity-25"
          style={{ backgroundColor: variant.color }}
        />

        {/* --- CORPO PRINCIPAL (CERÂMICA TÉCNICA) --- */}
        <div className="relative overflow-hidden rounded-[2.2rem] bg-stone-50/95 backdrop-blur-2xl border border-white/80 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.5)]">

          {/* TEXTURA DE RUÍDO & PRISMA */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
          <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ background: prismaticGradient }} />

          {/* ESPECULAR DE BORDA (Luz batendo na quina) */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/100 to-transparent z-20" />
          <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />

          <div className="relative p-5 flex items-center gap-5 z-10">

            {/* --- ICON CLUSTER (AZULEJO DE CRISTAL) --- */}
            <div className="relative shrink-0">
              {/* Brilho de pulso atrás do ícone */}
              <div
                className="absolute inset-0 rounded-2xl animate-pulse opacity-20 blur-md"
                style={{ backgroundColor: variant.color }}
              />

              <div className="relative w-16 h-16 rounded-[1.4rem] flex items-center justify-center 
                              bg-gradient-to-br from-white via-stone-100 to-stone-200 
                              border-[1.5px] border-white shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,1)]
                              overflow-hidden">

                {/* Micro-grid decorativo interno */}
                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[4px_4px]" />

                <Icon
                  size={28}
                  strokeWidth={2.5}
                  style={{
                    color: variant.color,
                    filter: `drop-shadow(0 4px 8px ${variant.color}50)`
                  }}
                />

                {/* Sparkle de quina */}
                <Sparkles size={14} className="absolute top-1.5 right-1.5 text-white opacity-60" />
              </div>
            </div>

            {/* --- ÁREA DE DADOS (TEXTO) --- */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-900/5 rounded-full border border-black/5">
                  <Activity size={10} className="text-stone-400" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-500 font-mono">
                    Nexus_Live
                  </span>
                </div>
                <div className="h-px flex-1 bg-stone-200/60" />
                <span className="text-[9px] font-mono font-black uppercase tracking-widest italic" style={{ color: variant.color }}>
                  {variant.statusText}
                </span>
              </div>

              <div className="space-y-0.5">
                <h5 className="text-[17px] font-black text-stone-900 uppercase tracking-tighter italic leading-none truncate drop-shadow-sm">
                  {title || (type === 'ERROR' ? 'Protocolo_Falhou' : 'Data_Sync_OK')}
                </h5>
                <p className="text-[12px] font-bold text-stone-600/90 leading-snug line-clamp-2 pr-2">
                  {message}
                </p>
              </div>
            </div>

            {/* DECORAÇÃO TÉCNICA FINAL */}
            <div className="hidden sm:flex flex-col items-center gap-3 py-1 opacity-30">
              <div className="w-1 h-1 rounded-full bg-stone-400" />
              <div className="w-px h-8 bg-stone-300" />
              <Terminal size={14} className="text-stone-500" />
            </div>
          </div>

          {/* --- PROGRESS CONDUIT (ENERGIA LÍQUIDA) --- */}
          <div className="h-2 w-full bg-stone-200/40 relative overflow-hidden px-1 pb-1">
            <div className="h-full w-full bg-stone-900/5 rounded-full overflow-hidden ring-1 ring-inset ring-black/5">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4.5, ease: "linear" }}
                className="h-full relative rounded-full"
                style={{
                  backgroundColor: variant.color,
                  boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), 0 0 15px ${variant.color}60`
                }}
              >
                {/* Feixe de luz de movimento */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-r from-transparent via-white/60 to-transparent blur-sm" />

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};