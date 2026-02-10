import { Hash, Binary, Zap, Info, Palette } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { ColorInput } from '../../../../components/common/ColorInput';
import { inputBaseClass } from '../../../../config/vault.config';

export const AttributeFields = ({ register, watch, setValue, errors }: unknown) => {
  return (
    <>
      {/* Título do Modificador: Agora ocupa a largura total para destaque */}
      <div className="col-span-2">
        <InputGroup
          label="Título do Modificador (Interface)"
          icon={<Zap size={14} className="text-blue-500" />}
          error={errors?.modLabel}
        >
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
              <Hash size={18} strokeWidth={2.5} />
            </div>
            <input
              {...register('modLabel', { required: "Obrigatório" })}
              className={`${inputBaseClass} pl-12 italic tracking-tight text-sm lg:text-base`}
              placeholder="ex.: Dano Físico, Força, Agilidade..."
            />
          </div>
        </InputGroup>
      </div>

      {/* Divisor: Módulo de Processamento de Grandeza */}
      <InputGroup
        label="Divisor de Bio-Mod"
        icon={<Binary size={14} className="text-blue-500" />}
        error={errors?.modDiv}
      >
        <div className="relative group">
          {/* ÍCONE DE OPERAÇÃO BINÁRIA */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors duration-300 z-10">
            <Binary size={18} strokeWidth={2.5} />
          </div>

          <input
            {...register('modDiv', {
              required: "Obrigatório",
              valueAsNumber: true,
              min: { value: 1, message: "Mínimo: 1" }
            })}
            type="number"
            step="0.5"
            min="1" // Proteção nativa do browser
            className={`
          ${inputBaseClass} !pl-12 !pr-24 font-mono text-center text-xs font-bold
          !bg-white/60 border-white shadow-inner group-focus-within:bg-white transition-all
        `}
            placeholder="1.0"
          />

          {/* ETIQUETA DE INDEXAÇÃO DE HARDWARE */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <div className="w-px h-4 bg-slate-100" />
            <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">
              DIV_NODE
            </span>
          </div>

          {/* INDICADOR DE STATUS (LED) */}
          <div className={`
        absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-500
        ${errors?.modDiv ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-slate-100 group-focus-within:bg-blue-500'}
      `} />
        </div>
      </InputGroup>

      {/* Espaço vazio para manter o equilíbrio ou para uma futura descrição curta */}
      <div className="flex items-center justify-center">
        <p className="text-[9px] text-slate-400 font-bold leading-tight italic">
          * Define a razão de cálculo para bônus derivados.
        </p>
      </div>

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

    </>
  );
};