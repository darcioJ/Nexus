import React, { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Edit3, Trash2, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { triggerHaptic } from '../../../utils/triggerHaptic';

interface VaultCardProps {
  item: any;
  type: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const VaultCard = React.memo(({ item, type, onEdit, onDelete }: VaultCardProps) => {

  const isSystem = item.isSystem;
  const visualSource = type === 'weapons' ? item.essenceId : item;
  const color = isSystem
    ? '#94a3b8'
    : (visualSource?.colorVar || 'var(--color-admin-panel)');

  const { LucideIcon, accentColor, metadata } = useMemo(() => {
    const iconName = visualSource?.iconName || 'Box';
    const IconComponent = (Icons as any)[iconName] || Box;

    const meta = {
      weapons: { tag: item.typeLabel, primary: item.essenceId?.name, secondary: item.range || 'Físico' },
      essences: { tag: item.category, primary: item.advantageAgainst, secondary: item.statusId?.name || 'Nenhum' },
      clubs: { tag: 'Clube', primary: `+${item.bonus?.value} ${item.bonus?.attributeId?.name.slice(0, 3).toUpperCase()}`, secondary: item.key },
      status: { tag: item.category, primary: item.resistance, secondary: item.key },
      attributes: { tag: item.name.slice(0, 3).toUpperCase(), primary: item.key, secondary: item.modLabel },
      archetypes: {
        tag: 'Arquétipo',
        primary: item.items?.length > 0
          ? item.items.map((i: any) => i.name).join(' • ')
          : 'Nenhum item inicial',
        secondary: item.key
      },
    }[type] || { tag: 'Nexus', primary: '', secondary: '' };

    return { LucideIcon: IconComponent, accentColor: color, metadata: meta };
  }, [item, type]);

  return (
    <motion.div
      layout
      className={`
        group relative w-full min-w-0 backdrop-blur-xl border rounded-4xl lg:rounded-[3rem] p-3 lg:p-5 
        flex items-center justify-between gap-4 lg:gap-8 transition-all duration-700
        ${isSystem
          ? 'bg-stone-100/40 border-stone-200/50 opacity-60 grayscale-[0.8] cursor-not-allowed shadow-none'
          : 'bg-white/60 backdrop-blur-xl border-white hover:bg-white hover:shadow-xl'}
      `}
    >
      {/* 1. TEXTURA DE FUNDO: GRID TÁTICO (Apenas para isSystem) */}
      {isSystem && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
      )}

      {/* 2. GLOW LATERAL: Protocolo de Autoridade */}
      <div
        className={`absolute left-0 top-1/4 w-1.5 h-1/2 rounded-r-full transition-all duration-500
          ${isSystem ? 'opacity-100 scale-y-110' : 'opacity-40 group-hover:opacity-100'}`}
        style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}${isSystem ? '88' : '44'}` }}
      />

      {/* --- LADO ESQUERDO: ÍCONE E INFO --- */}
      <div className="flex items-center gap-5 lg:gap-7 min-w-0 relative z-10">
        <div
          className={`
            relative w-14 h-14 lg:w-18 lg:h-18 rounded-2xl lg:rounded-4xl flex items-center justify-center 
            border transition-all duration-700 shrink-0
            ${isSystem ? 'bg-white border-slate-200 shadow-lg scale-105' : 'bg-slate-50 border-white group-hover:scale-105'}
          `}
          style={{ color: accentColor }}
        >
          <LucideIcon size={window.innerWidth < 1024 ? 24 : 28} strokeWidth={isSystem ? 2.5 : 2} />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 lg:gap-3 mb-1">
            <h4 className={`font-black text-sm lg:text-xl tracking-tighter uppercase leading-tight truncate 
              ${isSystem ? 'text-slate-900' : 'text-slate-700'}`}>
              {item.name}
            </h4>

            {/* BADGE DINÂMICO: CORE vs TAG */}
            <span className={`px-2 py-0.5 text-[6px] lg:text-[8px] font-black uppercase rounded-md tracking-widest border shrink-0 transition-colors
              ${isSystem
                ? 'bg-slate-300 text-white border-slate-300 shadow-md'
                : 'bg-slate-100 text-slate-400 border-white'}`}>
              {isSystem ? 'SYSTEM_CORE' : metadata.tag}
            </span>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 text-[8px] lg:text-[9px] font-black uppercase tracking-widest overflow-hidden opacity-70">
            <span style={{ color: accentColor }} className="truncate">
              {isSystem ? `PROT_VER_${item._id.slice(-4).toUpperCase()}` : metadata.primary}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
            <span className="text-slate-400 truncate">{isSystem ? "BLOCKED" : metadata.secondary}</span>
          </div>
        </div>
      </div>

      {/* --- LADO DIREITO: COMANDOS --- */}
      <div className={`flex items-center gap-2 lg:gap-4 shrink-0 pl-2 lg:pl-10 border-l 
        ${isSystem ? 'border-slate-200' : 'border-slate-100/50'}`}>

        {/* BOTÃO EDITAR: Sempre disponível */}
        <button
          disabled={isSystem}
          onClick={() => { triggerHaptic('MEDIUM'); onEdit(); }}
          className={`w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center border rounded-xl lg:rounded-3xl transition-all
          ${isSystem
              ? 'bg-slate-100 text-slate-200 border-transparent cursor-not-allowed opacity-50'
              : 'bg-white border-slate-100 text-slate-300 hover:text-admin-panel hover:border-admin-panel/20 active:scale-90'}`}
        >
          {isSystem ? <Icons.Lock size={18} className="lg:size-6" /> : <Edit3 size={18} className="lg:size-6" />}
        </button>

        {/* BOTÃO DELETAR: Bloqueado visualmente para isSystem */}
        <button
          disabled={isSystem}
          onClick={() => { triggerHaptic('HEAVY'); onDelete(); }}
          className={`
            w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl lg:rounded-3xl transition-all
            ${isSystem
              ? 'bg-slate-100 text-slate-200 border-transparent cursor-not-allowed opacity-50'
              : 'bg-white border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 active:scale-90'}
          `}
        >
          {isSystem ? <Icons.Lock size={18} className="lg:size-6" /> : <Trash2 size={18} className="lg:size-6" />}
        </button>
      </div>
    </motion.div>
  );
});

VaultCard.displayName = 'VaultCard';