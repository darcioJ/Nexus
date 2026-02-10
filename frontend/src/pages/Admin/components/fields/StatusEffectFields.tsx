import { Zap, Settings, ShieldCheck } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { ColorInput } from '../../../../components/common/ColorInput';

import {
  textareaBaseClass
} from '../../../../config/vault.config';
import { CategorySelector } from '../../../../components/common/CategorySelector';
import { AttributeSelector } from '../../../../components/common/AttributeSelector';

export const StatusEffectFields = ({ register, watch, attributes, setValue, errors }) => {
  return (
    <>
      {/* 1. CLASSIFICAÇÃO SISTÊMICA (Módulos de Frequência) */}
      <div className="col-span-2">
        <InputGroup
          label="Natureza da Sincronia"
          icon={<Zap size={14} className="text-blue-500" />}
          error={errors?.category}
        >
          <CategorySelector
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </InputGroup>
      </div>

      {/* 2. PROTOCOLO DE DEFESA (Módulos de Resistência Dinâmicos) */}
      <div className="col-span-2">
        <InputGroup
          label="Módulos de Resistência"
          icon={<ShieldCheck size={14} className="text-blue-500" />}
          error={errors?.resistance}
        >
          <AttributeSelector
            attributes={attributes}
            watch={watch}
            setValue={setValue}
            register={register}
          />
        </InputGroup>
      </div>

      {/* 3. ASSINATURA VISUAL (Ícone) */}
      <div className="z-50">
        <InputGroup label="Seletor de Ícone (Lucide)">
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>

      {/* 4. REFRAÇÃO CROMÁTICA (Cor) */}
      <InputGroup label="Seletor de Cor (Status)">
        <ColorInput
          register={register}
          watch={watch}
          setValue={setValue}
          name="colorVar"
        />
      </InputGroup>

      {/* 5. PROTOCOLO DE EXECUÇÃO (Mecânica) */}
      <div className="col-span-2">
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
      </div>
    </>
  );
};