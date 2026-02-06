import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Book, Shield, User,
  Activity, Cpu, Terminal, LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isMaster: boolean;
  character: unknown;
  isConnected: boolean;
  activePath: string;
  isOpen: boolean;      // Novo: Controle de estado
  setIsOpen: (open: boolean) => void; // Novo: Função para fechar
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMaster, character, isConnected, activePath, isOpen, setIsOpen, isDesktop
}) => {

  // Variantes de Animação para o Drawer
  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* --- 1. BACKDROP (Apenas visível abaixo de LG quando aberto) --- */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            // Oculto em sm (mobile) e lg (desktop)
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 hidden md:block lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- 2. CONTAINER DA SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={isDesktop ? "open" : (isOpen ? "open" : "closed")}
        variants={sidebarVariants}
        className={`
          hidden 
          md:flex md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-72 
          lg:static lg:flex lg:w-80 lg:opacity-100 lg:translate-x-0
          flex-col bg-white/60 backdrop-blur-3xl border-r border-white/60 relative
        `}
      >
        {/* GRID TÁTICO DE FUNDO */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(var(--system-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
        />

        {/* LOGO E STATUS */}
        <div className="p-8 lg:p-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-white relative overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-10" style={{ backgroundColor: 'var(--system-color)' }} />
              {isMaster ? <Shield size={22} style={{ color: 'var(--system-color)' }} /> : <Cpu size={22} style={{ color: 'var(--system-color)' }} />}
            </div>
            <div className="flex flex-col">
              <h2 className="text-slate-900 font-black tracking-tighter text-xl leading-none">
                FORGER<span style={{ color: 'var(--system-color)' }}>NX</span>
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1 h-1 rounded-full ${isConnected ? 'animate-pulse' : ''}`} style={{ backgroundColor: isConnected ? 'var(--system-color)' : '#ef4444' }} />
                <span className="text-[6px] text-slate-400 font-mono font-black uppercase tracking-widest">
                  {isConnected ? 'Link_Active' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 relative z-10">
          <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Overview" active={activePath === '/dashboard'} onClick={() => setIsOpen(false)} />
          <NavItem to="/dashboard/wiki" icon={<Book />} label="Nexuspedia" active={activePath.includes('/wiki')} onClick={() => setIsOpen(false)} />

          {!isMaster && (
            <NavItem to="/dashboard/attributes" icon={<Shield />} label="Atributos" active={activePath.includes('/attributes')} onClick={() => setIsOpen(false)} />
          )}

          <div className="py-2 px-4 opacity-20"><div className="h-px w-full bg-slate-400" /></div>

          {/* --- NAVEGAÇÃO DE AUTORIDADE (MASTER) --- */}
          {isMaster ? (
            <>
              <NavItem
                to="/dashboard/master-panel"
                icon={<Activity />}
                label="Painel Mestre"
                active={activePath.includes('/master-panel')}
                onClick={() => setIsOpen(false)}
              />

              {/* NOVO: ACESSO AO VAULT ADMIN */}
              <NavItem
                to="/dashboard/admin-panel"
                icon={<LayoutGrid />}
                label="Painel Admin"
                active={activePath.includes('/admin-panel')}
                onClick={() => setIsOpen(false)}
              />
            </>
          ) : (
            <NavItem
              to="/dashboard/profile"
              icon={<User />}
              label="Perfil"
              active={activePath.includes('/profile')}
              onClick={() => setIsOpen(false)}
            />
          )}
        </nav>

        {/* CONSOLE DE TELEMETRIA (SLIM) */}
        <div className="px-5 mb-6 hidden lg:block">
          <div className="p-4 rounded-3xl bg-slate-950/5 border border-white/50 font-mono text-[6px] leading-tight text-slate-400 uppercase tracking-widest h-24 overflow-hidden relative">
            <div className="flex items-center gap-2 mb-2 opacity-30"><Terminal size={8} /> <span>Telemetry_Log</span></div>
            <p className="text-emerald-500/50">Core_Linked</p>
            <p>Sync_Stable_V.4</p>
            <p className="opacity-20 italic mt-1">NX_Protocol_Running...</p>
          </div>
        </div>

        {/* USER CARD (FOOTER) */}
        <div className="p-5 border-t border-white/40 bg-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xs font-black" style={{ color: 'var(--system-color)' }}>
              {isMaster ? 'A' : (character?.identity?.name?.charAt(0) || 'O')}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-800 uppercase truncate">{isMaster ? 'Arquiteto' : (character?.identity?.name || 'Operador')}</p>
              <p className="text-[7px] text-slate-400 font-mono uppercase">{isMaster ? 'Master_Core' : 'Sector_01'}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const NavItem = ({ to, icon, label, active, onClick }: unknown) => {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => { navigate(to); onClick(); }}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all relative group ${active ? 'bg-white shadow-sm' : 'hover:bg-white/30'}`}
    >
      {active && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-4 bg-(--system-color) rounded-r-full" />}
      <div className={`${active ? 'text-(--system-color)' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {React.cloneElement(icon, { size: 16, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {label}
      </span>
    </motion.button>
  );
};