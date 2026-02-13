import { motion } from 'framer-motion';
import { Bookmark, Clock, User } from 'lucide-react';

const CATEGORY_STYLES = {
  LORE: "from-purple-500/20 to-indigo-500/20 text-indigo-600 border-indigo-100",
  REGRAS: "from-amber-500/20 to-orange-500/20 text-orange-600 border-orange-100",
  LOGS: "from-emerald-500/20 to-teal-500/20 text-teal-600 border-emerald-100",
  SISTEMA: "from-blue-500/20 to-cyan-500/20 text-blue-600 border-blue-100",
};

export const ArchiveCard = ({ archive, onClick }) => {
  const style = CATEGORY_STYLES[archive.category as keyof typeof CATEGORY_STYLES] || CATEGORY_STYLES.SISTEMA;

  return (
    <motion.div
      layoutId={`archive-${archive._id}`}
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative p-1 rounded-[3.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer transition-all duration-500"
    >
      <div className="relative bg-white/90 rounded-[3.2rem] p-8 h-full overflow-hidden border border-white">
        
        {/* EFEITO DE LUZ (PRISMA) */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-linear-to-br ${style} blur-3xl opacity-40 group-hover:opacity-70 transition-opacity`} />

        <div className="relative z-10 flex flex-col h-full">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div className={`p-4 rounded-2xl bg-white shadow-sm border ${style.split(' ')[2]} group-hover:rotate-6 transition-transform duration-500`}>
              <Bookmark size={22} className={style.split(' ')[2].replace('border-', 'text-')} />
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white border shadow-sm ${style.split(' ')[2]}`}>
                {archive.category}
              </span>
              <span className="text-[8px] font-mono text-slate-300 mt-2 font-bold tracking-tighter">
                REF_#00{archive._id.slice(-3)}
              </span>
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.9]">
              {archive.title}
            </h3>
            <p className="text-[12px] font-medium text-slate-400 line-clamp-3 leading-relaxed">
              {archive.previewText}
            </p>
          </div>

          {/* FOOTER (METADADOS SUAVES) */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <User size={10} className="text-slate-400" />
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase">{archive.author}</span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-300 italic">
              <Clock size={10} />
              <span className="text-[9px] font-bold tracking-tighter">
                {new Date(archive.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};