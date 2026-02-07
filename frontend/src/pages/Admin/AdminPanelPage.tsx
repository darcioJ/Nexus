import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ChevronRight, ShieldCheck, 
  Terminal, Globe, Zap, Cpu, Fingerprint
} from 'lucide-react';

import { DossierAtmosphere } from '../../components/shared/DossierAtmosphere';
import { triggerHaptic } from '../../utils/triggerHaptic';
import { VaultManager } from './components/VaultManager';
import { UserManager } from './components/UserManager';
import { VaultFormModal } from './components/VaultFormModal';
import { AdminNavbar } from './components/AdminNavbar';

export const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState<'vault' | 'users' | 'system'>('vault');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabChange = (tab: 'vault' | 'users' | 'system') => {
    triggerHaptic('LIGHT');
    setActiveTab(tab);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 flex flex-col overflow-x-hidden selection:bg-indigo-100 selection:text-admin-panel">
      
      {/* 🌌 ATMOSFERA: Refração adaptativa */}
      <DossierAtmosphere
        step={activeTab}
        accentColor="var(--color-admin-panel)"
        opacity={0.12}
        variant="heavy"
      />

      {/* 🛰️ NAVBAR: Fixa para fácil acesso mobile */}
      <AdminNavbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* --- WORKSPACE PRINCIPAL --- */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-24 pb-12 flex flex-col gap-6 lg:gap-10">

        {/* HUD DE TELEMETRIA: Reorganizado para Mobile */}
        <header className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          
          {/* Linha de Badges: Scroll horizontal no mobile para não quebrar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-full shadow-sm shrink-0">
              <ShieldCheck size={10} className="text-emerald-500" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Root_Verified</span>
            </div>
            
            <ChevronRight size={12} className="text-slate-300 shrink-0" />

            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 rounded-full shrink-0 shadow-lg shadow-indigo-200">
              <Terminal size={10} className="text-white" />
              <span className="text-[8px] font-black text-white uppercase tracking-widest">
                Node.{activeTab}
              </span>
            </div>

            {/* Nova Badge de Latência (Visual) */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full shrink-0 opacity-60">
              <Activity size={10} className="text-slate-400" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">2.4ms</span>
            </div>
          </div>

          {/* Título Responsivo: Ajusta o tamanho dinamicamente */}
          <div className="relative space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              {activeTab === 'vault' ? 'Dossier_Ativos' : activeTab === 'users' ? 'Bio_Monitor' : 'System_Root'}
            </h1>
            <div className="flex items-center gap-4">
               <motion.div 
                 layoutId="accent-line"
                 className="h-1 lg:h-2 w-24 bg-indigo-600 rounded-full" 
               />
               <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-[0.3em]">
                 Nexus_OS // {activeTab.toUpperCase()}
               </span>
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO: Padding ajustado para mobile */}
        <section className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              {activeTab === 'vault' && <VaultManager />}
              {activeTab === 'users' && <UserManager />}
              {activeTab === 'system' && <SystemMaintenanceView />}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* FOOTER TÁTICO: Mais compacto no Mobile */}
        <footer className="mt-8 py-6 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-[7px] lg:text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">
            <span className="flex items-center gap-1.5"><Globe size={10} /> Global_Sync</span>
            <span className="flex items-center gap-1.5 text-emerald-600"><Zap size={10} /> Core_Online</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[8px] font-mono font-bold text-slate-300">
               0x{new Date().getFullYear()}_NX_V2.6
             </span>
          </div>
        </footer>
      </main>

      {/* PORTAL DE FORMULÁRIO */}
      <AnimatePresence>
        {isModalOpen && (
          <VaultFormModal
            type="weapons"
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => { setIsModalOpen(false); triggerHaptic('SUCCESS'); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- VIEW DE MANUTENÇÃO: Design "Terminal de Inicialização" ---

const SystemMaintenanceView = () => (
  <div className="flex flex-col items-center justify-center py-24 lg:py-40 bg-white/60 backdrop-blur-3xl rounded-[3rem] lg:rounded-[4rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
    {/* Efeito de Scanline sutil */}
    <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none" />
    
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="relative w-20 h-20 lg:w-28 lg:h-28 bg-white rounded-[2rem] lg:rounded-[3rem] flex items-center justify-center text-indigo-500 mb-8 shadow-inner border border-indigo-50">
        <Cpu size={40} className="lg:size-52 animate-spin-slow" />
      </div>
    </div>

    <div className="text-center space-y-4 px-6 relative z-10">
      <div className="flex flex-col items-center gap-1">
        <p className="text-[12px] font-black uppercase text-slate-800 tracking-[0.4em]">Protocolo_Em_Espera</p>
        <div className="h-0.5 w-12 bg-indigo-100 rounded-full" />
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[240px]">
        O módulo System_Root está em fase de recalibração para o firmware Prisma 3.0
      </p>
      
      <div className="pt-4 flex items-center justify-center gap-2">
         <Fingerprint size={12} className="text-indigo-300" />
         <span className="text-[8px] font-mono text-indigo-400 font-bold animate-pulse">Waiting_For_Auth...</span>
      </div>
    </div>
  </div>
);