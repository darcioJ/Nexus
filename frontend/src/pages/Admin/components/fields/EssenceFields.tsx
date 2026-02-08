import { Layers, Crosshair, Dna, Zap, Sparkles, ChevronDown, Box } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { ColorInput } from '../../../../components/common/ColorInput';
import { IconInput } from '../../../../components/common/IconInput';

import {
  inputBaseClass,
  selectBaseClass,
  categories
} from '../../../../config/vault.config';

export const EssenceFields = ({ register, statusEffects, watch, setValue, errors }: any) => {
  return (
    <>
      {/* --- SEÇÃO 01: MATRIZ TÉCNICA (CATEGORIA E VANTAGEM) --- */}

      {/* Categoria */}
      <InputGroup label="Setor de Essência" error={errors?.category}>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
            <Box size={18} strokeWidth={2.5} />
          </div>
          <select
            {...register('category', { required: "Obrigatório" })}
            className={`${selectBaseClass} pl-12 italic tracking-tighter`}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-focus-within:opacity-100">
            <ChevronDown size={16} />
          </div>
        </div>
      </InputGroup>

      {/* Vantagem Tática */}
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

      {/* --- SEÇÃO 02: IDENTIDADE VISUAL (LADO A LADO) --- */}

      <div className="col-span-2 z-50">
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

      <InputGroup label="Status Effect Vinculado" error={errors?.statusId}>
        <select
          {...register('statusId', { required: "Obrigatório" })}
          className={`${selectBaseClass}`}
        >
          <option value="" disabled>Selecione um status...</option>
          {statusEffects.map((status: any) => (
            <option key={status._id} value={status._id}>
              {status.name} — {status.category}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-focus-within:opacity-100 transition-opacity">
          <ChevronDown size={16} />
        </div>
      </InputGroup>

      <div className="col-span-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <p className="text-[9px] text-slate-400 font-bold leading-tight italic uppercase tracking-wider text-center">
          * Este efeito será aplicado automaticamente a qualquer armamento forjado com esta essência.
        </p>
      </div>
    </>
  );
};