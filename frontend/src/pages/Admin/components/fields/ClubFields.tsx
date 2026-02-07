import * as LucideIcons from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';

import { inputBaseClass, selectBaseClass } from '../../../../config/vault.config';

export const ClubFields = ({ register, attributes, setValue, watch }: any) => {

  return (
    <>
      {/* 1. IDENTIDADE VISUAL: SELETOR DE ÍCONE (Prisma Lux) */}
      <div className="col-span-2">
        <InputGroup label="Ícone Representativo (Lucide)">
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>

      {/* 2. MECÂNICA DE BÔNUS (Módulo Esquerdo) */}
      <InputGroup label="Atributo de Vínculo">
        <div className="relative">
          <select {...register('bonus.attributeKey')} className={selectBaseClass}>
            <option value="">Nenhum Atributo</option>
            {attributes.map((a: any) => (
              <option key={a.key} value={a.key}>
                {a.name}
              </option>
            ))}
          </select>
          {/* Seta customizada para o select */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <LucideIcons.ChevronDown size={16} />
          </div>
        </div>
      </InputGroup>

      <InputGroup label="Magnitude (Bônus)">
        <div className="relative">
          <input
            {...register('bonus.value', { valueAsNumber: true })}
            type="number"
            className={`${inputBaseClass} pr-12`}
            placeholder="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] font-black text-indigo-600/40">
            PTS
          </div>
        </div>
      </InputGroup>
    </>
  );
};