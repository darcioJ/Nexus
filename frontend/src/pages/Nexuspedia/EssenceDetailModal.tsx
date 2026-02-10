import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, Quote, Activity, Zap, Fingerprint, ShieldAlert } from 'lucide-react'
import { NexusIcon } from "../../components/common/NexusIcon";

/* --- MINI COMPONENTE DE MÉTRICA --- */
const StatusMetricTile = ({ label, value, icon, color }) => (
  <div className="p-6 rounded-4xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2 transition-transform hover:scale-[1.02]">
    <div className="flex items-center gap-2 opacity-30">
      {icon}
      <span className="text-[7px] font-black uppercase tracking-widest text-slate-900">
        {label}
      </span>
    </div>
    <span className="text-sm font-black italic tracking-tight" style={{ color }}>
      {value}
    </span>
  </div>
);

export const EssenceDetailModal = ({ essence, onClose }) => {
  const statusData = essence.statusId;

  const modalJSX = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
      {/* 1. BACKDROP: REFRAÇÃO TOTAL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/40 backdrop-blur-3xl"
      >
        {/* Luzes Incidentes Dinâmicas */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 50%, ${essence.colorVar}22, transparent 70%)` }} />
      </motion.div>

      {/* 2. CHASSIS DO MODAL */}
      <motion.div
        layoutId={`card-${essence._id}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        style={{ '--accent-color': essence.colorVar } as unknown}
        className={`
          relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl 
          bg-white/80 backdrop-blur-2xl 
          md:rounded-[4rem] border-white/60 md:border-4 
          shadow-[0_50px_100px_-20px_rgba(15,23,42,0.15)] 
          flex flex-col lg:flex-row overflow-hidden
        `}
      >
        {/* BOTÃO FECHAR (Mobile Optimized) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-4 bg-slate-900/5 hover:bg-slate-900/10 rounded-full backdrop-blur-md transition-all active:scale-90"
        >
          <X size={20} className="text-slate-800" />
        </button>

        {/* --- LADO ESQUERDO: NÚCLEO DO CRISTAL (CERÂMICA) --- */}
        <div className="w-full lg:w-[40%] p-8 md:p-12 flex flex-col items-center justify-center relative bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="absolute inset-0 opacity-10 blur-[80px]" style={{ backgroundColor: 'var(--accent-color)' }} />

          <motion.div
            layoutId={`icon-${essence._id}`}
            className="relative w-32 h-32 md:w-48 md:h-48 bg-white rounded-[3rem] md:rounded-[4.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1),inset_0_0_40px_white] border-2 border-white flex items-center justify-center mb-8"
            style={{ color: 'var(--accent-color)' }}
          >
            <NexusIcon name={essence.iconName} size={80} className="drop-shadow-[0_0_15px_var(--accent-color)]" />

            {/* Scanline Orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2.5 border border-dashed border-slate-200 rounded-full opacity-40"
            />
          </motion.div>

          <div className="text-center space-y-2 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              {essence.name}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-0.5 bg-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                {essence.category}
              </span>
              <span className="w-8 h-0.5 bg-slate-200" />
            </div>
          </div>
        </div>

        {/* --- LADO DIREITO: TELEMETRIA (SCROLLABLE DATA) --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/40">
          <div className="p-8 md:p-16 space-y-12">

            {/* Seção: Lore & Eficácia */}
            <div className="grid grid-cols-1 gap-10">
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Quote size={18} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Data_Log_Lore</span>
                </div>
                <p className="text-lg md:text-2xl font-medium text-slate-600 italic leading-snug">
                  "{essence.description}"
                </p>
              </section>

              <section className="p-6 md:p-8 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                <div className="flex items-start gap-4">
                  <Activity size={20} className="text-slate-200 mt-1" />
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-2">Vantagem_Tática</span>
                    <p className="text-sm md:text-base font-bold text-slate-800 leading-relaxed">
                      {essence.advantageAgainst}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Seção: Status Effect (Biometria) */}
            {statusData && (
              <section className="space-y-8 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-50" style={{ color: 'var(--accent-color)' }}>
                      <Zap size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Impacto_Sináptico</h4>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                        {statusData.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 italic text-slate-500 text-sm leading-relaxed">
                  "{statusData.description}"
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatusMetricTile
                    label="Mecânica_Dano"
                    value={statusData.mechanic}
                    icon={<Fingerprint size={14} />}
                    color="var(--accent-color)"
                  />
                  <StatusMetricTile
                    label="Escudo_Resistência"
                    value={statusData.resistance}
                    icon={<ShieldAlert size={14} />}
                    color="slate-900"
                  />
                </div>
              </section>
            )}

            {/* Hardware Serial Footer */}
            <div className="flex items-center justify-between opacity-20 pt-10">
              <span className="text-[7px] font-mono font-bold tracking-[0.5em] text-slate-400 uppercase">
                Nexus_Vault_Registry: {essence._id.slice(-8).toUpperCase()}
              </span>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};