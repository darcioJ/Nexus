import { useState } from 'react';
import { Plus, Trash2, Hash, Tag, AlignLeft, Box, Package, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../utils/triggerHaptic';
import { type IItem } from '../../services/vaultService';

interface Props {
  items: IItem[];
  onChange: (items: IItem[]) => void;
  label?: string;
}

export const ItemInput = ({ items = [], onChange }: Props) => {
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
    <div className="space-y-6 w-full">
      {/* GRID DE MÓDULOS (SUPRIMENTOS INDEXADOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative group bg-white/80 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-5 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.03)] hover:border-blue-100 transition-all duration-500"
            >
              {/* LED DE IDENTIFICAÇÃO DE SLOT */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="text-[8px] font-mono font-black text-slate-200 uppercase">
                  Slot_{String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              </div>

              <div className="space-y-4">
                {/* INFO PRINCIPAL */}
                <div className="pr-12">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[7px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg tracking-widest uppercase border border-white">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 italic uppercase tracking-tight">
                    {item.name}
                  </h4>
                </div>

                {/* METADADOS DO ITEM */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Hash size={12} />
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-600">
                      x{item.quantity}
                    </span>
                  </div>
                  
                  {item.description && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <AlignLeft size={12} className="text-slate-300 shrink-0" />
                      <p className="text-[9px] font-bold text-slate-400 truncate italic leading-none">
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* PROTOCOLO DE EXPULSÃO */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="w-8 h-8 flex items-center justify-center text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-300"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* BARRA DE SINAL DE HARDWARE */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-500/10 rounded-r-full group-hover:bg-blue-500 transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* NEXUS SUPPLY FORGE: DOCK DE CARREGAMENTO */}
      <div className="relative p-6 bg-slate-50/50 rounded-[3.5rem] border border-white shadow-[inset_0_2px_15px_rgba(0,0,0,0.02)] space-y-4 group/forge">
        
        {/* LINHA 1: NOME E QUANTIDADE */}
        <div className="flex gap-3">
          <div className="relative flex-1 group/input">
            <Box size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" />
            <input
              placeholder="NOME DO EQUIPAMENTO..."
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-white border-2 border-white rounded-[1.5rem] pl-12 pr-6 py-4 text-[11px] font-black text-slate-700 outline-none focus:border-blue-400 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all placeholder:text-slate-300 uppercase italic"
            />
          </div>
          <div className="relative w-28">
            <input
              type="number"
              placeholder="QTD"
              value={newItem.quantity}
              onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              className="w-full bg-white border-2 border-white px-4 py-4 rounded-[1.5rem] text-xs font-mono font-black text-center text-slate-700 outline-none focus:border-blue-400 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* LINHA 2: CATEGORIA E DESCRIÇÃO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Tag size={12} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              placeholder="CATEGORIA..."
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value.toUpperCase() })}
              className="w-full bg-white border-2 border-white pl-12 pr-6 py-4 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest text-slate-600 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="relative">
            <AlignLeft size={12} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              placeholder="DESCRIÇÃO TÉCNICA..."
              value={newItem.description}
              onChange={e => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full bg-white border-2 border-white pl-12 pr-6 py-4 rounded-[1.5rem] text-[10px] font-bold text-slate-500 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* BOTÃO DE INJEÇÃO (COMMIT) */}
        <button
          type="button"
          onClick={handleAdd}
          className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.4em] hover:shadow-[0_10px_30px_-5px_rgba(59,130,246,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group/btn"
        >
          <div className="flex items-center gap-2">
            <Plus size={18} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform duration-500" />
            <span>Injetar_Dados_Suprimento</span>
          </div>
          <Sparkles size={14} className="opacity-40 animate-pulse" />
        </button>

        {/* EFEITO DE LUZ (PRISMA) */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 blur-[80px] pointer-events-none group-focus-within/forge:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};