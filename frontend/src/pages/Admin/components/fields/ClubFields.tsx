import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { inputBaseClass } from '../../../../config/vault.config';
import { AttributeSelector } from '../../../../components/common/AttributeSelector';

export const ClubFields = ({ register, attributes, setValue, watch }) => {
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
      <div className="col-span-2">
        <InputGroup label="Atributo de Vínculo">
          <AttributeSelector
            attributes={attributes}
            watch={watch}
            setValue={setValue}
            register={register}
            name="bonus.attributeId"
            max={1}
            sendId={true}
          />
        </InputGroup>
      </div>

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
      <div className="p-4 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
        <p className="text-[9px] text-slate-400 font-bold leading-tight italic tracking-wider text-center">
          * O bônus selecionado será injetado automaticamente na ficha do player ao ingressar no clube.
        </p>
      </div>
    </>
  );
};