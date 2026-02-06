import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Grid, CircuitBoard,
  Binary, Activity, Locate, Boxes
} from 'lucide-react';

interface AtmosphereProps {
  step?: number | string;      // Gatilho de animação local
  accentColor?: string;        // Cor principal (ex: #6366f1 ou var(--color-admin))
  opacity?: number;            // Opacidade global da atmosfera
  showHUD?: boolean;           // Ligar/Desligar elementos de interface
  variant?: 'subtle' | 'heavy'; // Intensidade dos elementos visuais
}

export const DossierAtmosphere = ({
  step = 0,
  accentColor = "#3b82f6",
  opacity = 0.1,
  showHUD = true,
  variant = 'heavy'
}: AtmosphereProps) => {

  // Gerador de cores com transparência para os Glows
  const glowStyle = {
    backgroundColor: accentColor,
    opacity: opacity
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-slate-50">

      {/* 1. NÚCLEO ATMOSFÉRICO (Glows Dinâmicos) */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            opacity: [opacity, opacity * 1.5, opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-10%] w-[70%] h-[60%] blur-[140px] rounded-full"
          style={glowStyle}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full opacity-50"
          style={glowStyle}
        />
      </div>

      {/* 2. GRID DE CALIBRAGEM */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <Grid size={1200} strokeWidth={0.2} style={{ color: accentColor }} />
      </div>

      {/* 3. ELEMENTOS DINÂMICOS (Transições de Contexto) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="absolute inset-0"
        >
          {variant === 'heavy' && (
            <>
              <div className="absolute top-20 left-20 opacity-10">
                <CircuitBoard size={220} strokeWidth={0.3} style={{ color: accentColor }} />
              </div>
              <div className="absolute bottom-40 right-20 opacity-10 rotate-12">
                <Boxes size={180} strokeWidth={0.3} style={{ color: accentColor }} />
              </div>
            </>
          )}

          <div className="absolute top-1/3 right-1/4 opacity-[0.05]">
            <Locate size={80} strokeWidth={0.5} style={{ color: accentColor }} className="animate-pulse" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 4. MARCADORES DE HARDWARE E HUD */}
      {showHUD && (
        <>
          {/* Labels HUD Laterais */}
          <div className="absolute bottom-40 left-10 flex flex-col gap-10 opacity-20">
            <HUDLabel icon={<Binary size={10} />} text="SYSTEM_LINK_STABLE" color={accentColor} />
            <HUDLabel icon={<Activity size={10} />} text="PRISMA_REFRACTION_ACTIVE" color={accentColor} />
          </div>

          {/* Escudo Nexus (Marca d'água) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] scale-150">
            <Shield size={1000} strokeWidth={0.05} style={{ color: accentColor }} className="-rotate-12" />
          </div>

          {/* Coordenadas de Setor */}
          <div className="absolute top-10 right-10 flex flex-col items-end opacity-20">
            <div className="flex items-center gap-2">
              <span className="text-[6px] font-mono font-black text-slate-400 uppercase tracking-widest">Nexus_Coord</span>
              <div className="w-10 h-px bg-slate-200" />
            </div>
            <span className="text-[8px] font-mono font-bold mt-1" style={{ color: accentColor }}>
              40.7128° N, 74.0060° W
            </span>
          </div>
        </>
      )}

      {/* 5. EFEITO DE LENTE (Vinheta de Hardware) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(255,255,255,0.8)]" />
    </div>
  );
};

// Componente Interno para Labels do HUD
const HUDLabel = ({ icon, text, color }: any) => (
  <div className="flex items-center gap-3 -rotate-90 origin-left">
    <span style={{ color }}>{icon}</span>
    <span className="text-[7px] font-mono font-black text-slate-500 uppercase tracking-[0.6em]">
      {text}
    </span>
  </div>
);