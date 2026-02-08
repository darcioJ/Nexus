import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Cpu } from 'lucide-react';
import { triggerHaptic } from '../../utils/triggerHaptic';

interface ISpecialNote {
  category: string;
  content: string;
}

interface Props {
  value: ISpecialNote[];
  onChange: (newValue: ISpecialNote[]) => void;
}

export const ModuleInput = ({ value = [], onChange }: Props) => {
  const [newCat, setNewCat] = useState('');
  const [newContent, setNewContent] = useState('');

  const addNote = () => {
    if (!newCat.trim() || !newContent.trim()) return;
    triggerHaptic('MEDIUM');
    
    const updated = [...value, { 
      category: newCat.toUpperCase().trim(), 
      content: newContent.trim() 
    }];
    
    onChange(updated);
    setNewCat('');
    setNewContent('');
  };

  const removeNote = (index: number) => {
    if (value[index].category === 'SINERGIA') return; // Proteção do núcleo
    triggerHaptic('LIGHT');
    onChange(value.filter((_, i) => i !== index));
  };

  const updateNoteContent = (index: number, text: string) => {
    const updated = [...value];
    updated[index].content = text;
    onChange(updated);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-2 px-2">
        <Cpu size={12} className="text-indigo-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Matriz de Hardware (Módulos)
        </span>
      </div>

      {/* LISTA DE MÓDULOS ATIVOS */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {value.map((prop, index) => (
            <motion.div
              key={`${prop.category}-${index}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-stone-200/60 p-2.5 rounded-2xl shadow-sm group hover:border-indigo-200 transition-all"
            >
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl text-[8px] font-black text-indigo-600 min-w-[90px] text-center border border-stone-100 shadow-xs uppercase tracking-widest">
                {prop.category}
              </div>
              
              <input
                value={prop.content}
                onChange={(e) => updateNoteContent(index, e.target.value)}
                placeholder={`Definir mecânica de ${prop.category.toLowerCase()}...`}
                className="flex-1 bg-transparent text-[11px] font-bold text-slate-700 outline-none placeholder:text-slate-300 italic"
              />

              {prop.category !== 'SINERGIA' && (
                <button
                  type="button"
                  onClick={() => removeNote(index)}
                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FORGE: ADIÇÃO DE NOVOS MÓDULOS */}
      <div className="flex gap-2 p-3 bg-stone-100/40 rounded-[2.2rem] border border-stone-200/50 items-center">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="TAG"
          className="w-24 bg-white border border-stone-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-indigo-300 transition-all"
        />
        <input
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Descrever nova propriedade técnica..."
          className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2 text-[10px] font-bold outline-none focus:border-indigo-300 transition-all"
        />
        <button
          type="button"
          onClick={addNote}
          className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};