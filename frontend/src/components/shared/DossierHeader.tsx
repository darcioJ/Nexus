import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anvil, Check, Activity } from 'lucide-react';

const StepperIcon = memo(({ isActive, isCompleted, isScrolled, icon, activeColor }) => {
  // 1. RESOLUÇÃO DE ÍCONE: Detecta se é componente (User) ou elemento (<User />)
  const renderIcon = () => {
    if (!icon) return null;
    const size = isScrolled ? 14 : 18;

    return React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement, { size, color: 'currentColor' })
      : React.createElement(icon as React.ComponentType<IconProps>, { size, color: 'currentColor' });
  };

  return (
    <div
      className={`
        flex items-center justify-center transition-all duration-500 rounded-full relative
        ${isScrolled ? 'w-6 h-6' : 'w-8 h-8 md:w-10 md:h-10'}
        ${isActive ? 'z-20 scale-110 shadow-lg' : 'z-10'}
      `}
      style={{
        /* MONOCROMÁTICO: O activeColor do passo atual domina toda a trilha */
        backgroundColor: isActive ? '#ffffff' : isCompleted ? activeColor : 'rgba(255, 255, 255, 0.7)',
        border: `1px solid ${isActive || isCompleted ? activeColor : '#e2e8f0'}`,
        boxShadow: isActive ? `0 0 15px ${activeColor}` : 'none',
      }}
    >
      {/* GLOW DE NÚCLEO */}
      <AnimatePresence>
        {isActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: activeColor }} />
            <div className="absolute inset-0 bg-linear-to-b from-white/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ÍCONE HUD: Herança de Cor via currentColor */}
      <div
        className={`transition-all duration-500 relative z-30 flex items-center justify-center
          ${isScrolled ? 'scale-[0.55]' : 'scale-[0.8] md:scale-90'}
        `}
        style={{
          color: isActive ? activeColor : isCompleted ? '#ffffff' : '#cbd5e1'
        }}
      >
        {isCompleted ? (
          <Check size={isScrolled ? 14 : 18} strokeWidth={4} />
        ) : (
          <div className="relative flex items-center justify-center">
            {renderIcon()}
            {isActive && (
              <div
                className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full border-[0.5px] border-white shadow-sm"
                style={{ backgroundColor: activeColor }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export const DossierHeader: React.FC<DossierHeaderProps> = ({ step, isScrolled, steps }) => {
  const currentStep = steps[step] || steps[0];
  const activeColor = currentStep.color;
  const activeSecondary = currentStep.secondary;

  return (
    <motion.header
      initial={false}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        '--accent-color': activeColor, // Gradiente que simula a entrada de luz (ponta superior esquerda)
        background: `linear-gradient( 
            color-mix(in srgb, ${activeColor}, transparent 85%) 0%, 
            color-mix(in srgb, ${activeSecondary}, transparent 95%) 40%, 
            transparent 100%
        )`,
        // Borda refratada: a cor "sangra" sutilmente na borda branca
        borderColor: `color-mix(in srgb, ${activeColor}, white 80%)`,
      } as React.CSSProperties}
      className="sticky top-0 z-50 w-full border-b border-slate-100 shadow-sm backdrop-blur-2xl transition-colors duration-700 bg-accent-color/50"
    >
      {/* 1. SCANLINE HUD (Efeito de varredura tecnológica sutil) */}
      {!isScrolled && (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,var(--accent-color)_3px)] bg-size-[100%_4px]" />
        </div>
      )}

      <div className="relative z-10 h-full max-w-5xl mx-auto flex flex-col justify-between px-5 py-3">

        {/* --- SEÇÃO SUPERIOR: TELEMETRIA --- */}
        <div className="flex items-center gap-4">
          {/* NÚCLEO DO PROCESSADOR (Branding) */}
          <div className={`relative transition-all duration-700 ${isScrolled ? 'scale-75' : 'scale-100'}`}>
            <div className="w-11 h-11 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, var(--accent-color), transparent)` }} />
              <Anvil size={22} strokeWidth={2.5} fill="currentColor" style={{ color: 'var(--accent-color)' }} />

              {/* LED DE STATUS */}
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full border border-white animate-pulse"
                style={{ backgroundColor: 'var(--accent-color)', boxShadow: `0 0 8px var(--accent-color)` }} />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className={`font-black tracking-tighter text-slate-900 transition-all duration-500 ${isScrolled ? 'text-base' : 'text-xl'}`}>
              FORGER <span className="font-light italic" style={{ color: 'var(--accent-color)' }}>NX</span>
            </h1>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-2"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60" style={{ color: 'var(--accent-color)' }}>
                  {currentStep.title}
                </span>
                <Activity size={10} className="animate-pulse" style={{ color: 'var(--accent-color)' }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- SEÇÃO INFERIOR: ENERGIA E PROGRESSO --- */}
        <div className="relative mb-1 mt-2">
          {/* TRILHO DE FUNDO (REATOR) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1.5px] rounded-full bg-slate-100" />

          {/* LASER DE PROGRESSO DINÂMICO */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-[2.5px] rounded-full z-10"
            style={{
              background: `linear-gradient(to right, var(--accent-color), ${activeSecondary})`,
              boxShadow: `0 0 12px var(--accent-color)`
            }}
            animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* PONTO DE IMPACTO DO LASER */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-2"
              style={{ borderColor: 'var(--accent-color)' }} />
          </motion.div>

          {/* NODES DE NAVEGAÇÃO */}
          <div className="flex justify-between relative z-20 px-0.5">
            {steps.map((s, idx) => (
              <StepperIcon
                key={s.id}
                icon={s.icon}
                isActive={idx === step}
                isCompleted={idx < step}
                isScrolled={isScrolled}
                activeColor={activeColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* GLOSS DE SUPERFÍCIE (Reflexo de Cristal) */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/80 to-transparent opacity-50" />
    </motion.header>
  );
};