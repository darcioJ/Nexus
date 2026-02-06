import { InputGroup } from '../InputGroup';

export const WeaponFields = ({ register, essences }: any) => {
  return (
    <>
      {/* 1. CLASSIFICAÇÃO TÉCNICA */}
      <InputGroup label="Classe de Artefato (Sub-tipo)">
        <input
          {...register('typeLabel')}
          className="nexus-input-high"
          placeholder="ex: Efígie Onírica, Lâmina de Plasma"
        />
      </InputGroup>

      <InputGroup label="Alcance Operacional">
        <select {...register('range')} className="nexus-select-high">
          <option value="Curto">Curto (Corpo a Corpo)</option>
          <option value="Médio">Médio (Arremesso/Lança)</option>
          <option value="Longo">Longo (Projéteis/Distância)</option>
        </select>
      </InputGroup>

      {/* 2. SINTONIA ELEMENTAL (Full Width) */}
      <div className="col-span-2">
        <InputGroup label="Sintonia de Essência (Núcleo de Poder)">
          <select {...register('essenceId')} className="nexus-select-high">
            <option value="">Física (Sem Vínculo Elemental)</option>
            {essences.map((e: any) => (
              <option key={e._id} value={e._id}>
                {e.name} — [{e.category}]
              </option>
            ))}
          </select>
        </InputGroup>
      </div>

      {/* 3. NOTAS DE CAMPO (Ajustado para textos técnicos como os das Asas de Raziel) */}
      <div className="col-span-2">
        <InputGroup label="Propriedades Especiais & Sinergias">
          <textarea
            {...register('specialNotes')}
            rows={3}
            className="nexus-textarea-high"
            placeholder="ex: MOBILIDADE: Permite voo... SINERGIA: Escala com..."
          />
        </InputGroup>
      </div>
    </>
  );
};