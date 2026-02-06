import { InputGroup } from '../InputGroup';

export const AttributeFields = ({ register }: any) => {
  return (
    <>
      {/* 1. ABREVIAÇÃO E CÁLCULO */}
      <InputGroup label="Abreviação (Label)">
        <input 
          {...register('label', { required: true })} 
          className="nexus-input-high" 
          placeholder="ex: FOR, DES, INT" 
        />
      </InputGroup>

      <InputGroup label="Divisor de Modificador">
        <input 
          {...register('modDiv', { valueAsNumber: true })} 
          type="number" 
          step="0.5" 
          className="nexus-input-high" 
          placeholder="ex: 2" 
        />
      </InputGroup>

      {/* 2. IDENTIDADE VISUAL */}
      <InputGroup label="Ícone (Lucide Name)">
        <input 
          {...register('iconName')} 
          className="nexus-input-high" 
          placeholder="ex: Dna, Zap, Brain" 
        />
      </InputGroup>

      <InputGroup label="CSS Color Var">
        <input 
          {...register('colorVar')} 
          className="nexus-input-high" 
          placeholder="ex: --color-strength" 
        />
      </InputGroup>

      {/* 3. CONFIGURAÇÃO DE INTERFACE */}
      <div className="col-span-2">
        <InputGroup label="Título do Modificador (Display)">
          <input 
            {...register('modLabel')} 
            className="nexus-input-high" 
            placeholder="ex: Bônus de Força" 
          />
        </InputGroup>
      </div>
    </>
  );
};