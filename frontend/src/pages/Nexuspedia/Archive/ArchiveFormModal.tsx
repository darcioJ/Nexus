import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FilePlus, Type, Tag, Eye, EyeOff, Send } from 'lucide-react';
import { InputGroup } from '../../../components/common/InputGroup';
import { TagInput } from '../../../components/common/TagInput';
import { LogicInput } from '../../../components/common/LogicInput';
import { inputBaseClass } from '../../../config/vault.config';

export const ArchiveFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      category: 'LORE',
      previewText: '',
      content: '',
      tags: '',
      isPublished: true
    }
  });

  const isPublished = watch('isPublished');

  const onSubmit = (data) => {
    // Aqui você enviaria para o seu controller de Archive
    onSave(data);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
          />

          {/* CHASSI DO FORMULÁRIO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white border-4 border-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
          >

            {/* HEADER DA FORJA */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <FilePlus size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none">Injetar_Novo_Registro</h2>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Protocolo de Arquivamento Nexus</span>
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white rounded-xl transition-all">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* CORPO DO FORMULÁRIO */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8 custom-scrollbar">

              {/* LINHA 1: TÍTULO E VISIBILIDADE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <InputGroup label="Título do Registro" icon={<Type size={14} />} error={errors.title}>
                    <input
                      {...register('title', { required: "Obrigatório" })}
                      className={inputBaseClass}
                      placeholder="Ex: A Queda de Neo-Limoeiro..."
                    />
                  </InputGroup>
                </div>

                <InputGroup label="Status do Sinal">
                  <button
                    type="button"
                    onClick={() => setValue('isPublished', !isPublished)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${isPublished
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {isPublished ? 'Publicado' : 'Rascunho'}
                    </span>
                    {isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </InputGroup>
              </div>

              {/* LINHA 2: CATEGORIA E TAGS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Classificação de Dados">
                  <select {...register('category')} className={`${inputBaseClass} appearance-none cursor-pointer uppercase text-[10px] font-black tracking-widest`}>
                    <option value="LORE">Lore / História</option>
                    <option value="REGRAS">Regras / Mecânicas</option>
                    <option value="LOGS">Logs de Campanha</option>
                    <option value="SISTEMA">Informação de Sistema</option>
                  </select>
                </InputGroup>

                <InputGroup label="Indexadores (Tags)" icon={<Tag size={14} />}>
                  <TagInput
                    name="tags"
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    icon={<Tag size={16} />}
                    placeholder="Injetar tags..."
                  />
                </InputGroup>
              </div>

              {/* LINHA 3: RESUMO (PREVIEW) */}
              <InputGroup label="Resumo do Scanner (Preview Text)">
                <textarea
                  {...register('previewText', { required: "Obrigatório" })}
                  rows={2}
                  className={`${inputBaseClass} !rounded-3xl py-4 resize-none italic`}
                  placeholder="Um breve resumo que aparecerá no card da Nexuspédia..."
                />
              </InputGroup>

              {/* LINHA 4: CONTEÚDO COMPLETO (TERMINAL LÓGICO) */}
              <InputGroup label="Corpo do Arquivo (Markdown Suportado)">
                <LogicInput
                  name="content"
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  placeholder="Escreva a lore ou as regras aqui..."
                  macros={[
                    { label: 'Personagem', value: '**[NOME]**', color: '#8b5cf6' },
                    { label: 'Local', value: '*[LUGAR]*', color: '#3b82f6' },
                    { label: 'Destaque', value: '==[TEXTO]==', color: '#fb923c' },
                    { label: 'Tabela', value: '| Col 1 | Col 2 |\n|---|---|\n| Dado | Dado |', color: '#64748b' }
                  ]}
                />
              </InputGroup>
            </form>

            {/* FOOTER: COMMIT DE DADOS */}
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
              >
                Abortar_Operação
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3"
              >
                <Send size={16} /> Injetar_no_Códice
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};