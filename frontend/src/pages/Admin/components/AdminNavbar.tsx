import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Users, Settings, Cpu, Clock, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../../../utils/triggerHaptic';

interface AdminNavbarProps {
  activeTab: 'vault' | 'users' | 'system';
  onTabChange: (tab: 'vault' | 'users' | 'system') => void;
}

export const AdminNavbar = ({ activeTab, onTabChange }: AdminNavbarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* 💻 DESKTOP ONLY: Barra Superior Completa */}
      <nav className="hidden lg:flex w-full h-24 sticky top-0 z-50 px-8 items-center justify-between bg-white/40 backdrop-blur-3xl border-b border-white shadow-sm">
        <div className="flex items-center gap-4 min-w-60">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Cpu size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Nexus_OS</h2>
            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em]">Core_Admin_v2.6</span>
          </div>
        </div>

        <div className="flex items-center bg-slate-100/50 p-1.5 rounded-4xl border border-white/50">
          <NavTab active={activeTab === 'vault'} onClick={() => onTabChange('vault')} icon={<Database size={16} />} label="Vault" />
          <NavTab active={activeTab === 'users'} onClick={() => onTabChange('users')} icon={<Users size={16} />} label="Bio-Sinais" />
          <NavTab active={activeTab === 'system'} onClick={() => onTabChange('system')} icon={<Settings size={16} />} label="Sistema" />
        </div>

        <div className="flex items-center gap-6 min-w-60 justify-end">
          <div className="flex flex-col items-end text-indigo-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Sinal_Estável</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={12} />
              <span className="text-[11px] font-mono font-black">
                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-white flex items-center justify-center text-slate-300">
            <ShieldCheck size={18} />
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE ONLY: Seletor Segmentado (Pill) */}
      {/* Ele não é uma barra fixa, ele rola com a página ou fica logo abaixo do título */}
      <div className="lg:hidden w-full px-4 pt-2">
        <div className="bg-slate-200/50 backdrop-blur-md p-1 rounded-4xl flex items-center relative overflow-hidden border border-white/20">
          <MobilePillTab 
            active={activeTab === 'vault'} 
            onClick={() => onTabChange('vault')} 
            icon={<Database size={16} />} 
            label="Vault" 
          />
          <MobilePillTab 
            active={activeTab === 'users'} 
            onClick={() => onTabChange('users')} 
            icon={<Users size={16} />} 
            label="Bio" 
          />
          <MobilePillTab 
            active={activeTab === 'system'} 
            onClick={() => onTabChange('system')} 
            icon={<Settings size={16} />} 
            label="Root" 
          />
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTE: MOBILE PILL ---

const MobilePillTab = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={() => { triggerHaptic('LIGHT'); onClick(); }}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.8rem] transition-all duration-300 relative z-10 ${
      active ? 'text-indigo-600' : 'text-slate-500'
    }`}
  >
    {icon}
    <span className="font-black text-[9px] uppercase tracking-widest">{label}</span>
    
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="absolute inset-0 bg-white shadow-sm border border-indigo-100 rounded-[1.8rem] -z-10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </button>
);

// (O componente NavTab do Desktop continua o mesmo do anterior)
const NavTab = ({ active, onClick, icon, label }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-3xl transition-all duration-300 relative ${
        active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <span className="relative z-10">{icon}</span>
      <span className="font-black text-[10px] uppercase tracking-widest relative z-10">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute inset-0 bg-white rounded-3xl shadow-sm border border-indigo-50"
        />
      )}
    </button>
);