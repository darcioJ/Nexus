import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Radio, Loader2, LayoutGrid } from 'lucide-react';

export const MasterHeader = ({ searchTerm, setSearchTerm, totalSinals, onGlobalSync, isSyncing }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/80 p-4 md:p-6 rounded-[2.5rem] border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl relative overflow-hidden"
    >
      {/* --- 1. IDENTIDADE COMPACTA --- */}
      <div className="flex items-center gap-6 relative z-10">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-slate-50 shadow-sm text-amber-500">
            <LayoutGrid size={24} />
        </div>
        <div className="space-y-0.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Vault <span className="text-amber-500">Telemetry</span>
            </h1>
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    {isSyncing ? 'Sincronizando_Dados...' : `${totalSinals || 0} Sinais_Ativos`}
                </span>
            </div>
        </div>
      </div>

      {/* --- 2. FERRAMENTAS DE INTERFACE --- */}
      <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
        
        {/* BUSCA INTEGRADA */}
        <div className="relative group flex-1 md:w-64">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" 
            size={16} 
          />
          <input
            type="text"
            placeholder="Rastrear..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 border border-slate-50 h-12 pl-11 pr-4 rounded-2xl shadow-inner outline-none focus:border-amber-500/30 focus:bg-white transition-all font-bold text-[10px] uppercase tracking-widest text-slate-900 placeholder:text-slate-200"
          />
        </div>

        {/* BOTÃO SYNC (DINÂMICO) */}
        <motion.button 
          whileHover={!isSyncing ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isSyncing ? { scale: 0.98 } : {}}
          onClick={onGlobalSync}
          disabled={isSyncing}
          className={`h-12 px-6 rounded-2xl flex items-center gap-3 transition-all group overflow-hidden border ${
            isSyncing 
            ? 'bg-amber-50 text-amber-500 border-amber-200 cursor-wait' 
            : 'bg-white text-amber-600 border-amber-500/20 hover:border-amber-500 hover:shadow-lg'
          }`}
        >
          {isSyncing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Radio size={16} className="group-hover:rotate-180 transition-transform duration-700" />
          )}
          
          <span className="text-[9px] font-black uppercase tracking-[0.2em] hidden sm:block">
            {isSyncing ? 'Sincronizando...' : 'Global_Sync'}
          </span>
        </motion.button>
      </div>

      {/* BARRA DE PROGRESSO INFINITA (Apenas durante Sync) */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 origin-left"
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-amber-500/5 to-transparent pointer-events-none" />
    </motion.header>
  );
};