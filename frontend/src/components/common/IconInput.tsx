import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inputBaseClass } from '../../config/vault.config';
import { triggerHaptic } from '../../utils/triggerHaptic';

interface IconInputProps {
  register: any;
  watch: any;
  setValue: any; // Necessário para atualizar o valor ao clicar na sugestão
  name: string;
}

const IconPreview = ({ name, size = 20 }: { name: string; size?: number }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? (
    <Icon size={size} strokeWidth={2.5} />
  ) : (
    <LucideIcons.HelpCircle size={size} className="opacity-20 text-slate-400" />
  );
};

export const IconInput = ({ register, watch, setValue, name }: IconInputProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchTerm = watch(name) || "";

  // 1. FILTRAGEM INTELIGENTE DA ENCICLOPÉDIA LUCIDE
  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    
    return Object.keys(LucideIcons)
      .filter(key => 
        key.toLowerCase().includes(searchTerm.toLowerCase()) && 
        key !== "createLucideIcon" // Filtra funções internas
      )
      .slice(0, 8); // Limita a 8 resultados para não poluir a UI
  }, [searchTerm]);

  const handleSelect = (iconName: string) => {
    triggerHaptic('MEDIUM');
    setValue(name, iconName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative group w-full">
      {/* 2. INPUT DE BUSCA */}
      <div className="relative">
        <input
          {...register(name)}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay para permitir o clique
          className={`${inputBaseClass} pl-16 pr-10 bg-stone-100/30 group-focus-within:bg-white`}
          placeholder="Pesquisar ícone..."
          autoComplete="off"
        />

        {/* AZULEJO DE PREVIEW FIXO */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-indigo-600 shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-all duration-300 group-focus-within:scale-110 group-focus-within:border-indigo-500/30 group-focus-within:shadow-[0_0_20px_rgba(99,102,241,0.1)] pointer-events-none">
          <IconPreview name={searchTerm} />
        </div>

        {/* LED DE SINCRONIA */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-300 group-focus-within:bg-indigo-500 group-focus-within:shadow-[0_0_8px_#6366f1] transition-all" />
      </div>

      {/* 3. PAINEL DE SUGESTÕES PRISMÁTICO */}
      <AnimatePresence>
        {isDropdownOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute z-500 left-0 right-0 mt-3 p-2 bg-white/90 backdrop-blur-2xl border border-white rounded-4xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1">
              {suggestions.map((iconKey) => (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => handleSelect(iconKey)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all group/item"
                >
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-sm transition-colors">
                    <IconPreview name={iconKey} size={16} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tight truncate">
                    {iconKey}
                  </span>
                </button>
              ))}
            </div>
            
            {/* RODAPÉ DO PAINEL */}
            <div className="mt-2 py-2 px-4 border-t border-stone-100 flex justify-between items-center">
              <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">Enciclopédia_Lucide</span>
              <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};