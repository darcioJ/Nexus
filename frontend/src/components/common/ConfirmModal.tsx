import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Cpu } from 'lucide-react';
import { triggerHaptic } from '../../utils/triggerHaptic';
import { VARIANTS, type ModalType } from '../../config/confirm.config';

interface ConfirmModalProps {
  isOpen: boolean;
  type?: ModalType;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  isOpen,
  type = 'info',
  title,
  description,
  confirmLabel = "Confirmar_Sincronia",
  cancelLabel = "Abortar",
  onClose,
  onConfirm
}: ConfirmModalProps) => {

  const theme = VARIANTS[type];
  const Icon = theme.icon;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">

          {/* 1. OVERLAY ULTRA-DARK COM REFRAÇÃO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-2xl ${
              type === 'danger' ? 'bg-rose-950/40' : 'bg-slate-950/70'
            }`}
          >
             {/* Textura de Grão/Noise no Fundo */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </motion.div>

          {/* 2. CHASSI DO MODAL (PRISMA GLASS) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, rotateX: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`relative bg-white w-full max-w-sm rounded-[4rem] shadow-[0_80px_120px_-30px_rgba(0,0,0,0.6)] overflow-hidden border border-white/80 perspective-1000`}
          >
            {/* SCANLINES TÁTICAS & GRÃO */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* BARRA DE ENERGIA DINÂMICA (Glow Superior) */}
            <div className={`h-3 w-full bg-linear-to-r from-transparent ${theme.accent} to-transparent shadow-[0_0_30px_rgba(0,0,0,0.2)]`} />

            <div className="p-10 flex flex-col items-center text-center relative z-10">

              {/* HEADER: STATUS DE SEGURANÇA */}
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-6 bg-slate-200" />
                <div className="flex items-center gap-2 bg-stone-100/80 px-4 py-1.5 rounded-full border border-stone-200/50 backdrop-blur-sm">
                  <Cpu size={10} className={`text-${theme.color}-500 animate-pulse`} />
                  <span className="text-[7px] font-black uppercase tracking-[0.5em] text-slate-500 font-mono">
                    Security_Node: <span className={`text-${theme.color}-600`}>{type.toUpperCase()}</span>
                  </span>
                </div>
                <div className="h-px w-6 bg-slate-200" />
              </div>

              {/* DISPLAY CENTRAL (O ÍCONE) */}
              <div className="relative mb-10 group">
                <div className={`absolute inset-0 ${theme.accent} blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />
                <div className={`relative w-28 h-28 rounded-[3rem] bg-linear-to-b from-white to-stone-50 border border-stone-200 flex items-center justify-center text-${theme.color}-500 shadow-2xl`}>
                  <Icon size={48} strokeWidth={1.2} className={`${type !== 'info' ? 'animate-bounce-subtle' : ''}`} />
                  
                  {/* Cantos táticos decorativos */}
                  <div className="absolute top-4 left-4 w-1.5 h-1.5 border-t-2 border-l-2 border-stone-300 opacity-40" />
                  <div className="absolute bottom-4 right-4 w-1.5 h-1.5 border-b-2 border-r-2 border-stone-300 opacity-40" />
                </div>
              </div>

              {/* CONTEÚDO TEXTUAL */}
              <div className="space-y-4 mb-12">
                <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-[0.8] mb-2">
                  {title.split('_').join(' ')}
                </h3>
                <p className="text-[13px] font-bold text-slate-400 leading-relaxed px-6 antialiased italic">
                  {description}
                </p>
              </div>

              {/* GRID DE BOTÕES (EXECUTAR / ABORTAR) */}
              <div className="flex flex-col w-full gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    triggerHaptic(theme.haptic);
                    onConfirm();
                  }}
                  className={`w-full h-16 ${theme.accent} text-white rounded-4xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl ${theme.shadow} transition-all relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Check size={22} className="group-hover:rotate-15 transition-transform" />
                  {confirmLabel}
                </motion.button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-12 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] text-slate-300 hover:text-rose-500 transition-all flex items-center justify-center gap-3 group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                  {cancelLabel}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                </button>
              </div>
            </div>

            {/* MARCA D'ÁGUA NEXUS */}
            <div className="absolute -bottom-6 -left-6 opacity-[0.03] pointer-events-none select-none">
              <span className="text-[100px] font-black italic tracking-tighter">PRISMA</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};