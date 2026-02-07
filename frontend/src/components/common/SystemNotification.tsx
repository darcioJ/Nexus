import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/triggerHaptic';
import { NOTIFICATION_VARIANTS } from '../../config/notification.config';

// --- VARIANTES DE ANIMAÇÃO (Mantidas do seu código) ---
const containerVariants: Variants = {
  hidden: {
    x: 100,
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    x: 150,
    opacity: 0,
    scale: 1.05,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
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

  React.useEffect(() => {
    if (isVisible && onClose) {
      if (type === 'ERROR') triggerHaptic('HEAVY');
      else if (type === 'SUCCESS') triggerHaptic('SUCCESS');
      else triggerHaptic('MEDIUM');

      const timer = setTimeout(() => onClose(), 4500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, type]);

  // Função auxiliar para criar o gradiente prismático
  const prismaticGradient = `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, ${variant.color}20 25%, rgba(255,255,255,0) 50%, ${variant.color}30 75%, rgba(255,255,255,0.5) 100%)`;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      // Usei w-full max-w-md para melhor responsividade em vez de w-md fixo
      className="fixed bottom-12 left-4 right-4 md:left-auto md:right-8 w-auto md:w-full md:max-w-md z-999 pointer-events-auto"
    >
      {/* BASE CERÂMICA:
              - bg-stone-50/95: Cor de base sólida, quase opaca, tipo porcelana.
              - shadow-[...]: Sombra profunda e suave para dar "peso" ao objeto.
              - border-[1px] border-white/80: Borda nítida e brilhante.
          */}
      <div
        className="relative overflow-hidden rounded-[1.8rem] bg-stone-50/95 backdrop-blur-md border border-white/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
      >

        {/* --- CAMADAS PRISMÁTICAS & REFRAÇÃO --- */}

        {/* 1. TEXTURA CERÂMICA: Ruído sutil para tirar a sensação de "plástico liso" */}
        <div className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

        {/* 2. REFRAÇÃO SUPERIOR (ESPECULAR): Luz branca batendo na borda superior */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-white to-transparent opacity-80 z-20" />

        {/* 3. CAMADA IRIDESCENTE (O PRISMA): Um banho de luz colorido que reage ao tipo */}
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{ background: prismaticGradient, filter: 'blur(20px)' }}
        />

        {/* 4. BRILHO LATERAL DE BORDA: Simula luz pegando na quina do objeto */}
        <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-linear-to-l from-white/30 to-transparent opacity-50 z-0 pointer-events-none mix-blend-soft-light" />


        {/* --- CONTEÚDO PRINCIPAL --- */}
        <div className="relative p-5 flex items-start gap-4 z-10 pb-8">

          {/* ICON CLUSTER: Embutido na cerâmica */}
          <motion.div variants={contentVariants} className="relative shrink-0 w-14 h-14">
            {/* Ping de energia */}
            <div
              className="absolute inset-0 rounded-2xl opacity-20 animate-ping"
              style={{ backgroundColor: variant.color, animationDuration: '3s' }}
            />

            {/* O bloco do ícone: Parece um azulejo de vidro inserido na base */}
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center 
                                bg-linear-to-br from-white via-stone-100 to-stone-200 
                                border-[1.5px] border-white 
                                shadow-[inset_0_2px_10px_rgba(255,255,255,1),0_5px_15px_-5px_rgba(0,0,0,0.1)]">

              {/* Pequeno brilho de quina no ícone */}
              <Sparkles size={16} strokeWidth={1} className="absolute top-1 right-1 opacity-50 text-white/80" />

              <Icon size={26} strokeWidth={2.5} style={{ color: variant.color, filter: `drop-shadow(0 4px 6px ${variant.color}30)` }} />
            </div>
          </motion.div>

          {/* ÁREA DE TEXTO */}
          <motion.div variants={contentVariants} className="flex-1 flex flex-col gap-1.5 min-w-0 pt-1">
            {/* Labels táticos com efeito de "gravação a laser" */}
            <div className="flex items-center gap-2 opacity-90">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] font-mono leading-none text-transparent bg-clip-text bg-linear-to-br from-stone-600 to-stone-800">
                {variant.label}
              </span>
              <div className="w-px h-3 bg-stone-300" />
              <span className="text-[8px] font-mono font-bold uppercase leading-none tracking-wider" style={{ color: variant.color }}>
                {variant.statusText}
              </span>
            </div>

            {/* Título e Mensagem: Tipografia mais sólida e escura para contraste com a cerâmica clara */}
            <div className="space-y-1">
              <h5 className="text-[16px] font-black text-stone-900 uppercase tracking-tight italic leading-none truncate drop-shadow-sm">
                {title || (type === 'ERROR' ? 'Falha de Protocolo' : 'Confirmação de Sistema')}
              </h5>
              <p className="text-[12px] font-bold text-stone-600 leading-snug pr-2">
                {message}
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- BARRA DE TEMPO (CONDUÍTE DE ENERGIA) --- */}
        {/* Fica "dentro" da borda inferior, como um tubo de luz */}
        <div className="absolute bottom-0.5 left-0.5 right-0.5 h-2 z-20 overflow-hidden rounded-b-[1.6rem] bg-stone-900/5 ring-1 ring-inset ring-black/5">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4.5, ease: "linear" }}
            className="h-full relative"
            style={{
              backgroundColor: variant.color,
              // Brilho interno intenso
              boxShadow: `inset 0 2px 4px rgba(255,255,255,0.5), 0 0 10px ${variant.color}60`
            }}
          >
            {/* Linha de luz superior */}
            <div className="absolute top-0 inset-x-0 h-px bg-white/70" />

            {/* Efeito Shimmer mais intenso */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/80 to-transparent w-[150%] animate-shimmer" style={{ backgroundSize: '50% 100%', mixBlendMode: 'overlay' }} />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};