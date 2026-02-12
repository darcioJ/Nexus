import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { NexusIcon } from '../../../components/common/NexusIcon';

/* --- CARD SIMPLIFICADO (GATILHO) --- */
export const EssenceCrystalCard = ({ essence, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${essence._id}`}
      onClick={onClick}
      style={{ '--accent-color': essence.colorVar } as unknown}
      className="group relative p-8 rounded-[3rem] bg-white/60 backdrop-blur-3xl border-2 border-white cursor-pointer transition-all duration-500 overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_var(--accent-color)]/50"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: 'var(--accent-color)' }} />

      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <motion.div
          layoutId={`icon-${essence._id}`}
          className="w-20 h-20 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-xl flex items-center justify-center"
          style={{ color: 'var(--accent-color)' }}
        >
          <NexusIcon name={essence.iconName} size={32} />
        </motion.div>

        <div>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1 block">{essence.category}</span>
          <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">{essence.name}</h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold py-2 px-4 bg-slate-50 rounded-full text-slate-400">
          <Info size={12} /> Clique para Diagnóstico
        </div>
      </div>
    </motion.div>
  );
};