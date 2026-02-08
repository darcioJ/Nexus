import { Zap, Activity, Settings, ChevronDown, Sparkles, Palette } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { ColorInput } from '../../../../components/common/ColorInput';

import {
  inputBaseClass,
  selectBaseClass,
  textareaBaseClass,
  categories
} from '../../../../config/vault.config';

export const StatusEffectFields = ({ register, watch, setValue, errors }: any) => {
  return (
    <>
      {/* 1. CLASSIFICAÇÃO SISTÊMICA (Natureza) */}
      <InputGroup label="Natureza do Efeito (Category)" error={errors?.category}>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 z-10">
            <Zap size={18} strokeWidth={2.5} />
          </div>

          <select
            {...register('category', { required: "Obrigatório" })}
            className={`${selectBaseClass} pl-12`}
          >
            <option value="" disabled selected>Selecionar categoria...</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-focus-within:opacity-100">
            <ChevronDown size={16} />
          </div>
        </div>
      </InputGroup>

      {/* 2. PROTOCOLO DE DEFESA (Resistência) */}
      <InputGroup label="Protocolo de Resistência" error={errors?.resistance}>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 z-10">
            <Activity size={18} strokeWidth={2.5} />
          </div>

          <input
            {...register('resistance', { required: "Obrigatório" })}
            className={`${inputBaseClass} pl-12 italic`}
            placeholder="ex.: Vitalidade, Força, Agilidade..."
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500/20 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_8px_#6366f1] transition-all" />
        </div>
      </InputGroup>

      {/* 3. ASSINATURA VISUAL (Ícone) */}
      <div className="span-col-2 z-50">
        <InputGroup label="Sinalizador Visual (Lucide Node)">
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>

      {/* 4. REFRAÇÃO CROMÁTICA (Cor) */}
      <InputGroup label="Aura Cromática (Status Color)">
        <ColorInput
          register={register}
          watch={watch}
          setValue={setValue}
          name="colorVar"
        />
      </InputGroup>

      {/* 5. PROTOCOLO DE EXECUÇÃO (Mecânica) */}
      <InputGroup label="Mecânica do Efeito (Mechanic)" >
        <div className="relative group">
          {/* 1. ÍCONE TÁTICO: BOOKOPEN */}
          <div className="absolute left-6 top-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 pointer-events-none z-10">
            <Settings size={20} strokeWidth={2.5} />
          </div>

          <textarea
            {...register('mechanic')}
            rows={4}
            // pl-16 para dar espaço confortável ao ícone
            className={`${textareaBaseClass} pl-16 pr-10 bg-stone-100/30 group-focus-within:bg-white`}
            placeholder="ex.: -2 HP por turno. Redução de 50% de..."
          />

          {/* 2. LED DE SINCRONIA ATIVA (Top Right) */}
          <div className="absolute right-7 top-7 w-1.5 h-1.5 rounded-full bg-stone-300 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_10px_#6366f1] transition-all duration-300" />
        </div>
      </InputGroup>
    </>
  );
};