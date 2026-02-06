import { InputGroup } from '../InputGroup';

export const ArchetypeFields = ({ register, attributes }: any) => {
  return (
    <>
      {/* 1. ATRIBUTO E DIFICULDADE */}
      <InputGroup label="Atributo Primário">
        <select {...register('primaryAttr')} className="nexus-select-high">
          <option value="">Selecione o Atributo</option>
          {attributes.map((a: any) => (
            <option key={a.key} value={a.key}>
              {a.name} ({a.label})
            </option>
          ))}
        </select>
      </InputGroup>

      <InputGroup label="Nível de Dificuldade">
        <select {...register('difficulty')} className="nexus-select-high">
          <option value="Iniciante">Iniciante</option>
          <option value="Intermediário">Intermediário</option>
          <option value="Elite">Elite</option>
          <option value="Mestre">Mestre</option>
        </select>
      </InputGroup>

      {/* 2. IDENTIDADE VISUAL (Vital para o VaultCard) */}
      <InputGroup label="Ícone (Lucide Name)">
        <input 
          {...register('iconName')} 
          className="nexus-input-high" 
          placeholder="ex: BookOpen, Zap, Sword..." 
        />
      </InputGroup>

      <InputGroup label="Variável de Cor (CSS)">
        <input 
          {...register('colorVar')} 
          className="nexus-input-high" 
          placeholder="ex: var(--color-indigo-500)" 
        />
      </InputGroup>

      {/* 3. TAGS / ESPECIALIDADES (Ocupa a linha toda) */}
      <div className="col-span-2">
        <InputGroup label="Especializações (Tags separadas por vírgula)">
          <input 
            {...register('specialties')} 
            className="nexus-input-high" 
            placeholder="ex: Suporte, Controle, Buff" 
          />
        </InputGroup>
      </div>
    </>
  );
};