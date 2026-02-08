import { Shield, Zap, ChevronDown, Activity } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { inputBaseClass, selectBaseClass } from '../../../../config/vault.config';

export const ClubFields = ({ register, attributes, setValue, watch }: any) => {
  return (
    <>

      <div className="col-span-2 z-50">
        <InputGroup label="Ícone de Identificação (Lucide Node)">
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>


      {/* Seletor de Atributo */}
      <InputGroup label="Atributo de Vínculo">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <select
            {...register('bonus.attributeId', { required: "Obrigatório" })}
            className={`${selectBaseClass} pl-12 italic tracking-tighter`}
          >
            <option value="" disabled selected>Selecionar atributo...</option>
            {attributes?.map((a: any) => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.name.slice(0, 3).toUpperCase()})
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-focus-within:opacity-100 transition-opacity">
            <ChevronDown size={16} />
          </div>
        </div>
      </InputGroup>

      {/* Magnitude do Bônus */}
      <InputGroup label="Magnitude (Bônus)">
        <div className="relative group">
          <input
            {...register('bonus.value', {
              required: "Obrigatório",
              valueAsNumber: true
            })}
            type="number"
            className={`${inputBaseClass} text-center font-mono pr-16`}
            placeholder="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[8px] uppercase tracking-widest text-indigo-500/40">
            PTS_MOD
          </div>
        </div>
      </InputGroup>

      {/* Info Técnica de Rodapé */}
      <div className="p-4 col-span-2 bg-slate-50/50 rounded-2xl border border-slate-100">
        <p className="text-[9px] text-slate-400 font-bold leading-tight italic uppercase tracking-wider text-center">
          * O bônus selecionado será injetado automaticamente na ficha do player ao ingressar no clube.
        </p>
      </div>
    </>
  );
};