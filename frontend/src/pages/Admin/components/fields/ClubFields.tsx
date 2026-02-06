import { InputGroup } from '../InputGroup';

export const ClubFields = ({ register, attributes }: any) => {
  return (
    <>
      {/* 1. MECÂNICA DE BÔNUS */}
      <InputGroup label="Atributo de Vínculo">
        <select {...register('bonus.attributeKey')} className="nexus-select-high">
          <option value="">Nenhum Atributo</option>
          {attributes.map((a: any) => (
            <option key={a.key} value={a.key}>
              {a.name}
            </option>
          ))}
        </select>
      </InputGroup>

      <InputGroup label="Valor do Bônus">
        <input 
          {...register('bonus.value', { valueAsNumber: true })} 
          type="number" 
          className="nexus-input-high" 
          placeholder="ex: 1" 
        />
      </InputGroup>

      {/* 2. IDENTIDADE VISUAL */}
      <InputGroup label="Ícone (Lucide Name)">
        <input 
          {...register('iconName')} 
          className="nexus-input-high" 
          placeholder="ex: Shield, Users, Tentacle" 
        />
      </InputGroup>

      <InputGroup label="CSS Color Var">
        <input 
          {...register('colorVar')} 
          className="nexus-input-high" 
          placeholder="ex: --color-emerald-500" 
        />
      </InputGroup>

      {/* 3. CLASSIFICAÇÃO DE LORE */}
      <div className="col-span-2">
        <InputGroup label="Tipo de Afiliação (Tag de Interface)">
          <input 
            {...register('typeLabel')} 
            className="nexus-input-high" 
            placeholder="ex: Ordem Secreta, Clã de Mercenários" 
          />
        </InputGroup>
      </div>
    </>
  );
};