import React from 'react';
import { motion } from 'framer-motion';

export const InputGroup = ({ label, children, error }: any) => (
  <div className="space-y-1.5 flex flex-col group">
    <label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      {children}
      {error && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="absolute -bottom-4 left-2 text-[7px] text-rose-500 font-bold uppercase"
        >
          Obrigatório
        </motion.span>
      )}
    </div>
  </div>
);