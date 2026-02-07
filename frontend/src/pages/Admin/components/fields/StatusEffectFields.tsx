import { Zap, Activity, Settings, ChevronDown } from 'lucide-react';
import { InputGroup } from '../InputGroup';

// Importação das classes globais do Prisma Nexus
import {
  inputBaseClass,
  selectBaseClass,
  textareaBaseClass,
  categories
} from '../../../../config/vault.config';

export const StatusEffectFields = ({ register }: any) => {
  return (
    <>
      {/* 1. CLASSIFICAÇÃO SISTÊMICA (Natureza) */}
      <InputGroup label="Natureza do Efeito (Type)">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 z-10">
            <Zap size={18} strokeWidth={2.5} />
          </div>

          <select {...register('type')} className={`${selectBaseClass} pl-12`}>
            {categories.map(cat => (
              <option key={cat} value={cat.toUpperCase()}>{cat}</option>
            ))}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <ChevronDown size={16} />
          </div>
        </div>
      </InputGroup>

      {/* 2. PROTOCOLO DE DEFESA (Resistência) */}
      <InputGroup label="Protocolo de Resistência">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 z-10">
            <Activity size={18} strokeWidth={2.5} />
          </div>

          <input
            {...register('resistance')}
            className={`${inputBaseClass} pl-12`}
            placeholder="ex: Vitalidade (VIT)"
          />

          {/* LED de Status */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-300 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_8px_#6366f1] transition-all" />
        </div>
      </InputGroup>

      {/* 4. PROTOCOLO DE EXECUÇÃO (Mecânica) */}
      <div className="col-span-2">
        <InputGroup label="Mecânica de Execução">
          <div className="relative group">
            {/* ÍCONE TÁTICO: Engrenagem/Sistema */}
            <div className="absolute left-5 top-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 z-10">
              <Settings size={18} strokeWidth={2.5} />
            </div>

            <textarea
              {...register('mechanic')}
              rows={3}
              className={`${textareaBaseClass} pl-14`}
              placeholder="ex: -2 HP por turno. Redução de 50% em regeneração..."
            />

            {/* LED DE STATUS ATIVO */}
            <div className="absolute right-5 top-6 w-1.5 h-1.5 rounded-full bg-stone-300 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_8px_#6366f1] transition-all" />
          </div>
        </InputGroup>
      </div>
    </>
  );
};