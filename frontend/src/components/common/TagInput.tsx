import React, { useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { triggerHaptic } from '../../utils/triggerHaptic'; // Ajuste o path
import { inputBaseClass } from '../../config/vault.config'; // Ajuste o path

interface TagInputProps {
  register: any;
  watch: any;
  setValue: any;
  name: string;
  icon: React.ReactNode;
  placeholder?: string;
}

export const TagInput = ({ 
  register, 
  watch, 
  setValue, 
  name, 
  icon, 
  placeholder = "Adicionar..." 
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  
  // Recupera o valor atual do form e converte em array para manipulação local
  const currentString = watch(name) || "";
  
  // Converte a string "Item 1, Item 2 e Item 3" de volta para Array
  const items = currentString 
    ? currentString.split(/, | e /).filter(Boolean) 
    : [];

  const updateFormValue = (newItems: string[]) => {
    // Formata o array para: "Item 1, Item 2 e Item 3"
    let formattedString = "";
    if (newItems.length === 1) {
      formattedString = newItems[0];
    } else if (newItems.length > 1) {
      const last = newItems.pop();
      formattedString = `${newItems.join(', ')} e ${last}`;
    }
    
    setValue(name, formattedString, { shouldValidate: true });
  };

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || items.includes(trimmed)) return;

    triggerHaptic('MEDIUM');
    const updated = [...items, trimmed];
    updateFormValue(updated);
    setInputValue('');
  };

  const removeItem = (index: number) => {
    triggerHaptic('LIGHT');
    const updated = items.filter((_, i) => i !== index);
    updateFormValue(updated);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* INPUT DE ENTRADA (CHASSI NEXUS) */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
          {icon}
        </div>
        
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${inputBaseClass} !pl-12 !pr-16`}
        />

        {/* BOTÃO ADICIONAR RÁPIDO */}
        <button
          type="button"
          onClick={addItem}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
        >
          <Plus size={18} strokeWidth={3} />
        </button>

        {/* REGISTRO OCULTO PARA O REACT-HOOK-FORM */}
        <input type="hidden" {...register(name)} />
      </div>

      {/* LISTA DE TAGS (CHIPS REFRATÁRIOS) */}
      <div className="flex flex-wrap gap-2 px-1">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white px-4 py-2 rounded-2xl shadow-sm hover:border-blue-200 transition-all group/chip"
            >
              <span className="text-[10px] font-bold text-slate-600 italic">
                {item}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-slate-300 hover:text-rose-500 transition-colors"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};