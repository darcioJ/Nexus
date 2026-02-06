import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Activity, ChevronRight, ShieldCheck,
  Terminal, Cpu, Globe, Zap
} from 'lucide-react';

// --- INFRAESTRUTURA NEXUS ---
import { DossierAtmosphere } from '../../components/shared/DossierAtmosphere';
import { useVault } from '../../hooks/useVault';
import { triggerHaptic } from '../../utils/triggerHaptic';

// --- COMPONENTES DE GESTÃO ---
import { VaultManager } from './components/VaultManager';
import { UserManager } from './components/UserManager';
import { VaultFormModal } from './components/VaultFormModal';
import { AdminNavbar } from './components/AdminNavbar';

export const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState<'vault' | 'users' | 'system'>('vault');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isRefreshing } = useVault();

  const handleTabChange = (tab: 'vault' | 'users' | 'system') => {
    triggerHaptic('LIGHT');
    setActiveTab(tab);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 flex flex-col overflow-x-hidden selection:bg-indigo-100 selection:text-admin-panel">

      {/* 🌌 CAMADA 0: ATMOSFERA ADAPTATIVA (Reage à Tab Ativa) */}
      <DossierAtmosphere
        step={activeTab}
        accentColor="var(--color-admin-panel)"
        opacity={0.15}
        variant="heavy"
      />

      {/* 🛰️ CAMADA 1: CONSOLE DE COMANDO (Navbar) */}
      <AdminNavbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* --- CAMADA 2: ÁREA DE TRABALHO --- */}
      <main className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto p-6 lg:p-12 flex flex-col gap-12">

        {/* HEADER DE TELEMETRIA (HUD STYLE) */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {/* Badge de Segurança */}
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                <ShieldCheck size={12} className="text-admin-panel" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Root_Access_Granted</span>
              </div>
              <ChevronRight size={14} className="text-slate-200" />
              {/* Badge de Protocolo */}
              <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-xl">
                <Terminal size={12} className="text-admin-panel" />
                <span className="text-[9px] font-black text-admin-panel uppercase tracking-[0.2em]">
                  {activeTab === 'vault' ? 'Protocol.Vault_Core' : 'Protocol.Identity_Node'}
                </span>
              </div>
            </div>

            <div className="relative">
              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                {activeTab === 'vault' ? 'Dossier_Ativos' : activeTab === 'users' ? 'Bio_Monitor' : 'System_Root'}
              </h1>
              {/* Linha de Design Prisma */}
              <div className="absolute -bottom-4 left-0 w-32 h-1.5 bg-indigo-600 rounded-full" />
            </div>
          </div>

          {/* Botão de Ação Primária (Apenas no Vault) */}
          <div className="flex items-center gap-4">
            {activeTab === 'vault' && (
              <button
                onClick={() => { triggerHaptic('MEDIUM'); setIsModalOpen(true); }}
                className="group h-16 px-10 bg-indigo-600 text-white rounded-[1.75rem] flex items-center gap-4 font-black text-[11px] uppercase tracking-[0.25em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                  <Plus size={20} />
                </div>
                Registrar Ativo
              </button>
            )}
          </div>
        </header>

        {/* WORKSPACE (Renderização Dinâmica) */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="min-h-[60vh]"
            >
              {activeTab === 'vault' && <VaultManager />}
              {activeTab === 'users' && <UserManager />}
              {activeTab === 'system' && <SystemMaintenanceView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER HUD (Decoração Técnica) */}
        <footer className="mt-auto pt-12 border-t border-slate-100 flex flex-wrap justify-between items-center gap-6 opacity-40">
          <div className="flex items-center gap-8 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">
            <div className="flex items-center gap-2"><Globe size={10} /> Nexus_Global_Network</div>
            <div className="flex items-center gap-2"><Zap size={10} /> Low_Latency_Buffer</div>
          </div>
          <span className="text-[8px] font-mono font-bold text-slate-300 tracking-tighter">
            BUILD_HASH: 0x69828A8D451BBF3B // VERSION_2.6.4
          </span>
        </footer>
      </main>

      {/* MODAL PORTAL */}
      <AnimatePresence>
        {isModalOpen && (
          <VaultFormModal
            type="weapons"
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- COMPONENTE INTERNO: VIEW DE MANUTENÇÃO ---

const SystemMaintenanceView = () => (
  <div className="flex flex-col items-center justify-center py-40 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white shadow-xl shadow-slate-200/50">
    <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-200 mb-8">
      <Activity size={48} className="animate-pulse" />
    </div>
    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.5em] mb-2">Terminal_Em_Manutenção</p>
    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Aguardando Sincronia de Firmware</p>
  </div>
);