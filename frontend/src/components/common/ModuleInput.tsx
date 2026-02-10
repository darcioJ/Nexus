import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Cpu, Layers, Sparkles } from 'lucide-react';
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
    if (value[index].category === 'SINERGIA') return;
    triggerHaptic('LIGHT');
    onChange(value.filter((_, i) => i !== index));
  };

  const updateNoteContent = (index: number, text: string) => {
    const updated = [...value];
    updated[index].content = text;
    onChange(updated);
  };

  return (
    <div className="space-y-6 w-full group/matrix">
      {/* LISTA DE MÓDULOS (HARDWARE SLOTS) */}
      <div className="space-y-3 px-1">
        <AnimatePresence mode="popLayout">
          {value.map((prop, index) => (
            <motion.div
              key={`${prop.category}-${index}`}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex items-center gap-4 bg-white/80 backdrop-blur-xl border-2 border-white p-4 rounded-[2rem] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.03)] group/item hover:border-blue-100 transition-all duration-500"
            >
              {/* TAG DE CATEGORIA (CHIP) */}
              <div className="bg-slate-50/80 px-4 py-2 rounded-2xl text-[9px] font-black text-blue-600 min-w-[100px] text-center border border-white shadow-inner uppercase tracking-widest shrink-0">
                {prop.category}
              </div>

              {/* INPUT DE CONTEÚDO (CERÂMICA) */}
              <input
                value={prop.content}
                onChange={(e) => updateNoteContent(index, e.target.value)}
                placeholder={`Definir lógica de ${prop.category}...`}
                className="flex-1 bg-transparent text-xs font-bold text-slate-700 outline-none placeholder:text-slate-300 italic"
              />

              {/* BOTÃO DE DELEÇÃO (PROTOCOLO DE EXPULSÃO) */}
              {prop.category !== 'SINERGIA' && (
                <button
                  type="button"
                  onClick={() => removeNote(index)}
                  className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-300"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              )}

              {/* BLOOM DE ATIVIDADE SUTIL */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500/20 rounded-r-full group-hover/item:bg-blue-500 transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FORGE DOCK: ADIÇÃO DE NOVOS MÓDULOS */}
      <div className="relative p-6 bg-slate-50/50 rounded-[3rem] border border-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row gap-3 items-center group/forge">

        {/* INPUT DE TAG (HARDWARE ID) */}
        <div className="relative w-full sm:w-32 group/tag">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="TAG"
            className="w-full bg-white border-2 border-white rounded-2xl px-4 py-3 text-[10px] font-black uppercase outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all text-center placeholder:text-slate-300"
          />
        </div>

        {/* INPUT DE DESCRIÇÃO (LOGIC SINAL) */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
            <Layers size={14} />
          </div>
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Descrever nova propriedade técnica..."
            className="w-full bg-white border-2 border-white rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all placeholder:text-slate-300"
          />
        </div>

        {/* BOTÃO FORJAR (SYNC) */}
        <button
          type="button"
          onClick={addNote}
          className="relative w-full sm:w-14 h-14 rounded-[1.5rem] overflow-hidden group/btn active:scale-95 transition-all shadow-lg shadow-blue-100"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 group-hover/btn:scale-110 transition-transform duration-500" />
          <div className="relative flex items-center justify-center text-white">
            <Plus size={24} strokeWidth={3} />
          </div>
        </button>

        {/* EFEITO DE LUZ (PRISMA) */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 blur-[60px] pointer-events-none group-focus-within/forge:opacity-100 opacity-0 transition-opacity" />
      </div>
    </div>
  );
};