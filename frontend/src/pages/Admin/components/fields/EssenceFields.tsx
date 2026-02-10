import { Crosshair, LinkIcon, Activity } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { ColorInput } from '../../../../components/common/ColorInput';
import { IconInput } from '../../../../components/common/IconInput';
import { CategorySelector } from '../../../../components/common/CategorySelector';

import {
  inputBaseClass
} from '../../../../config/vault.config';
import { StatusSelector } from '../../../../components/common/StatusSelector';

export const EssenceFields = ({ register, statusEffects, watch, setValue, errors }: any) => {
  return (
    <>
      {/* --- SEÇÃO 01: MATRIZ TÉCNICA (CATEGORIA E VANTAGEM) --- */}

      {/* Categoria */}
      <div className="col-span-2">
        <InputGroup label="Setor de Categoria" error={errors?.category}>
          <CategorySelector
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </InputGroup>
      </div>

      {/* Vantagem Tática */}
      <div className='col-span-2'>
        <InputGroup label="Vantagem Tática (VS)" error={errors?.advantageAgainst}>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
              <Crosshair size={18} strokeWidth={2.5} />
            </div>
            <input
              {...register('advantageAgainst', { required: "Obrigatório" })}
              className={`${inputBaseClass} pl-12 pr-10`}
              placeholder="ex.: Humanos, Demônios, Aquáticos..."
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500/20 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_8px_#6366f1] transition-all" />
          </div>
        </InputGroup>
      </div>

      {/* --- SEÇÃO 02: IDENTIDADE VISUAL (LADO A LADO) --- */}

      <div className="z-50">
        <InputGroup label="Ícone Representativo">
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>

      <InputGroup label="Aura Cromática">
        <ColorInput
          register={register}
          watch={watch}
          setValue={setValue}
          name="colorVar"
        />
      </InputGroup>

      {/* --- SEÇÃO 03: VÍNCULO DE STATUS (FULL WIDTH) --- */}

      {/* 3. VÍNCULO DE STATUS (Módulos de Efeito Cromático) */}
      <div className="col-span-2">
        <InputGroup
          label="Status Effect Vinculado"
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