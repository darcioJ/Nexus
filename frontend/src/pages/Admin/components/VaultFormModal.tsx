import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X, Save, Loader2, Fingerprint, Tag, Key, BookOpen } from 'lucide-react';

// --- INFRAESTRUTURA NEXUS ---
import { useVault } from '../../../hooks/useVault';
import { useNotification } from '../../../hooks/useNotification';

import { triggerHaptic } from '../../../utils/triggerHaptic';

import { VAULT_CONFIG, type VaultTab, inputBaseClass, textareaBaseClass } from '../../../config/vault.config';

// --- COMPONENTES DE ESTRUTURA ---
import { InputGroup } from './InputGroup';

// --- DOSSIÊS DE CAMPOS (COMPONENTES EXTERNOS) ---
import { ArchetypeFields } from './fields/ArchetypeFields';
import { AttributeFields } from './fields/AttributeFields';
import { ClubFields } from './fields/ClubFields';
import { EssenceFields } from './fields/EssenceFields';
import { StatusEffectFields } from './fields/StatusEffectFields';
import { WeaponFields } from './fields/WeaponFields';

export const VaultFormModal = ({ type, initialData, onClose, onSuccess }: any) => {
  const { essences, statusEffects, attributes } = useVault();
  const { notifySuccess, notifyError } = useNotification();
  const config = VAULT_CONFIG[type as VaultTab];

  const getNormalizedDefaultValues = () => {
    if (!initialData) return {};

    const data = { ...initialData };

    // Se statusId for um objeto (populado), pegamos apenas o string ID
    if (data.statusId && typeof data.statusId === 'object') {
      data.statusId = data.statusId._id;
    }

    // Se for uma arma, fazemos o mesmo para essenceId
    if (data.essenceId && typeof data.essenceId === 'object') {
      data.essenceId = data.essenceId._id;
    }

    // Para Clubes (bonus.attributeId)
    if (data.bonus?.attributeId && typeof data.bonus.attributeId === 'object') {
      data.bonus.attributeId = data.bonus.attributeId._id;
    }

    return data;
  };

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting, errors } } = useForm({
    defaultValues: getNormalizedDefaultValues()
  });

  const onSubmit = async (data: any) => {
    try {
      triggerHaptic('MEDIUM');
      await config.save(data);
      notifySuccess("Sucesso", "Sincronização concluída")
      onSuccess();
    } catch (error) {
      notifyError(error, "Falha na sincronização")
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6">
      {/* OVERLAY TÁTICO */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xl"
      />

      {/* MODAL CERÂMICO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-stone-50 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-white/80"
      >

        {/* DECORAÇÃO DE FUNDO (PRISMA) */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

        {/* HEADER DO DOSSIÊ */}
        <header className="relative px-8 pt-10 pb-6 flex justify-between items-start z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-16 h-16 rounded-[1.8rem] bg-white border border-stone-100 flex items-center justify-center text-indigo-600 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]">
                <config.icon size={32} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Fingerprint size={10} className="text-indigo-500 opacity-50" />
                <span className="text-[9px] font-black text-indigo-600/60 uppercase tracking-[0.3em] font-mono">
                  Sincronia_v2.06
                </span>
              </div>
              <h3 className="font-black text-slate-900 uppercase tracking-tighter text-2xl italic leading-tight">
                {initialData ? 'Sincronizar' : 'Forjar'} <span className="text-indigo-600">{config.label}</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-stone-200/50 hover:bg-rose-500 hover:text-white rounded-full transition-all duration-300 group"
          >
            <X size={18} className="group-hover:rotate-90 transition-transform" />
          </button>
        </header>

        {/* ÁREA DO FORMULÁRIO */}
        <form
          id="vault-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-8 py-4 space-y-8 scrollbar-hide"
        >
          {initialData?._id && <input type="hidden" {...register('_id')} />}

          {/* GRID PRINCIPAL: IDENTIDADE */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* FIELD: KEY DE ACESSO */}
            <InputGroup label="Key de Identificação (ID Tático)" error={errors.key}>
              <div className="relative group">
                {/* ÍCONE DE FUNDO */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                  <Key size={18} strokeWidth={2.5} />
                </div>

                <input
                  {...register('key', { required: true })}
                  // pl-12 adicionado para dar espaço ao ícone
                  className={`${inputBaseClass} pl-12 border-stone-200/60 bg-stone-100/30 group-focus-within:bg-white`}
                  placeholder="ex: protocolo_zero"
                />

                {/* DETALHE DE DESIGN (BARRA DE LUZ) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-300 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_8px_#6366f1] transition-all" />
              </div>
            </InputGroup>

            {/* FIELD: DESIGNAÇÃO PÚBLICA */}
            <InputGroup label="Designação Pública (Nome)" error={errors.name}>
              <div className="relative group">
                {/* ÍCONE DE FUNDO */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                  <Tag size={18} strokeWidth={2.5} />
                </div>

                <input
                  {...register('name', { required: true })}
                  // pl-12 adicionado para dar espaço ao ícone
                  className={`${inputBaseClass} pl-12 border-stone-200/60 bg-stone-100/30 group-focus-within:bg-white`}
                  placeholder="Nome do ativo"
                />

                {/* DETALHE DE DESIGN (BARRA DE LUZ) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-300 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_8px_#6366f1] transition-all" />
              </div>
            </InputGroup>
          </section>

          {/* CONTEÚDO DINÂMICO (GRID INTERNO) */}
          <div className="relative p-8 bg-white/60 backdrop-blur-sm rounded-[3rem] border border-stone-200/50 shadow-inner space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {type === 'weapons' && <WeaponFields register={register} essences={essences} setValue={setValue} watch={watch} errors={errors} />}
              {type === 'archetypes' && <ArchetypeFields register={register} attributes={attributes} watch={watch} setValue={setValue} errors={errors} />}
              {type === 'clubs' && <ClubFields register={register} attributes={attributes} watch={watch} setValue={setValue} errors={errors} />}
              {type === 'essences' && <EssenceFields register={register} statusEffects={statusEffects} watch={watch} setValue={setValue} errors={errors} />}
              {type === 'attributes' && <AttributeFields register={register} watch={watch} setValue={setValue} errors={errors} />}
              {type === 'status' && <StatusEffectFields register={register} watch={watch} setValue={setValue} errors={errors} />}
            </div>

            <div className="pt-2">
              <InputGroup label="Dossiê Narrativo (Descrição)" >
                <div className="relative group">
                  {/* 1. ÍCONE TÁTICO: BOOKOPEN */}
                  <div className="absolute left-6 top-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 pointer-events-none z-10">
                    <BookOpen size={20} strokeWidth={2.5} />
                  </div>

                  <textarea
                    {...register('description')}
                    rows={4}
                    // pl-16 para dar espaço confortável ao ícone
                    className={`${textareaBaseClass} pl-16 pr-10 bg-stone-100/30 group-focus-within:bg-white`}
                    placeholder={
                      "Descreva as propriedades técnicas ou a origem deste ativo no Nexus..."
                    }
                  />

                  {/* 2. LED DE SINCRONIA ATIVA (Top Right) */}
                  <div className="absolute right-7 top-7 w-1.5 h-1.5 rounded-full bg-stone-300 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_10px_#6366f1] transition-all duration-300" />
                </div>
              </InputGroup>
            </div>
          </div>
        </form>

        {/* FOOTER DE AÇÃO */}
        <footer className="px-8 py-8 bg-stone-50 border-t border-stone-200/60 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onClose}
            className="order-2 sm:order-1 px-8 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
          >
            Abortar_Protocolo
          </button>

          <button
            form="vault-form"
            disabled={isSubmitting}
            className="order-1 sm:order-2 flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Save size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Confirmar_Sincronia</span>
              </>
            )}
          </button>
        </footer>
      </motion.div>
    </div>,
    document.body
  );
};