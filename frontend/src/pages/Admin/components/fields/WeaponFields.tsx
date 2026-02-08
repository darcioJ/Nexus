import { Target, ChevronDown, Zap, Crosshair } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { ModuleInput } from '../../../../components/common/ModuleInput'

import { inputBaseClass, selectBaseClass } from '../../../../config/vault.config';

export const WeaponFields = ({ register, essences, setValue, watch, errors }: any) => {

  const notes = watch('specialNotes') || [{ category: 'SINERGIA', content: '' }];

  return (
    <>
      {/* --- ESPECIFICAÇÕES TÉCNICAS --- */}
      <InputGroup label="Classe do Artefato (Sub-tipo)" error={errors?.typeLabel}>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
            <Zap size={18} strokeWidth={2} />
          </div>
          <input
            {...register('typeLabel', { required: "Obrigatório" })}
            className={`${inputBaseClass} pl-12`}
            placeholder="Ex: Lâmina de Plasma, Efígie Onírica..."
          />
        </div>
      </InputGroup>

      <InputGroup label="Alcance Operacional" error={errors?.range}>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
            <Crosshair size={18} strokeWidth={2} />
          </div>
          <select
            {...register('range', { required: "Obrigatório" })}
            className={`${selectBaseClass} pl-12 appearance-none`}
          >
            <option value="Curto">Curto (Corpo a Corpo)</option>
            <option value="Médio">Médio (Arremesso)</option>
            <option value="Longo">Longo (Projéteis)</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <ChevronDown size={16} />
          </div>
        </div>
      </InputGroup>

      <InputGroup label="Sintonia de Essência (Núcleo)" error={errors?.essenceId}>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-500 transition-colors z-10">
            <Target size={18} strokeWidth={2} />
          </div>
          <select
            {...register('essenceId', { required: "Obrigatório" })}
            className={`${selectBaseClass} pl-12 appearance-none`}
          >
            <option value="">Física (Sem Vínculo Elemental)</option>
            {essences.map((e: any) => (
              <option key={e._id} value={e._id}>{e.name} — {e.category}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <ChevronDown size={16} />
          </div>
        </div>
      </InputGroup>

      <div className="col-span-2 pt-6 border-t border-slate-100">
        <ModuleInput
          value={notes}
          onChange={(newNotes) => setValue('specialNotes', newNotes, { shouldDirty: true })}
        />
      </div>
    </>
  );
};