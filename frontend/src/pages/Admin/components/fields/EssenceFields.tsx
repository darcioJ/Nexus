import * as LucideIcons from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { ColorInput } from '../../../../components/common/ColorInput';
import { IconInput } from '../../../../components/common/IconInput';

// Importação das classes globais do Prisma Nexus
import {
  inputBaseClass,
  selectBaseClass,
  categories
} from '../../../../config/vault.config';

export const EssenceFields = ({ register, statusEffects, watch, setValue }: any) => {
  return (
    <>
      {/* 1. CLASSIFICAÇÃO TÉCNICA (CATEGORIA) */}
      <InputGroup label="Categoria de Origem">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 z-10">
            <LucideIcons.Layers size={18} strokeWidth={2.5} />
          </div>

          <select {...register('category', { required: true })} className={`${selectBaseClass} pl-12`}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <LucideIcons.ChevronDown size={16} />
          </div>
        </div>
      </InputGroup>

      {/* 2. VANTAGEM TÁTICA */}
      <InputGroup label="Vantagem Tática">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 z-10">
            <LucideIcons.Crosshair size={18} strokeWidth={2.5} />
          </div>

          <input
            {...register('advantageAgainst')}
            className={`${inputBaseClass} pl-12 pr-10`}
            placeholder="ex: Autômatos, Criogênese..."
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-300 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_8px_#6366f1] transition-all" />
        </div>
      </InputGroup>

      {/* 3. IDENTIDADE VISUAL (Sintonização de Ícone) */}
      <div className="col-span-2">
        <InputGroup label="Ícone Representativo (Lucide)">
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>

      {/* 4. ASSINATURA CROMÁTICA (Módulo de Sintonização) */}
      <div className="col-span-2">
        <InputGroup label="Assinatura Cromática (Refração)">
          <ColorInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="colorVar"
          />
        </InputGroup>
      </div>

      {/* 5. VÍNCULO DE EFEITO (Full Width) */}
      <div className="col-span-2">
        <InputGroup label="Efeito de Status Vinculado (Protocolo Base)">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 z-10">
              <LucideIcons.Dna size={18} strokeWidth={2.5} />
            </div>

            <select {...register('baseStatusId')} className={`${selectBaseClass} pl-12`}>
              <option value="">Puramente Destrutiva (Sem Status)</option>
              {statusEffects.map((status: any) => (
                <option key={status.key} value={status._id}>
                  {status.name} — {status.type}
                </option>
              ))}
            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
              <LucideIcons.ChevronDown size={16} />
            </div>
          </div>
        </InputGroup>
      </div>
    </>
  );
};