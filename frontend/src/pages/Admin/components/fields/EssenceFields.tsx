import { Crosshair, LinkIcon, Zap, Info, Palette } from 'lucide-react';
import { InputGroup } from '../InputGroup';

import { ColorInput } from '../../../../components/common/ColorInput';
import { IconInput } from '../../../../components/common/IconInput';
import { CategorySelector } from '../../../../components/common/CategorySelector';
import { StatusSelector } from '../../../../components/common/StatusSelector';
import { TagInput } from '../../../../components/common/TagInput';

export const EssenceFields = ({ register, statusEffects, watch, setValue, errors }) => {
  return (
    <>
      {/* --- SEÇÃO 01: MATRIZ TÉCNICA (CATEGORIA E VANTAGEM) --- */}

      {/* Categoria */}
      <div className="col-span-2">
        <InputGroup label="Setor de Categoria" error={errors?.category} icon={<Zap size={14} className="text-blue-500" />} >
          <CategorySelector
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </InputGroup>
      </div>

      {/* Vantagem Tática */}
      <div className='col-span-2'>
        <InputGroup label="Vantagem Tática (VS)" error={errors?.advantageAgainst} icon={<Crosshair size={14} className="text-blue-500" />} >
          <TagInput
            name="advantageAgainst"
            icon={<Crosshair size={18} strokeWidth={2.5} />}
            register={register}
            watch={watch}
            setValue={setValue}
            placeholder="ex.: Humanos, Demônios..."
          />
        </InputGroup>
      </div>

      {/* --- SEÇÃO 02: IDENTIDADE VISUAL (LADO A LADO) --- */}

      <div className="z-50">
        <InputGroup label="Ícone Representativo" icon={<Info size={14} className="text-blue-500" />}>
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>

      <InputGroup label="Aura Cromática" icon={<Palette size={14} className="text-blue-500" />} >
        <ColorInput
          register={register}
          watch={watch}
          setValue={setValue}
          name="colorVar"
        />
      </InputGroup >

      {/* --- SEÇÃO 03: VÍNCULO DE STATUS (FULL WIDTH) --- */}

      {/* 3. VÍNCULO DE STATUS (Módulos de Efeito Cromático) */}
      <div className="col-span-2">
        <InputGroup
          label="Status Vinculado"
          icon={<LinkIcon size={14} className="text-blue-500" />}
          error={errors?.statusId}
        >
          <StatusSelector statusEffects={statusEffects} watch={watch} setValue={setValue} register={register} />
        </InputGroup>
      </div>

      <div className="col-span-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <p className="text-[9px] text-slate-400 font-bold leading-tight italic uppercase tracking-wider text-center">
          * Este efeito será aplicado automaticamente a qualquer armamento forjado com esta essência.
        </p>
      </div>
    </>
  );
};