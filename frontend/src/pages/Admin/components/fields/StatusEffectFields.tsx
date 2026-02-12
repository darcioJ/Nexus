import { Zap, Settings, ShieldCheck, Terminal } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { ColorInput } from '../../../../components/common/ColorInput';
import { LogicInput } from '../../../../components/common/LogicInput';

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

      {/* 5. PROTOCOLO DE EXECUÇÃO (Terminal Lógico) */}
      <div className="col-span-2">
        <InputGroup
          label="Mecânica de Execução (Logic Script)"
          icon={<Settings size={14} className="text-blue-500" />}
        >
          <LogicInput
            name="mechanic"
            register={register}
            watch={watch}
            setValue={setValue}
            placeholder="Descreva a lógica do efeito..."
          />
        </InputGroup>
      </div>
    </>
  );
};