import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Users, Settings, Cpu, Clock, Activity } from 'lucide-react';
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

  const handleNav = (tab: 'vault' | 'users' | 'system') => {
    triggerHaptic('LIGHT');
    onTabChange(tab);
  };

  return (
    <nav className="w-full h-24 sticky top-0 z-50 px-8 flex items-center justify-between bg-white/40 backdrop-blur-3xl border-b border-white shadow-sm">
      
      {/* --- LOGO & PROTOCOLO --- */}
      <div className="flex items-center gap-4 min-w-[240px]">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
          <Cpu size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Nexus_OS</h2>
          <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em]">Core_Admin_v2.6</span>
        </div>
      </div>

      {/* --- NAVEGAÇÃO CENTRAL (PRISMA TABS) --- */}
      <div className="flex items-center bg-slate-100/50 p-1.5 rounded-[2rem] border border-white/50">
        <NavTab 
          active={activeTab === 'vault'} 
          onClick={() => handleNav('vault')} 
          icon={<Database size={16} />} 
          label="Vault" 
        />
        <NavTab 
          active={activeTab === 'users'} 
          onClick={() => handleNav('users')} 
          icon={<Users size={16} />} 
          label="Bio-Sinais" 
        />
        <NavTab 
          active={activeTab === 'system'} 
          onClick={() => handleNav('system')} 
          icon={<Settings size={16} />} 
          label="Sinal" 
        />
      </div>

      {/* --- TELEMETRIA & CLOCK --- */}
      <div className="flex items-center gap-6 min-w-[240px] justify-end">
        <div className="hidden lg:flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Sinal_Estável</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-500 mt-1">
            <Clock size={12} />
            <span className="text-[11px] font-mono font-black">
              {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="w-10 h-10 rounded-full bg-slate-50 border border-white flex items-center justify-center text-slate-300">
            <Activity size={18} />
        </div>
      </div>
    </nav>
  );
};

// --- SUB-COMPONENTE: NAV TAB ---

const NavTab = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] transition-all duration-500 relative ${
      active 
      ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/10 scale-105 border border-indigo-50' 
      : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <span className="relative z-10">{icon}</span>
    <span className="font-black text-[10px] uppercase tracking-widest relative z-10">{label}</span>
    
    {active && (
      <motion.div 
        layoutId="nav-glow"
        className="absolute inset-0 bg-white rounded-[1.5rem] shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]"
      />
    )}
  </button>
);