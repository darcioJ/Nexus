import * as LucideIcons from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { ColorInput } from '../../../../components/common/ColorInput';

export const EssenceFields = ({ register, statusEffects, watch, setValue }: any) => {
  // Observar valores para o preview em tempo real
  const selectedIcon = watch('iconName');
  
  // Lista de categorias fixas conforme solicitado
  const categories = ['Elemental', 'Corruptora', 'Espiritual'];

  // Componente de ícone dinâmico para o preview
  const IconPreview = ({ name }: { name: string }) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon size={20} strokeWidth={2.5} /> : <LucideIcons.HelpCircle size={20} className="opacity-20" />;
  };

  return (
    <>
      {/* 1. CLASSIFICAÇÃO TÉCNICA */}
      <InputGroup label="Categoria de Origem">
        <select {...register('category', { required: true })} className="nexus-select-high">
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </InputGroup>

      <InputGroup label="Vantagem Tática">
        <input
          {...register('advantageAgainst')}
          className="nexus-input-high"
          placeholder="ex: Criogênese, Autômatos..."
        />
      </InputGroup>

      {/* 2. IDENTIDADE VISUAL: ÍCONE COM PREVIEW */}
      <InputGroup label="Ícone Lucide (Nome exato)">
        <div className="relative group">
          <input
            {...register('iconName')}
            className="nexus-input-high pl-12"
            placeholder="ex: Flame, Zap, Droplets..."
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-admin-panel shadow-inner transition-transform group-focus-within:scale-110">
            <IconPreview name={selectedIcon} />
          </div>
        </div>
      </InputGroup>

      {/* 3. IDENTIDADE VISUAL: RODA DE CORES */}
      <InputGroup label="Assinatura Cromática (Refração)">
        <ColorInput 
          register={register} 
          watch={watch} 
          setValue={setValue} 
          name="colorVar" 
        />
      </InputGroup>

      {/* 4. VÍNCULO DE EFEITO (FULL WIDTH) */}
      <div className="col-span-2">
        <InputGroup label="Efeito de Status Vinculado (Protocolo Base)">
          <select {...register('baseStatusId')} className="nexus-select-high">
            <option value="">Puramente Destrutiva (Sem Status)</option>
            {statusEffects.map((status: any) => (
              <option key={status._id} value={status._id}>
                {status.name.toUpperCase()} — [{status.type}]
              </option>
            ))}
          </select>
        </InputGroup>
      </div>
    </>
  );
};