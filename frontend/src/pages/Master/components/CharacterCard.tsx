import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, Zap,
  AlertTriangle,
  ShieldCheck, Radio
} from 'lucide-react';

// Sub-módulos
import { VitalControl } from './VitalControl';
import { AttributeGrid } from './AttributeGrid';
import { DetailedScan } from './DetailedScan';

import { useMasterNexus } from '../../../hooks/useMasterNexus';

import { NexusIcon } from '../../../components/common/NexusIcon';

export const CharacterCard = ({ character, vault, index, onModulate, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { sendPulse } = useMasterNexus();

  const club = useMemo(() => {
    return vault?.clubs?.find(c => c._id === character.background?.club);
  }, [vault, character.background?.club]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.6, ease: "easeOut" }}
      className={`
        relative overflow-hidden bg-white/70 backdrop-blur-3xl border border-white rounded-[2.5rem] p-5 md:p-7
        shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] transition-all duration-500
        ${isExpanded ? 'ring-4 ring-amber-500/5 scale-[1.005]' : 'hover:bg-white/80'}
      `}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-amber-400/40 via-amber-500/5 to-transparent" />

      {/* --- HEADER COMPACTO --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="relative group/avatar">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-50 shadow-lg flex items-center justify-center text-2xl font-black text-slate-900 italic relative z-10 transition-transform group-hover/avatar:rotate-2">
              {character.identity.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md z-20 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl leading-none">
                {character.identity.name}
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <Radio size={8} className="text-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Ativo</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {club && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-white rounded-lg">
                  <NexusIcon name={club.iconName} size={10} className="text-amber-600" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{club.name}</span>
                </div>
              )}
              <span className="text-[7px] text-slate-300 font-mono font-bold italic tracking-tighter">
                #{character._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50/50 p-1.5 rounded-2xl border border-white shadow-inner">
            <div className="flex items-center gap-1.5 bg-slate-50/50 p-1.5 rounded-2xl border border-white shadow-inner">
              <ActionButton
                icon={<Zap size={16} />}
                label="Impacto"
                color="amber"
                onClick={() => sendPulse(character._id, 'IMPACT')}
              />
              <ActionButton
                icon={<AlertTriangle size={16} />}
                label="Alerta"
                color="rose"
                onClick={() => sendPulse(character._id, 'ALERT')}
              />
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              flex-1 lg:flex-none h-12 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-black text-[9px] uppercase tracking-widest border
              ${isExpanded
                ? 'bg-white text-amber-600 border-amber-500/30 shadow-md'
                : 'bg-white text-slate-400 border-slate-50 hover:border-amber-500/20 hover:text-slate-900 shadow-xs'}
            `}
          >
            <motion.div animate={isExpanded ? { rotate: 180 } : { rotate: 0 }}>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </motion.div>
            <span>{isExpanded ? 'Resumir' : 'Detalhes'}</span>
          </button>
        </div>
      </div>

      {/* --- GRID DE DADOS --- */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <VitalControl character={character} vault={vault} onModulate={onModulate} onStatusChange={onStatusChange} />
        </div>
        <div className="xl:col-span-2 bg-slate-50/30 rounded-3xl p-3 border border-white/50 shadow-inner h-full">
          <AttributeGrid character={character} vault={vault} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            <DetailedScan character={character} vault={vault} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between opacity-30">
        <div className="flex items-center gap-2">
          <ShieldCheck size={10} className="text-slate-400" />
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Protocolo_V4</span>
        </div>
        <span className="text-[7px] font-mono text-slate-400">LATENCY_12MS</span>
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, label, color, onClick }) => {
  const colors = {
    amber: 'hover:bg-amber-500 hover:text-white text-amber-600 border-amber-100',
    rose: 'hover:bg-rose-500 hover:text-white text-rose-600 border-rose-100'
  };

  return (
    <div className="group relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center transition-all duration-300 shadow-xs border ${colors[color]}`}
      >
        {icon}
      </motion.button>

      {/* Tooltip Profissional */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[7px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-[0.2em] whitespace-nowrap shadow-xl">
        {label}
      </span>
    </div>
  );
};