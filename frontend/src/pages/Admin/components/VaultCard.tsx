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
  const { LucideIcon, accentColor, metadata } = useMemo(() => {
    const visualSource = type === 'weapons' ? item.essenceId : item;
    const color = visualSource?.colorVar || 'var(--color-admin-panel)';
    const iconName = visualSource?.iconName || 'Box';
    const IconComponent = (Icons as any)[iconName] || Box;

    const meta = {
      weapons: { tag: item.typeLabel, primary: item.essenceId?.name, secondary: item.range || 'Físico' },
      essences: { tag: item.category, primary: item.advantageAgainst, secondary: item.baseStatusId?.name || 'Nenhum' },
      clubs: { tag: 'Clube', primary: `+${item.bonus?.value} ${item.bonus?.attributeKey}`, secondary: item.key },
      status: { tag: item.type, primary: item.resistance, secondary: item.key },
      attributes: { tag: item.label, primary: item.description, secondary: item.modLabel },
      archetypes: { tag: 'Arquétipo', primary: item.items },
    }[type] || { tag: 'Nexus', primary: '', secondary: '' };

    return { LucideIcon: IconComponent, accentColor: color, metadata: meta };
  }, [item, type]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // Aumentei o padding (p-5) e a arredondamento (rounded-3xl) para telas largas
      className="group relative w-full bg-white/60 min-w-0 backdrop-blur-xl border border-white rounded-4xl lg:rounded-[3rem] p-3 lg:p-5 flex items-center justify-between gap-4 lg:gap-8 transition-all hover:bg-white hover:shadow-xl"
    >
      {/* --- GLOW LATERAL --- */}
      <div
        className="absolute left-0 top-1/4 w-1.5 h-1/2 rounded-r-full opacity-40 group-hover:opacity-100 transition-all duration-500"
        style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}` }}
      />

      {/* --- LADO ESQUERDO: ÍCONE E INFO --- */}
      <div className="flex items-center gap-5 lg:gap-7 min-w-0">
        <div
          // Ícone levemente maior no desktop (lg:w-20)
          className="relative w-14 h-14 lg:w-18 lg:h-18 rounded-2xl lg:rounded-4xl flex items-center justify-center bg-slate-50 border border-white shrink-0 transition-transform group-hover:scale-105"
          style={{ color: accentColor }}
        >
          <LucideIcon size={window.innerWidth < 1024 ? 24 : 28} strokeWidth={2} style={{ filter: `drop-shadow(0 0 10px ${accentColor}44)` }} />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 lg:gap-3 mb-1">
            {/* Trocado leading-none por leading-tight para não cortar acentos */}
            <h4 className="font-black text-slate-900 text-sm lg:text-xl italic tracking-tighter uppercase leading-tight truncate">
              {item.name}
            </h4>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[6px] lg:text-[8px] font-black uppercase rounded-md tracking-widest border border-white shrink-0">
              {metadata.tag}
            </span>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 text-[8px] lg:text-[9px] font-black uppercase tracking-widest overflow-hidden">
            <span style={{ color: accentColor }} className="truncate">{metadata.primary}</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
            <span className="text-slate-400 truncate">{metadata.secondary}</span>
          </div>
        </div>
      </div>

      {/* --- LADO DIREITO: COMANDOS --- */}
      <div className="flex items-center gap-2 lg:gap-4 shrink-0 pl-2 lg:pl-10 border-l border-slate-100/50">
        {/* Badge de ID apenas para Desktop em telas largas */}
        <div className="hidden xl:flex flex-col items-end mr-4">
          <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest">Serial_Node</span>
          <span className="text-[9px] font-mono font-bold text-slate-400">{item._id.slice(-8)}</span>
        </div>

        <button
          onClick={() => { triggerHaptic('MEDIUM'); onEdit(); }}
          className="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-xl lg:rounded-3xl hover:text-admin-panel hover:border-admin-panel/20 transition-all active:scale-90"
        >
          <Edit3 size={18} className="lg:size-6" />
        </button>
        <button
          onClick={() => { triggerHaptic('HEAVY'); onDelete(); }}
          className="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-xl lg:rounded-3xl hover:text-rose-500 hover:border-rose-100 transition-all active:scale-90"
        >
          <Trash2 size={18} className="lg:size-6" />
        </button>
      </div>
    </motion.div>
  );
});

VaultCard.displayName = 'VaultCard';