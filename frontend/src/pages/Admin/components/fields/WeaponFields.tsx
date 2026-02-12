import { Target, ChevronDown, Zap, Crosshair } from 'lucide-react';
import { InputGroup } from '../../../../components/common/InputGroup';
import { ModuleInput } from '../../../../components/common/ModuleInput'

import { inputBaseClass, selectBaseClass } from '../../../../config/vault.config';
import { RangeSelector } from '../../../../components/common/RangeSelector';
import { EssenceSelector } from '../../../../components/common/EssenceSelector';

export const WeaponFields = ({ register, essences, setValue, watch, errors }: any) => {

  const notes = watch('specialNotes') || [{ category: 'SINERGIA', content: '' }];

  return (
    <>
      {/* --- ESPECIFICAÇÕES TÉCNICAS --- */}
      <div className="col-span-2">
        <InputGroup label="Classe do Artefato (Sub-tipo)" icon={<Target size={14} className="text-blue-500" />} error={errors?.typeLabel}>
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
      </div>

      <div className="col-span-2">
        <InputGroup label="Alcance Operacional" icon={<Crosshair size={14} className="text-blue-500" />} error={errors?.range}>
          <RangeSelector register={register} watch={watch} setValue={setValue} />
        </InputGroup>
      </div>

      <div className="col-span-2">
        <InputGroup label="Sintonia de Essência (Núcleo)" icon={<Zap size={14} className="text-blue-500" />} error={errors?.essenceId}>
          <EssenceSelector essences={essences} watch={watch} setValue={setValue} register={register} />
        </InputGroup>
      </div>

      <div className="col-span-2">
        <InputGroup label='Detalhes (Special Notes)' icon={<Zap size={14} className="text-blue-500" />} error={errors?.specialNotes}>
          <ModuleInput
            value={notes}
            onChange={(newNotes) => setValue('specialNotes', newNotes, { shouldDirty: true })}
          />
        </InputGroup>
      </div>
    </>
  );
};