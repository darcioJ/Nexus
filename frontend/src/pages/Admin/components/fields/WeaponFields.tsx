import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Target } from 'lucide-react';
import { InputGroup } from '../InputGroup';
import { triggerHaptic } from '../../../../utils/triggerHaptic';

import { inputBaseClass, selectBaseClass } from '../../../../config/vault.config';

export const WeaponFields = ({ register, essences, setValue, watch }: any) => {
  // 1. ESTADO LOCAL PARA AS PROPRIEDADES
  // Iniciamos com a Sinergia obrigatória
  const [properties, setProperties] = useState<{ category: string; content: string }[]>(() => {
    const currentVal = watch('specialNotes');
    if (currentVal) {
      // Tenta reconstruir a lista a partir da string salva (opcional, mas bom para edição)
      return currentVal.split('\n').map((line: string) => {
        const [cat, ...rest] = line.split(': ');
        return { category: cat.replace(': ', ''), content: rest.join(': ') };
      });
    }
    return [{ category: 'SINERGIA', content: '' }];
  });

  const [newCat, setNewCat] = useState('');
  const [newContent, setNewContent] = useState('');

  // 2. SINCRONIZAÇÃO COM O REACT-HOOK-FORM
  useEffect(() => {
    const finalString = properties
      .filter(p => p.content.trim() !== '')
      .map(p => `${p.category.toUpperCase()}: ${p.content}`)
      .join('\n');

    setValue('specialNotes', finalString);
  }, [properties, setValue]);

  const addProperty = () => {
    if (!newCat || !newContent) return;
    triggerHaptic('MEDIUM');
    setProperties([...properties, { category: newCat.toUpperCase(), content: newContent }]);
    setNewCat('');
    setNewContent('');
  };

  const removeProperty = (index: number) => {
    if (properties[index].category === 'SINERGIA') return; // Bloqueia remoção da obrigatória
    triggerHaptic('LIGHT');
    setProperties(properties.filter((_, i) => i !== index));
  };

  const updateContent = (index: number, value: string) => {
    const updated = [...properties];
    updated[index].content = value;
    setProperties(updated);
  };

  return (
    <>
      <InputGroup label="Classe de Artefato (Sub-tipo)">
        <input {...register('typeLabel')} className={inputBaseClass} placeholder="ex: Efígie Onírica" />
      </InputGroup>

      <InputGroup label="Alcance Operacional">
        <select {...register('range')} className={`${selectBaseClass} appearance-none`}>
          <option value="Curto">Curto (Corpo a Corpo)</option>
          <option value="Médio">Médio (Arremesso)</option>
          <option value="Longo">Longo (Projéteis)</option>
        </select>
      </InputGroup>

      <div className="col-span-2">
        <InputGroup label="Sintonia de Essência (Núcleo de Poder)">
          <select {...register('essenceId')} className={`${selectBaseClass} appearance-none`}>
            <option value="">Física (Sem Vínculo)</option>
            {essences.map((e: any) => (
              <option key={e.key} value={e._id}>{e.name} — {e.category}</option>
            ))}
          </select>
        </InputGroup>
      </div>

      {/* --- SISTEMA DINÂMICO DE PROPRIEDADES --- */}
      <div className="col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Target size={12} className="text-indigo-500" />
            Módulos de Propriedade
          </label>
        </div>

        {/* LISTA DE PROPRIEDADES ATIVAS */}
        <div className="space-y-3">
          {properties.map((prop, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              key={index}
              className="flex items-center gap-3 bg-white border border-stone-200 p-2 rounded-2xl shadow-sm"
            >
              <div className="bg-stone-100 px-3 py-2 rounded-xl text-[9px] font-black text-slate-500 min-w-22.5 text-center border border-stone-200">
                {prop.category}
              </div>
              <input
                value={prop.content}
                onChange={(e) => updateContent(index, e.target.value)}
                placeholder={`Defina o efeito de ${prop.category}...`}
                className="flex-1 bg-transparent text-xs font-bold text-slate-700 outline-none"
              />
              {prop.category !== 'SINERGIA' && (
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* INPUT DE ADIÇÃO (PRISMA) */}
        <div className="flex gap-2 p-3 bg-indigo-50/50 rounded-4xl border border-indigo-100/50 items-center">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="CATEGORIA"
            className="w-1/3 bg-white border border-indigo-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 ring-indigo-500/20"
          />
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Descreva a mecânica..."
            className="flex-1 bg-white border border-indigo-100 rounded-xl px-3 py-2 text-[10px] font-bold outline-none focus:ring-2 ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={addProperty}
            className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200 active:scale-90"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Campo oculto para o React Hook Form ler o valor final */}
        <input type="hidden" {...register('specialNotes')} />
      </div>
    </>
  );
};