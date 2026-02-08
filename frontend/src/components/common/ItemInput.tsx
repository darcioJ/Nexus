import { useState } from 'react';
import { Plus, Trash2, Hash, Tag, AlignLeft, Box, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../utils/triggerHaptic';
import { type IItem } from '../../services/vaultService';

interface Props {
  items: IItem[];
  onChange: (items: IItem[]) => void;
  label?: string;
}

export const ItemInput = ({ items = [], onChange, label }: Props) => {
  const [newItem, setNewItem] = useState<IItem>({
    name: '',
    category: 'OBJETO',
    quantity: 1,
    description: ''
  });

  const handleAdd = () => {
    if (!newItem.name.trim()) return;
    triggerHaptic('MEDIUM');
    onChange([...items, { ...newItem, name: newItem.name.trim() }]);
    setNewItem({ name: '', category: 'OBJETO', quantity: 1, description: '' });
  };

  const handleRemove = (index: number) => {
    triggerHaptic('LIGHT');
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2 z-0">
      {/* GRID DE MÓDULOS (ITENS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
            >
              {/* ACCENT LATERAL */}
              <div className="absolute left-0 top-1/4 w-1 h-1/2 bg-indigo-500/20 rounded-r-full group-hover:bg-indigo-500 transition-all" />

              <div className="flex justify-between items-start pl-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md tracking-tighter uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono font-black text-slate-300">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight italic">
                    {item.name}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-4 pl-2 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 bg-slate-100 rounded-md">
                    <Hash size={10} className="text-slate-500" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-600">
                    QTD: {item.quantity}
                  </span>
                </div>
                {item.description && (
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <AlignLeft size={10} className="text-slate-300 shrink-0" />
                    <span className="text-[9px] font-bold text-slate-400 truncate italic">
                      {item.description}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FORMULÁRIO DE ADIÇÃO (NEXUS FORGE) */}
      <div className="relative overflow-hidden bg-slate-50/50 border border-slate-200 rounded-[2.5rem] p-5 space-y-4">
        {/* INPUT: NOME E QUANTIDADE */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Box size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              placeholder="NOME DO EQUIPAMENTO..."
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-[11px] font-black text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="relative w-24 group">
            <input
              type="number"
              placeholder="QTD"
              value={newItem.quantity}
              onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-2xl text-[11px] font-mono font-bold text-center text-slate-700 outline-none focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* INPUT: CATEGORIA E BOTÃO */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative group">
            <Tag size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500" />
            <input
              placeholder="CATEGORIA (MUNIÇÃO, CURA, ETC...)"
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:border-indigo-400 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3 group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
            Injetar_Dados
          </button>
        </div>

        {/* INPUT: DESCRIÇÃO */}
        <div className="relative group">
          <AlignLeft size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500" />
          <input
            placeholder="NOTAS ADICIONAIS DE CAMPO..."
            value={newItem.description}
            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-[10px] font-bold text-slate-500 outline-none focus:border-indigo-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};