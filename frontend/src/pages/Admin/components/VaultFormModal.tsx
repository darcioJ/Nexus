import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';

// --- INFRAESTRUTURA NEXUS ---
import { useVault } from '../../../hooks/useVault';
import { triggerHaptic } from '../../../utils/triggerHaptic';
import { VAULT_CONFIG, type VaultTab } from '../../../config/vault.config';

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
  const config = VAULT_CONFIG[type as VaultTab];

  // 1. ADICIONADO: watch e setValue extraídos aqui
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting, errors } } = useForm({
    defaultValues: initialData || {}
  });

  const onSubmit = async (data: any) => {
    try {
      triggerHaptic('MEDIUM');
      await config.save(data);
      triggerHaptic('SUCCESS');
      onSuccess();
    } catch (error) {
      triggerHaptic('HEAVY');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }}
        className="relative bg-white w-full max-w-xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white"
      >

        <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <config.icon size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl italic leading-tight">
                {initialData ? 'Sincronizar' : 'Forjar'} {config.label}
              </h3>
              <span className="text-[8px] font-black text-indigo-600/60 uppercase tracking-widest mt-1 block">
                protocolo_nexus_{type}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-xl transition-colors text-slate-300 hover:text-rose-500">
            <X size={20} />
          </button>
        </header>

        <form id="vault-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

          {/* 2. ADICIONADO: Campo oculto para o ID (Essencial para editar) */}
          {initialData?._id && <input type="hidden" {...register('_id')} />}

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Key de Acesso" error={errors.key}>
              <input {...register('key', { required: true })} className="nexus-input-high" placeholder="ex: dark_blade" />
            </InputGroup>
            <InputGroup label="Nome de Exibição" error={errors.name}>
              <input {...register('name', { required: true })} className="nexus-input-high" placeholder="Nome do ativo" />
            </InputGroup>
          </div>

          <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 grid grid-cols-2 gap-5">
            {/* 3. ATUALIZADO: watch e setValue passados para os componentes que precisam de cor */}
            {type === 'weapons' && <WeaponFields register={register} essences={essences} />}
            {type === 'archetypes' && <ArchetypeFields register={register} attributes={attributes} watch={watch} setValue={setValue} />}
            {type === 'clubs' && <ClubFields register={register} attributes={attributes} watch={watch} setValue={setValue} />}
            {type === 'essences' && <EssenceFields register={register} statusEffects={statusEffects} watch={watch} setValue={setValue} />}
            {type === 'attributes' && <AttributeFields register={register} watch={watch} setValue={setValue} />}
            {type === 'status' && <StatusEffectFields register={register} />}

            <div className="col-span-2">
              <InputGroup label="Dossiê / Mecânica">
                <textarea
                  {...register(type === 'status' ? 'mechanic' : 'description')}
                  rows={3}
                  className="nexus-textarea-high"
                  placeholder="Descreva as propriedades técnicas ou lore..."
                />
              </InputGroup>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 bg-white border-t border-slate-50 flex gap-3">
          <button type="button" onClick={onClose} className="px-6 h-12 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">Abortar</button>
          <button form="vault-form" disabled={isSubmitting} className="flex-1 h-12 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Confirmar_Sincronia
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};