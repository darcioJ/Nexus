import { InputGroup } from '../InputGroup';

export const StatusEffectFields = ({ register }: any) => {
  return (
    <>
      {/* 1. CLASSIFICAÇÃO SISTÊMICA */}
      <InputGroup label="Natureza do Efeito (Type)">
        <select {...register('type')} className="nexus-select-high">
          <option value="ELEMENTAL">Elemental</option>
          <option value="FÍSICO">Físico</option>
          <option value="MENTAL">Mental</option>
          <option value="MÁGICO">Mágico / Arcano</option>
          <option value="BIOLÓGICO">Biológico / Veneno</option>
        </select>
      </InputGroup>

      {/* Resistência como Input de Texto para aceitar casos como "Força ou Calor" */}
      <InputGroup label="Protocolo de Resistência">
        <input 
          {...register('resistance')} 
          className="nexus-input-high" 
          placeholder="ex: Força (FOR) ou Calor Ambiental" 
        />
      </InputGroup>

      {/* 2. IDENTIDADE VISUAL */}
      <div className="col-span-2">
        <InputGroup label="Ícone Representativo (Lucide Name)">
          <input 
            {...register('iconName')} 
            className="nexus-input-high" 
            placeholder="ex: Snowflake, Thermometer, Zap" 
          />
        </InputGroup>
      </div>

      {/* 3. DESCRIÇÃO DE LORE (Flavor Text) */}
      {/* O parent já lida com 'mechanic', então adicionamos a 'description' aqui */}
      <div className="col-span-2">
        <InputGroup label="Dossiê Narrativo (Lore)">
          <textarea 
            {...register('description')} 
            rows={2} 
            className="nexus-textarea-high" 
            placeholder="Descreva a sensação ou a origem visual do efeito..." 
          />
        </InputGroup>
      </div>
    </>
  );
};