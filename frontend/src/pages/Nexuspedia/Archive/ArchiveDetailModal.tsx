import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Bookmark, User, Edit3, Trash2, History, FilePlus, Hash, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useArchive } from '../../../hooks/useArchive';
import { useNotification } from '../../../hooks/useNotification';
import { useConfirm } from '../../../hooks/useConfirm';

// Mapeamento de Cores Prisma (Mantendo consistência com o Card)
const CATEGORY_THEMES = {
  LORE: "text-indigo-600 bg-indigo-50 border-indigo-100",
  REGRAS: "text-orange-600 bg-orange-50 border-orange-100",
  LOGS: "text-teal-600 bg-teal-50 border-teal-100",
  SISTEMA: "text-blue-600 bg-blue-50 border-blue-100",
};

export const ArchiveDetailModal = ({ archive, onClose, isMaster, onEditRequested }) => {
  const { removeArchive } = useArchive();
  const { notifySuccess, notifyError } = useNotification();
  const { confirmDanger } = useConfirm();

  if (!archive) return null;

  const handleDelete = async () => {
    const ok = await confirmDanger(
      "Deletar arquivo?", "Deseja realmente deletar esse arquivo do códice?", "Deletar_Arquivo"
    );

    if (!ok) return;

    try {
      await removeArchive(archive._id);
      notifySuccess("Arquivo deletado", "Arquivo removido com sucesso do Códice.")
      onClose();
    } catch (err) {
      console.error("Falha ao abortar arquivo.");
      notifyError(err, "Falha ao remover arquivo do Códice.")
    }
  };

  const theme = CATEGORY_THEMES[archive.category as keyof typeof CATEGORY_THEMES] || CATEGORY_THEMES.SISTEMA;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 overflow-hidden">
      {/* 1. BACKDROP PRISMÁTICO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/40 backdrop-blur-2xl"
      />

      {/* 2. CHASSI DO DOCUMENTO (CERAMIC) */}
      <motion.div
        layoutId={`archive-${archive._id}`}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-6xl max-h-[92vh] bg-white/95 border-[6px] border-white rounded-[4rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
      >

        {/* HEADER TÁTICO: INFO & AÇÕES */}
        <div className="p-8 md:p-14 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="absolute top-0 left-16 w-40 h-1.5 bg-linear-to-r from-blue-600 to-indigo-400 rounded-b-full shadow-[0_4px_12px_rgba(59,130,246,0.3)]" />

          <div className="flex items-center gap-8">
            <div className={`w-20 h-20 rounded-4xl flex items-center justify-center border shadow-sm ${theme}`}>
              <Bookmark size={36} strokeWidth={1.5} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${theme}`}>
                  {archive.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-300 tracking-tighter italic">
                  // NEXUS_LOG_#{archive._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                {archive.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isMaster && (
              <div className="flex items-center bg-slate-50 p-2 rounded-4xl border border-slate-100">
                <button
                  onClick={() => onEditRequested(archive)} // Passa o archive atual para abrir o form
                  className="p-4 text-slate-400 hover:text-blue-600 hover:bg-white rounded-2xl transition-all active:scale-90"
                  title="Re-calibrar registro"
                >
                  <Edit3 size={20} />
                </button>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <button
                  onClick={handleDelete} // Dispara o protocolo de incineração
                  className="p-4 text-slate-400 hover:text-rose-500 hover:bg-white rounded-2xl transition-all active:scale-90"
                  title="Incinerar registro"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
            <button onClick={onClose} className="p-5 bg-slate-900 text-white rounded-[1.8rem] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* ÁREA DE LEITURA: FORMATO WIKI/LIVRO */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] bg-size-[24px_24px]">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 p-8 md:p-16">

            {/* COLUNA DA ESQUERDA: O CONTEÚDO (ARTIGO) */}
            <div className="flex-1 space-y-12">
              <article className="prose prose-slate prose-xl max-w-none 
  prose-headings:uppercase prose-headings:italic prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
  prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium prose-p:text-lg
  prose-strong:text-blue-600 prose-strong:font-black
  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-3xl prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:italic

  prose-th:text-[10px] prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:text-slate-400
  prose-td:text-sm prose-td:text-slate-600 prose-td:border-b prose-td:border-slate-50">

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]} // FUNDAMENTAL para as tabelas funcionarem
                  components={{
                    em: ({ ...props }) => (
                      <mark className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-bold italic border-b-2 border-blue-200" {...props} />
                    ),
                    // Container para a tabela não "vazar" no mobile
                    table: ({ ...props }) => (
                      <div className="my-8 overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm">
                        <table className="w-full border-collapse" {...props} />
                      </div>
                    ),
                    thead: ({ ...props }) => <thead className="bg-slate-50/50" {...props} />,
                  }}
                >
                  {archive.content}
                </ReactMarkdown>
              </article>

              {/* TAGS AO FINAL DO TEXTO */}
              <div className="flex flex-wrap gap-3 pt-12 border-t border-slate-100">
                {archive.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-200 hover:text-blue-500 transition-colors cursor-default">
                    <Hash size={12} className="text-slate-300" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* COLUNA DA DIREITA: METADADOS (SIDEBAR) */}
            <aside className="w-full lg:w-80 space-y-8">
              <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                <div>
                  <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Tag size={14} /> Registro_Técnico
                  </h4>

                  <div className="space-y-6">
                    <MetaItem icon={<User size={14} />} label="Autor_Original" value={archive.author} />
                    <MetaItem icon={<FilePlus size={14} />} label="Data_Injeção" value={new Date(archive.createdAt).toLocaleDateString('pt-BR')} />
                    <MetaItem icon={<History size={14} />} label="Última_Calibragem" value={new Date(archive.updatedAt).toLocaleDateString('pt-BR')} />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                      Este log é parte integrante do sistema de indexação da Nexuspédia. Cópias não autorizadas serão incineradas.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* RODAPÉ TÉCNICO: FEEDBACK VISUAL */}
        <div className="p-8 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-[8px] font-mono font-black tracking-[0.5em] uppercase text-slate-400 opacity-60">
              PRISMA_NEXUS // CORE_ARCHIVE_MODULE_v2.6
            </span>
          </div>
          <div className="flex gap-1.5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-blue-500/20 rounded-full" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

// Sub-componente para os itens da sidebar
const MetaItem = ({ icon, label, value }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
      <span className="text-blue-500/50">{icon}</span> {label}
    </span>
    <span className="text-sm font-black text-slate-700 uppercase italic tracking-tighter leading-none">
      {value}
    </span>
  </div>
);