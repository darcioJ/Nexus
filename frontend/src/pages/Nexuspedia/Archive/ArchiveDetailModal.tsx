import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Bookmark, Calendar, User, Edit3, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Sugestão para formatação

export const ArchiveDetailModal = ({ archive, onClose, isMaster }) => {
  if (!archive) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 overflow-hidden">
      {/* 1. BACKDROP PRISMÁTICO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/60 backdrop-blur-2xl"
      />

      {/* 2. CHASSI DO DOCUMENTO */}
      <motion.div
        layoutId={`archive-${archive._id}`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-white border-4 border-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
      >

        {/* HEADER TÁTICO */}
        <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Accent de Categoria */}
          <div className="absolute top-0 left-12 w-32 h-1 bg-blue-500 rounded-b-full shadow-[0_0_15px_#3b82f6]" />

          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-500 shrink-0">
              <Bookmark size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{archive.category}</span>
                <span className="text-[10px] font-bold text-slate-300">// ID_{archive._id.slice(-6).toUpperCase()}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                {archive.title}
              </h2>
            </div>
          </div>

          {/* AÇÕES DO MESTRE */}
          <div className="flex items-center gap-3">
            {isMaster && (
              <>
                <button className="p-4 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all">
                  <Edit3 size={18} />
                </button>
                <button className="p-4 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button onClick={onClose} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all active:scale-95">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ÁREA DE LEITURA (DATA_FLOW) */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-10">

            {/* METADADOS DE CAMPO */}
            <div className="flex flex-wrap gap-8 py-6 border-y border-slate-50">
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-slate-300" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(archive.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <User size={14} className="text-slate-300" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AUTOR: {archive.author}</span>
              </div>
            </div>

            {/* CONTEÚDO (MARKDOWN RENDERING) */}
            <article className="prose prose-slate prose-lg max-w-none 
              prose-headings:uppercase prose-headings:italic prose-headings:font-black prose-headings:tracking-tighter
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
              prose-strong:text-blue-600 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/30 prose-blockquote:rounded-3xl prose-blockquote:py-2">
              <ReactMarkdown>{archive.content}</ReactMarkdown>
            </article>

            {/* TAGS DE INDEXAÇÃO */}
            <div className="flex flex-wrap gap-2 pt-10">
              {archive.tags?.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RODAPÉ TÉCNICO */}
        <div className="p-6 bg-slate-50/50 flex justify-between items-center opacity-40">
          <span className="text-[7px] font-mono font-bold tracking-[0.4em] uppercase text-slate-400">
            Códice_Nexus_v2.0 // End_Of_Log
          </span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-blue-500 rounded-full" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  )
};