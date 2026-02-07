import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Brain, Activity,
  ShieldCheck, ChevronDown, ChevronRight, Shield,
} from 'lucide-react';
import { NexusIcon } from '../../../components/common/NexusIcon';
import { createPortal } from 'react-dom';
import { triggerHaptic } from '../../../utils/triggerHaptic';

interface VitalControlProps {
  character: any;
  vault: any;
  onModulate: (characterId: string, stat: string, value: number) => void;
  onStatusChange: (characterId: string, statusId: string) => void;
}

export const VitalControl = ({ character, vault, onModulate, onStatusChange }: VitalControlProps) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // 1. SINCRONIA DE STATUS (Busca o objeto completo para o HUD)
  const currentStatus = useMemo(() => {
    return vault?.statusEffects.find(s => s._id === character.stats.status) || null;
  }, [vault, character.stats.status]);

  // 2. BUSCA DO STATUS FUNDAMENTAL (Estabilizado)
  // Procuramos pela key 'stable' para garantir que temos o ID correto para o reset
  const stabilizedId = useMemo(() => {
    return vault?.statusEffects?.find(s => s.key === 'stable')?._id;
  }, [vault?.statusEffects]);

  const activeEssence = useMemo(() => {
    if (!currentStatus) return null;
    return vault?.essences?.find(e => e.statusId === currentStatus._id);
  }, [vault, currentStatus]);

  const getStatusKey = (name: string) =>
    name ? name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") : 'estabilizado';

  const statusKey = getStatusKey(currentStatus?.name);
  const statusColor = `var(--status-${statusKey})`;

  return (
    <section className="p-5 rounded-[2.5rem] bg-white border border-slate-50 shadow-xs space-y-5 relative overflow-hidden group/vital">

      {/* Módulos de HP e SAN permanecem iguais... */}
      <StatModule
        label="Vida"
        subLabel="Bio_Core"
        icon={<Heart size={12} fill="currentColor" />}
        value={character.stats.hp}
        max={character.stats.maxHp}
        color="var(--nexus-hp)"
        onModulate={(v) => onModulate(character._id, 'hp', v)}
      />

      <StatModule
        label="Sanidade"
        subLabel="Cognitive"
        icon={<Brain size={12} fill="currentColor" />}
        value={character.stats.san}
        max={character.stats.maxSan}
        color="var(--nexus-san)"
        onModulate={(v) => onModulate(character._id, 'san', v)}
      />

      {/* 3. MÓDULO DE DIAGNÓSTICO (ESTADO) */}

      <div className="pt-6 border-t border-slate-100/60 space-y-3 relative">
        {/* HEADER TÉCNICO: Agora com indicador de rádio */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 opacity-50">
            <Activity size={10} style={{ color: statusColor }} className="animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-900">Telemetria_Sinal</span>
          </div>
          <div className="flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-slate-200" style={i === 2 ? { backgroundColor: statusColor } : {}} />
            ))}
          </div>
        </div>

        {/* GATILHO DO MODAL: HARDWARE DE ALTO IMPACTO */}
        <button
          onClick={() => setIsStatusOpen(true)}
          style={{
            borderColor: `color-mix(in srgb, ${statusColor}, transparent 70%)`,
            background: `linear-gradient(135deg, white 0%, color-mix(in srgb, ${statusColor}, transparent 96%) 50%, color-mix(in srgb, ${statusColor}, transparent 92%) 100%)`,
            boxShadow: `
        0 4px 20px -5px color-mix(in srgb, ${statusColor}, transparent 80%),
        inset 0 0 12px rgba(255,255,255,0.8)
      `
          }}
          className="w-full group/status relative flex items-center justify-between p-3.5 rounded-2xl border-2 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500 text-left overflow-hidden"
        >
          {/* Efeito de Reflexo Interno (Glint) */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/60 z-20" />

          <div className="flex items-center gap-4 relative z-10">
            {/* ÍCONE ESTILO LENTE (ORB) */}
            <div
              className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center relative transition-all duration-700 group-hover/status:rotate-[360deg]"
              style={{
                border: `1px solid color-mix(in srgb, ${statusColor}, transparent 80%)`,
              }}
            >
              {/* Brilho de fundo do ícone */}
              <div
                className="absolute inset-0 blur-md opacity-20"
                style={{ backgroundColor: statusColor }}
              />

              <div className="relative z-10" style={{ color: statusColor }}>
                {activeEssence ? (
                  <NexusIcon name={activeEssence.iconName} size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}
              </div>
            </div>

            {/* INFO DE TEXTO: Foco no Contraste */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4
                  className="text-xs font-black uppercase italic tracking-tighter leading-none"
                  style={{ color: `color-mix(in srgb, ${statusColor}, black 20%)` }}
                >
                  {currentStatus?.name || "Estabilizado"}
                </h4>
                {/* Indicador de "Live" */}
                <div className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: statusColor }} />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Frequência:</span>
                <span
                  className="text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-100/50"
                  style={{ color: `color-mix(in srgb, ${statusColor}, black 40%)` }}
                >
                  {currentStatus ? currentStatus.type : "Nominal"}
                </span>
              </div>
            </div>
          </div>

          {/* SELETOR LATERAL */}
          <div className="flex flex-col items-center gap-1 pr-1 opacity-30 group-hover/status:opacity-100 transition-opacity">
            <ChevronDown size={14} className="text-slate-400" />
            <div className="w-0.5 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-full h-full origin-top animate-pulse" style={{ backgroundColor: statusColor }} />
            </div>
          </div>
        </button>
      </div>

      {/* MODAL TÁTICO DE STATUS: PORTAL DE INTERVENÇÃO PRISMA */}
      {createPortal(
        <AnimatePresence>
          {isStatusOpen && (
            <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 md:p-8">

              {/* 1. BACKDROP PRISMA: Vidro fosco otimizado */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsStatusOpen(false)}
                style={{
                  backgroundColor: `color-mix(in srgb, ${statusColor}, transparent 90%)`,
                  backdropFilter: 'blur(8px) saturate(150%)'
                }}
                className="absolute inset-0"
              />

              {/* 2. CONTAINER DO CONSOLE: Mais estreito e responsivo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 100 }}
                className="relative w-full max-w-4xl border border-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col md:flex-row h-[90vh] sm:h-fit sm:max-h-[85vh] backdrop-blur-3xl"
                style={{ backgroundColor: `color-mix(in srgb, ${statusColor}, white 94%)` }}
              >

                {/* LADO ESQUERDO/TOPO: PAINEL DE CONTROLE (Compactado) */}
                <div className="w-full md:w-60 bg-white/40 p-6 md:p-8 flex flex-row md:flex-col justify-between items-center md:items-start border-b md:border-b-0 md:border-r border-white/60 relative shrink-0">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:10px_10px]" />

                  <div className="relative z-10 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white shadow-sm border border-slate-50 flex items-center justify-center md:mb-6 shrink-0"
                      style={{ color: statusColor, boxShadow: `0 8px 16px -4px color-mix(in srgb, ${statusColor}, transparent 70%)` }}
                    >
                      <Activity size={20} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm md:text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Nexus<span className="text-slate-400">_Override</span>
                      </h3>
                      <p className="hidden md:block text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed mt-2">
                        Selecione a nova frequência de integridade.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 relative z-10">
                    <button
                      onClick={() => { if (stabilizedId) onStatusChange(character._id, stabilizedId); setIsStatusOpen(false); }}
                      className="px-4 py-2 md:p-4 rounded-xl md:rounded-2xl bg-white border border-emerald-500/10 flex items-center gap-2 group transition-all hover:bg-emerald-500 hover:shadow-lg active:scale-95"
                    >
                      <ShieldCheck size={16} className="text-emerald-500 group-hover:text-white transition-colors" />
                      <span className="text-[8px] md:text-[10px] font-black text-emerald-600 group-hover:text-white uppercase tracking-tighter">Estabilizar</span>
                    </button>

                    <button
                      onClick={() => setIsStatusOpen(false)}
                      className="hidden md:block py-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors text-center"
                    >
                      [ Cancelar ]
                    </button>
                  </div>
                </div>

                {/* LADO DIREITO: MATRIZ DE CONDICIONAMENTO (Grid Compacto) */}
                <div className="flex-1 p-5 md:p-8 overflow-y-auto custom-scrollbar bg-white/10">
                  <div className="flex items-center justify-between mb-6 bg-white/60 p-3 px-4 rounded-xl border border-white">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Matriz_Condições</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <div className="w-4 h-1 rounded-full transition-colors" style={{ backgroundColor: statusColor }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {vault?.statusEffects?.filter(s => s.key !== 'stable').map((s) => {
                      const itemKey = getStatusKey(s.name);
                      const itemColor = `var(--status-${itemKey})`;
                      const isActive = character.stats.status === s._id;

                      return (
                        <button
                          key={s._id}
                          onClick={() => { onStatusChange(character._id, s._id) }}
                          style={{
                            borderColor: isActive ? itemColor : "transparent",
                            background: isActive
                              ? `linear-gradient(135deg, white, color-mix(in srgb, ${itemColor}, transparent 92%))`
                              : `linear-gradient(135deg, rgba(255,255,255,0.6), transparent)`,
                            boxShadow: isActive
                              ? `0 10px 20px -10px color-mix(in srgb, ${itemColor}, transparent 50%)`
                              : `inset 0 0 20px rgba(255,255,255,0.5)`,
                          }}
                          className={`
                      relative p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all duration-300 text-left overflow-hidden group flex flex-col justify-between min-h-[140px] md:min-h-[160px] cursor-pointer
                      ${!isActive && 'bg-white/20 hover:bg-white/40 hover:border-white'}
                    `}
                        >
                          <div className="relative z-10 space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="text-[11px] md:text-sm font-black uppercase italic tracking-tighter" style={{ color: isActive ? itemColor : '#1e293b' }}>
                                  {s.name}
                                </span>
                                <span className="text-[7px] font-bold uppercase tracking-widest text-slate-400">
                                  {s.type}
                                </span>
                              </div>
                              {isActive && (
                                <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px]" style={{ backgroundColor: itemColor, shadowColor: itemColor }} />
                              )}
                            </div>

                            <div
                              className="p-3 rounded-xl border text-[9px] md:text-[10px] leading-snug text-slate-600"
                              style={{
                                backgroundColor: isActive ? `color-mix(in srgb, ${itemColor}, transparent 96%)` : 'rgba(255,255,255,0.3)',
                                borderColor: isActive ? `color-mix(in srgb, ${itemColor}, transparent 90%)` : 'rgba(255,255,255,0.5)'
                              }}
                            >
                              {s.mechanic}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between relative z-10 border-t border-black/5 pt-3">
                            <div className="flex items-center gap-2">
                              <Shield size={12} style={{ color: isActive ? itemColor : '#94a3b8' }} />
                              <span className="text-[8px] font-black text-slate-900 uppercase">{s.resistance}</span>
                            </div>

                            <ChevronRight
                              size={14}
                              className={`transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`}
                              style={{ color: itemColor }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

function StatModule({ label, subLabel, icon, value, max, color, onModulate }) {
  const percentage = Math.round(Math.min((value / max) * 100, 100));
  const isCritical = percentage < 25;

  return (
    <div className="space-y-4 group/module relative">
      {/* 1. HEADER DE TELEMETRIA */}
      <div className="flex justify-between items-end px-1">
        <div className="flex items-center gap-3">
          {/* Ícone com Glow Dinâmico */}
          <div
            className={`p-2 rounded-xl bg-white border border-slate-50 shadow-sm transition-all duration-500 ${isCritical ? 'animate-pulse' : ''}`}
            style={{
              color: color,
              boxShadow: isCritical ? `0 0 15px ${color}40` : 'none'
            }}
          >
            {icon}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">{label}</span>
              {isCritical && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-[6px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-1 rounded"
                >
                  Aviso_Crítico
                </motion.span>
              )}
            </div>
            <span className="text-[6px] font-mono font-bold text-slate-300 uppercase italic tracking-tighter">{subLabel}</span>
          </div>
        </div>

        {/* Valores Numéricos */}
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black tabular-nums text-slate-900 tracking-tighter leading-none">{value}</span>
            <span className="text-[8px] font-bold text-slate-200">/ {max}</span>
          </div>
          <span className="text-[7px] font-mono font-black text-slate-300 uppercase tracking-widest">{percentage}%_Integrity</span>
        </div>
      </div>

      {/* 2. BARRA DE CARGA TÉCNICA */}
      <div className="relative h-3 bg-slate-50 rounded-full border border-white shadow-inner overflow-hidden p-0.5">
        {/* Grade de fundo (Pattern) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10% 100%' }} />

        <motion.div
          animate={{
            width: `${percentage}%`,
            backgroundColor: isCritical ? '#f43f5e' : color
          }}
          className="h-full rounded-full relative"
          style={{
            boxShadow: `0 0 12px ${isCritical ? '#f43f5e' : color}40`
          }}
        >
          {/* Efeito de Brilho de Ponta (Cursor) */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40 blur-[2px]" />

          {/* Scanline interno na barra */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-1/2"
          />
        </motion.div>
      </div>

      {/* 3. INTERFACE DE MODULAÇÃO */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <ModButton onClick={() => onModulate(-10)} label="-10" isNegative />
          <ModButton onClick={() => onModulate(-1)} label="-" isNegative />
        </div>

        <div className="flex-1 flex flex-col gap-1 items-center px-2">
          <div className="h-px w-full bg-slate-100" />
          <span className="text-[5px] font-black text-slate-200 uppercase tracking-[0.5em]">Neural_Adjust</span>
        </div>

        <div className="flex gap-1">
          <ModButton onClick={() => onModulate(1)} label="+" />
          <ModButton onClick={() => onModulate(10)} label="+10" />
        </div>
      </div>
    </div>
  );
}

function ModButton({ onClick, label, isNegative }) {
  return (
    <motion.button
      whileHover={{ y: -1, shadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      whileTap={{ scale: 0.92 }}
      onClick={() => {
        triggerHaptic(isNegative ? 'MEDIUM' : 'LIGHT');
        onClick();
      }}
      className={`
        min-w-10 h-9 rounded-xl flex flex-col items-center justify-center transition-all border shadow-xs
        ${isNegative
          ? 'bg-white text-slate-400 border-slate-50 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50/30'
          : 'bg-white text-slate-400 border-slate-50 hover:text-emerald-500 hover:border-emerald-100 hover:bg-emerald-50/30'
        }
      `}
    >
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </motion.button>
  );
}