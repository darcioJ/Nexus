import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

import {
  X, Tag, Eye, EyeOff, Send,
  AlignLeft, BookOpen, Sparkles, Type, Layers
} from 'lucide-react';

import { InputGroup } from '../../../components/common/InputGroup';
import { TagInput } from '../../../components/common/TagInput';
import { LogicInput } from '../../../components/common/LogicInput';
import { inputBaseClass } from '../../../config/vault.config';

export const ArchiveFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      category: 'LORE',
      previewText: '',
      content: '',
      tags: '',
      isPublished: true
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const isPublished = watch('isPublished');
  const currentTitle = watch('title');

  useEffect(() => {
    if (isOpen) {
      reset(initialData || {
        title: '',
        category: 'LORE',
        previewText: '',
        content: '',
        tags: '',
        isPublished: true
      });
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      tags: typeof data.tags === 'string'
        ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
        : data.tags
    };
    onSave(formattedData);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 overflow-hidden">
          {/* Backdrop Glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/40 backdrop-blur-xl"
          />

          {/* Chassi Ceramic Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="relative w-full max-w-6xl h-full md:h-[85vh] bg-white border border-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden"
          >

            {/* Header Prisma */}
            <div className="px-10 py-8 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-3xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <Sparkles size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {currentTitle || "Novo registro no Códice"}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">Redigindo nova memória para a eternidade do Nexus</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

              {/* Escritório de Redação */}
              <form
                id="archive-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 overflow-y-auto p-8 md:p-14 space-y-10 custom-scrollbar"
              >
                <div className="max-w-2xl mx-auto space-y-10">

                  {/* Título Principal */}
                  <InputGroup label="Título do arquivo" icon={<Type size={14} />} error={errors.title}>
                    <input
                      {...register('title', { required: "O título é essencial para a indexação." })}
                      className={`${inputBaseClass} text-3xl! font-extrabold py-6! px-8! tracking-tight`}
                      placeholder="Como chamaremos este log?"
                    />
                  </InputGroup>

                  {/* Resumo/Preview */}
                  <InputGroup label="Breve introdução" icon={<AlignLeft size={14} />} error={errors.previewText}>
                    <textarea
                      {...register('previewText', { required: "A introdução ajuda outros operativos." })}
                      rows={3}
                      className={`${inputBaseClass} rounded-4xl! py-6! px-8! text-base leading-relaxed italic`}
                      placeholder="Um pequeno resumo para os cards da Nexuspédia..."
                    />
                  </InputGroup>

                  {/* Corpo do Texto */}
                  <InputGroup label="Corpo do manuscrito" icon={<BookOpen size={14} />}>
                    <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-2">
                      <LogicInput
                        name="content"
                        register={register}
                        watch={watch}
                        setValue={setValue}
                        placeholder="Inicie a transmissão de dados aqui..."
                        macros={[
                          { label: 'Título', value: '### [TÍTULO]', color: '#1e293b' },
                          { label: 'Destaque', value: '*[TEXTO]*', color: '#3b82f6' }, // Mapeamos o itálico para o seu highlight azul
                          { label: 'Importante', value: '**[TEXTO]**', color: '#6366f1' },
                          { label: 'Citação', value: '> [LOG]', color: '#8b5cf6' },
                          { label: 'Lista', value: '- [ITEM]', color: '#10b981' },
                          { label: 'Tabela', value: '| Atributo | Valor |\n|---|---|\n| Força | 10 |', color: '#64748b' }
                        ]}
                      />
                    </div>
                  </InputGroup>
                </div>
              </form>

              {/* Sidebar de Configurações */}
              <aside className="w-full lg:w-85 overflow-y-auto bg-slate-50/30 border-l border-slate-50 p-10 flex flex-col gap-8">

                {/* Status Toggle */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 tracking-widest ml-1 uppercase">Sinal de transmissão</h4>
                  <button
                    type="button"
                    onClick={() => setValue('isPublished', !isPublished)}
                    className={`w-full flex items-center justify-between p-6 rounded-[1.8rem] border transition-all duration-500 shadow-sm ${isPublished
                      ? 'bg-white border-blue-100 text-blue-600'
                      : 'bg-slate-100 border-transparent text-slate-400 opacity-60'
                      }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">Status</span>
                      <span className="text-sm font-bold tracking-tight">{isPublished ? 'Publicado' : 'Rascunho'}</span>
                    </div>
                    {isPublished ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>

                {/* Categoria */}
                <InputGroup label="Classificação" icon={<Layers size={14} />}>
                  <select
                    {...register('category')}
                    className={`${inputBaseClass} py-4! cursor-pointer font-bold text-slate-600`}
                  >
                    <option value="LORE">História e Lore</option>
                    <option value="REGRAS">Regras do Sistema</option>
                    <option value="LOGS">Logs de Campanha</option>
                    <option value="SISTEMA">Configuração</option>
                  </select>
                </InputGroup>

                {/* Indexadores */}
                <InputGroup label="Indexadores" icon={<Tag size={14} />}>
                  <div className="bg-white p-2 rounded-[1.8rem] border border-slate-100 shadow-sm">
                    <TagInput
                      icon={<Tag size={14} />}
                      name="tags"
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      placeholder="Tags de busca..."
                    />
                  </div>
                </InputGroup>

                {/* Card de Informação Suave */}
                <div className="mt-auto p-6 rounded-4xl bg-blue-50/40 border border-blue-100/30">
                  <p className="text-[10px] text-blue-500/70 font-medium leading-relaxed italic">
                    Utilize Markdown para dar vida ao seu texto. O Prisma Nexus renderiza destaques, tabelas e citações com elegância.
                  </p>
                </div>
              </aside>
            </div>

            {/* Footer de Ações */}
            <div className="px-12 py-8 bg-white border-t border-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-300 hover:text-rose-400 transition-colors px-4 py-2"
              >
                Descartar rascunho
              </button>

              <button
                form="archive-form"
                type="submit"
                className="px-14 py-4 bg-slate-900 text-white rounded-3xl text-sm font-bold shadow-xl shadow-slate-100 hover:bg-blue-600 hover:shadow-blue-200 transition-all flex items-center gap-3 active:scale-95"
              >
                <Send size={16} />
                Guardar no Códice
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};