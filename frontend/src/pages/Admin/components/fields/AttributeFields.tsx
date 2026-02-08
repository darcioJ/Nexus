import { Hash, Binary, Zap, Info } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { ColorInput } from '../../../../components/common/ColorInput';
import { inputBaseClass } from '../../../../config/vault.config';

export const AttributeFields = ({ register, watch, setValue, errors }: unknown) => {
  return (
    <>

      {/* --- HEADER TÉCNICO --- */}
      <div className="col-span-2 flex items-center gap-3 opacity-60 mb-2">
        <Info size={12} className="text-indigo-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Núcleo de Processamento
        </span>
        <div className="h-px flex-1 bg-linear-to-r from-slate-100 to-transparent" />
      </div>

      {/* Título do Modificador: Agora ocupa a largura total para destaque */}
      <div className="col-span-2">
        <InputGroup
          label="Título do Modificador (Interface)"
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

      {/* Divisor: Ocupa apenas metade, permitindo expansão futura ou equilíbrio visual */}
      <div className="col-span-1">
        <InputGroup
          label="Divisor de Bio-Mod"
          error={errors?.modDiv}
        >
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
              <Binary size={18} strokeWidth={2.5} />
            </div>
            <input
              {...register('modDiv', { required: "Obrigatório", valueAsNumber: true })}
              type="number"
              step="0.5"
              className={`${inputBaseClass} pl-12 font-mono text-center pr-16`}
              placeholder="2.0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-slate-100 rounded text-[7px] font-black text-slate-400 uppercase">
              DIV_NODE
            </div>
          </div>
        </InputGroup>
      </div>

      {/* Espaço vazio para manter o equilíbrio ou para uma futura descrição curta */}
      <div className="col-span-1 flex items-end pb-3">
        <p className="text-[9px] text-slate-400 font-bold leading-tight italic">
          * Define a razão de cálculo para bônus derivados.
        </p>
      </div>

      <div className="z-50">
        <InputGroup label="Ícone Representativo" >
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

    </>
  );
};