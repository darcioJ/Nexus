import { useState, useEffect } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { InputGroup } from '../InputGroup';
import { IconInput } from '../../../../components/common/IconInput';
import { triggerHaptic } from '../../../../utils/triggerHaptic';

export const ArchetypeFields = ({ register, watch, setValue }: any) => {
  // 1. GERENCIAMENTO DE ITEMS (Equipamento)
  const [itemList, setItemList] = useState<string[]>(() => {
    const currentItems = watch('items');
    return currentItems ? currentItems.split(' • ') : [];
  });
  const [newItem, setNewItem] = useState('');

  // Sincroniza a lista local com o formulário (String Única)
  useEffect(() => {
    const combined = itemList.filter(i => i.trim() !== '').join(' • ');
    setValue('items', combined);
  }, [itemList, setValue]);

  const addItem = () => {
    if (!newItem.trim()) return;
    triggerHaptic('MEDIUM');
    setItemList([...itemList, newItem.trim()]);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    triggerHaptic('LIGHT');
    setItemList(itemList.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* 2. IDENTIDADE VISUAL (IconInput) */}
      <div className="col-span-2">
        <InputGroup label="Assinatura Visual (Ícone de Classe)">
          <IconInput register={register} watch={watch} setValue={setValue} name="iconName" />
        </InputGroup>
      </div>

      {/* 3. EQUIPAMENTO INICIAL (Módulo de Adição de Itens) */}
      <div className="col-span-2 space-y-4 pt-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <Package size={12} className="text-indigo-500" />
          Kit de Iniciação (Itens)
        </label>

        {/* Lista de Itens Ativos */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {itemList.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group flex items-center gap-2 bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-sm hover:border-indigo-300 transition-all"
              >
                <span className="text-xs font-bold text-slate-700">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input de Adição Prismático */}
        <div className="flex gap-2 p-3 bg-stone-100/50 rounded-[2rem] border border-stone-200/50 items-center">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
            placeholder="Adicionar item ao kit..."
            className="flex-1 bg-transparent px-4 text-xs font-bold text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={addItem}
            className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200 active:scale-90"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Campo Oculto para o Form ler a String Final */}
        <input type="hidden" {...register('items')} />
      </div>
    </>
  );
};