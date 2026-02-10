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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8">
      {/* OVERLAY PRISMÁTICO */}
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/10 backdrop-blur-2xl"
      />

      {/* MODAL CERÂMICO (PRISMA CHASSIS) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative bg-white/80 w-full max-w-3xl max-h-[92vh] rounded-[4rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden border border-white"
      >
        
        {/* ENGINE DE REFRAÇÃO (BLOOMS DE COR) */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none" />

        {/* HEADER DO DOSSIÊ (CERÂMICA POLIDA) */}
        <header className="relative px-10 pt-12 pb-6 flex justify-between items-start z-10 bg-white/40 backdrop-blur-xl border-b border-white/50">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-20 h-20 rounded-[2.2rem] bg-white border border-white flex items-center justify-center text-indigo-500 shadow-sm transition-transform group-hover:scale-105">
                <config.icon size={36} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint size={12} className="text-indigo-400" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] font-mono">
                  Registry_Protocol_v2.06
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-3xl tracking-tight leading-none">
                {initialData ? 'Sincronizar' : 'Forjar'} <span className="text-indigo-500/80">{config.label}</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 hover:bg-rose-50 hover:text-rose-400 rounded-full shadow-sm transition-all active:scale-90 group"
          >
            <X size={22} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </header>

        {/* ÁREA DO FORMULÁRIO (CHASSIS INTERNO) */}
        <form
          id="vault-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-10 py-8 space-y-10 scrollbar-hide"
        >
          {initialData?._id && <input type="hidden" {...register('_id')} />}

          {/* SEÇÃO: IDENTIDADE TÁTICA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <InputGroup label="Key de identificação" icon={<Key size={14} className="text-indigo-400"/>}>
              <div className="relative">
                <input
                  {...register('key', { required: true })}
                  className={`${inputBaseClass} !bg-white/40`}
                  placeholder="protocolo_zero"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-200 group-focus-within:bg-indigo-400" />
              </div>
            </InputGroup>

            <InputGroup label="Designação pública" icon={<Tag size={14} className="text-emerald-400"/>}>
              <div className="relative">
                <input
                  {...register('name', { required: true })}
                  className={`${inputBaseClass} !bg-white/40`}
                  placeholder="Nome do ativo no sistema"
                />
              </div>
            </InputGroup>
          </div>

          {/* HARDWARE SLOT (CAMPOS DINÂMICOS) */}
          <div className="relative p-10 bg-slate-50/40 rounded-[3.5rem] border border-white/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {type === 'weapons' && <WeaponFields register={register} essences={essences} setValue={setValue} watch={watch} errors={errors} />}
              {type === 'archetypes' && <ArchetypeFields register={register} attributes={attributes} watch={watch} setValue={setValue} errors={errors} />}
              {type === 'clubs' && <ClubFields register={register} attributes={attributes} watch={watch} setValue={setValue} errors={errors} />}
              {type === 'essences' && <EssenceFields register={register} statusEffects={statusEffects} watch={watch} setValue={setValue} errors={errors} />}
              {type === 'attributes' && <AttributeFields register={register} watch={watch} setValue={setValue} errors={errors} />}
              {type === 'status' && <StatusEffectFields register={register} watch={watch} setValue={setValue} errors={errors} />}
            </div>

            <div className="pt-4">
              <InputGroup label="Dossiê narrativo" icon={<BookOpen size={14} className="text-slate-400"/>}>
                <textarea
                  {...register('description')}
                  rows={4}
                  className={`${textareaBaseClass} !bg-white/40 !rounded-[2rem]`}
                  placeholder="Descreva as propriedades técnicas ou a origem deste ativo no Nexus..."
                />
              </InputGroup>
            </div>
          </div>
        </form>

        {/* FOOTER DE AÇÃO (MODAL DOCK) */}
        <footer className="px-10 py-10 bg-white/40 backdrop-blur-xl border-t border-white/50 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="order-2 sm:order-1 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-rose-400 transition-colors"
          >
            Abortar
          </button>

          <button
            form="vault-form"
            disabled={isSubmitting}
            className="group relative order-1 sm:order-2 flex-1 w-full h-16 rounded-[2rem] overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {/* Gradiente de Ação */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 transition-transform duration-500 group-hover:scale-105" />
            
            <div className="relative flex items-center justify-center gap-3 text-white">
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} className="group-hover:rotate-12 transition-transform duration-500" />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em]">Sincronizar</span>
                </>
              )}
            </div>
          </button>
        </footer>

        {/* LINHA DE CRISTAL SUPERIOR */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent z-50" />
      </motion.div>
    </div>,
    document.body
  );
};