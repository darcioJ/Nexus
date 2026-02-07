import { Hash, Type, Binary, AlignLeft } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { ColorInput } from '../../../../components/common/ColorInput';

// Importação das classes globais do Prisma Nexus
import { inputBaseClass } from '../../../../config/vault.config';

export const AttributeFields = ({ register, watch, setValue }: any) => {
  return (
    <>
      {/* 1. CONFIGURAÇÃO TÉCNICA (Abreviação e Divisor) */}
      <InputGroup label="Abreviação (Label)">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
            <Type size={18} strokeWidth={2.5} />
          </div>
          <input
            {...register('label', { required: true })}
            className={`${inputBaseClass} pl-12`}
            placeholder="ex: FOR, INT, DES"
          />
        </div>
      </InputGroup>

      <InputGroup label="Divisor de Modificador">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
            <Binary size={18} strokeWidth={2.5} />
          </div>
          <input
            {...register('modDiv', { valueAsNumber: true })}
            type="number"
            step="0.5"
            className={`${inputBaseClass} pl-12`}
            placeholder="ex: 2"
          />
        </div>
      </InputGroup>

      {/* 2. EXIBIÇÃO DE INTERFACE */}
      <div className="col-span-2">
        <InputGroup label="Título do Modificador (Display)">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
              <Hash size={18} strokeWidth={2.5} />
            </div>
            <input
              {...register('modLabel')}
              className={`${inputBaseClass} pl-12`}
              placeholder="ex: Bônus de Força, Mod. Intelecto"
            />
          </div>
        </InputGroup>
      </div>

      {/* 3. IDENTIDADE VISUAL (FULL WIDTH) */}
      <div className="col-span-2">
        <InputGroup label="Assinatura Visual (Ícone Lucide)">
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>

      <div className="col-span-2">
        <InputGroup label="Assinatura Cromática (Refração)">
          <ColorInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="colorVar"
          />
        </InputGroup>
      </div>

      {/* 4. DETALHES ADICIONAIS */}
      <div className="col-span-2">
        <InputGroup label="Especificações do Atributo (Details)">
          <div className="relative group">
            <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
              <AlignLeft size={18} strokeWidth={2.5} />
            </div>
            <textarea
              {...register('details')}
              rows={3}
              className={`${inputBaseClass} pl-12 py-3 min-h-[100px] resize-none`}
              placeholder="Descreva as perícias e capacidades afetadas por este atributo..."
            />
          </div>
        </InputGroup>
      </div>
    </>
  );
};