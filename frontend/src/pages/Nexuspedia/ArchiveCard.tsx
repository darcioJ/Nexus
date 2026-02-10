export const ArchiveCard = ({ archive, onClick }) => (
  <motion.div
    layoutId={`archive-${archive._id}`}
    onClick={onClick}
    className="group relative p-8 rounded-[3rem] bg-white/60 backdrop-blur-3xl border-2 border-white cursor-pointer hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden"
  >
    {/* INDICADOR DE CATEGORIA TÁTICA */}
    <div className="absolute top-8 right-8 flex items-center gap-2">
      <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">{archive.category}</span>
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
    </div>

    <div className="space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
        <Bookmark size={24} />
      </div>

      <div>
        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">
          {archive.title}
        </h3>
        <p className="text-[11px] font-bold text-slate-400 line-clamp-2 leading-relaxed italic">
          {archive.previewText}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Protocolo_Códice</span>
        <span className="text-[8px] font-mono font-bold text-blue-500/60">{archive.date}</span>
      </div>
    </div>
  </motion.div>
);