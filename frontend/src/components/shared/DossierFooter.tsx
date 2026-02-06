import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  ShieldCheck,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/triggerHaptic';

export const DossierFooter = ({
  step,
  nextStep,
  prevStep,
  steps,
  canProceed
}) => {
  const totalSteps = steps.length;
  const isLastStep = step === totalSteps - 1;
  const progress = ((step + 1) / totalSteps) * 100;

  const currentStep = steps[step] || steps[0];
  const accentColor = currentStep.color; // Ex: #6366f1 (Indigo)
  const secondaryColor = currentStep.secondary; // Ex: #818cf8 (Soft Indigo)

  const prevTitle = step > 0 ? steps[step - 1].title : null;
  const nextTitle = !isLastStep ? steps[step + 1].title : "Finalizar Sincronia";

  return (
    <footer
      className="fixed bottom-0 left-0 w-full backdrop-blur-2xl border-t-2 z-50 pb-safe transition-all duration-1000 ease-in-out"
      style={{
        // REFRAÇÃO PRISMA: Fundo translúcido que absorve a cor do módulo
        background: `linear-gradient(180deg, 
                    rgba(255, 255, 255, 0.7) 0%, 
                    color-mix(in srgb, ${accentColor}, transparent 90%) 100%
                )`,
        borderColor: `color-mix(in srgb, ${accentColor}, transparent 80%)`,
        boxShadow: `0 -10px 40px -15px color-mix(in srgb, ${accentColor}, transparent 90%)`
      }}
    >
      {/* --- POWER BEAM: O CONDUTOR DE DADOS --- */}
      <div className="absolute -top-0.75 left-0 w-full h-0.75 bg-slate-100/50 z-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full relative overflow-visible shadow-[0_0_20px_rgba(255,255,255,0.8)]"
          style={{
            background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})`,
          }}
        >
          {/* FOCO DE CALOR: A ponta do feixe brilha intensamente */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full blur-md"
            style={{ backgroundColor: accentColor }}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]" />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 md:py-8 flex items-center justify-between gap-6 relative z-10">

        {/* --- MÓDULO ESQUERDA: VOLTAR / STATUS --- */}
        <div className="flex-1 flex items-center min-w-0">
          <AnimatePresence mode="wait">
            {step > 0 ? (
              <motion.button
                key="btn-back"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => { triggerHaptic('MEDIUM'); prevStep(); }}
                /* Ajuste de Padding: Menor no mobile (p-1.5), maior no desktop (p-2) */
                className="group relative flex items-center gap-2 md:gap-4 p-1.5 pr-3 md:pr-6 rounded-2xl md:rounded-3xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden border border-white shadow-sm bg-white/40 shrink-0"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                  style={{ background: `radial-gradient(circle at left, ${accentColor}, transparent)` }}
                />

                {/* Ícone Adaptativo: Menor no mobile para economizar espaço horizontal */}
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:shadow-lg transition-all shrink-0">
                  <ChevronLeft size={18} className="md:w-5 md:h-5" strokeWidth={3} />
                </div>

                {/* Texto com largura controlada para evitar empurrar o centro */}
                <div className="flex flex-col text-left leading-tight min-w-0">
                  <span className="text-[6px] md:text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">Retornar</span>
                  <span className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-tighter truncate">
                    {prevTitle}
                  </span>
                </div>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-3 md:gap-4 pl-1 md:pl-2 shrink-0"
              >
                <div
                  className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-white shadow-sm shrink-0"
                  style={{ backgroundColor: `color-mix(in srgb, ${accentColor}, transparent 92%)` }}
                >
                  <ShieldCheck size={16} className="md:w-5 md:h-5 animate-pulse" style={{ color: accentColor }} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[6px] md:text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">ID_Link</span>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase mt-0.5 md:mt-1 italic">NX_INIT</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- MÓDULO DIREITA: REATOR DE AVANÇO --- */}
        <div className="flex-1 flex justify-end">
          <button
            disabled={!canProceed}
            onClick={() => {
              if (canProceed) {
                triggerHaptic(isLastStep ? 'SUCCESS' : 'MEDIUM');
                nextStep();
              } else {
                triggerHaptic('HEAVY');
              }
            }}
            className="group relative flex items-center h-14 md:h-18 pl-8 pr-2.5 rounded-4xl md:rounded-[2.5rem] transition-all duration-700 active:scale-95 border-2 shadow-2xl backdrop-blur-2xl"
            style={{
              /* FUNDO REFRATÁRIO: Cor dinâmica pura misturada com transparência */
              background: canProceed
                ? `linear-gradient(135deg, 
                color-mix(in srgb, ${accentColor}, transparent 92%) 0%, 
                color-mix(in srgb, ${accentColor}, transparent 80%) 100%
              )`
                : 'rgba(241, 245, 249, 0.2)', // Estado desativado translúcido

              /* BORDA DE CRISTAL: A cor dinâmica "sangra" na quina do vidro */
              borderColor: canProceed
                ? `color-mix(in srgb, ${accentColor}, transparent 60%)`
                : 'rgba(203, 213, 225, 0.2)',

              boxShadow: canProceed
                ? `inset 0 0 20px color-mix(in srgb, ${accentColor}, transparent 90%), 
               0 15px 35px -10px color-mix(in srgb, ${accentColor}, transparent 70%)`
                : 'none',
            }}
          >

            <div className="flex flex-col items-end text-right leading-none pr-2 relative z-10">
              <span className="text-[10px] md:text-[13px] font-black uppercase tracking-[0.3em] text-slate-900">
                {isLastStep ? 'Concluir' : 'Próximo'}
              </span>
              <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5 opacity-60">
                {nextTitle}
              </span>
            </div>

            {/* O REATOR: O círculo que contém o ícone de ação */}
            <div
              className="w-10 h-10 md:w-13 md:h-13 rounded-2xl md:rounded-[1.4rem] flex items-center justify-center relative z-20 overflow-hidden"
              style={{
                backgroundColor: canProceed ? accentColor : '#e2e8f0',
                boxShadow: canProceed ? `0 10px 25px -5px ${accentColor}60` : 'none',
                transform: canProceed ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {/* Efeito de Brilho no Reator */}
              <div className="absolute inset-0 bg-linear-to-tr from-white/30 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLastStep ? 'finish' : 'next'}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]"
                >
                  {isLastStep ? <Fingerprint size={24} strokeWidth={2.5} /> : <ChevronRight size={26} strokeWidth={3} />}
                </motion.div>
              </AnimatePresence>

              {/* Scanline interno do botão */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/10 to-transparent h-1/2 w-full animate-pulse pointer-events-none" />
            </div>

            {/* INDICADOR DE CARGA (Micro-barra lateral) */}
            {!isLastStep && canProceed && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                <div className="w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: accentColor }} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* --- RIM LIGHT: O toque final de hardware luxuoso --- */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-px opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
    </footer>
  );
};