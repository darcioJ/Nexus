import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, Zap, Info, Quote, Sparkles, Crosshair, X, ShieldAlert, Fingerprint, Activity } from 'lucide-react';
import { useVault } from '../hooks/useVault';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { NexusIcon } from '../components/common/NexusIcon';
import { WeaponCardTrigger } from '../components/shared/WeaponCardTrigger';
import { WeaponDetailModal } from '../components/shared/WeaponDetailModal';

export const Nexuspedia: React.FC = () => {
  const { vault, isLoading } = useVault();
  const [activeTab, setActiveTab] = useState<'essences' | 'weapons'>('essences');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<unknown>(null); // ESTADO DO POP-UP
  const [selectedWeapon, setSelectedWeapon] = useState<unknown>(null);

  const filteredEssences = useMemo(() => {
    if (!vault?.essences) return [];
    return vault.essences.filter((ess: unknown) => {
      const matchesSearch = ess.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCat ? ess.category === selectedCat : true;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCat, vault]);

  const categories = useMemo(() => {
    if (!vault?.essences) return [];
    return Array.from(new Set(vault.essences.map((e: unknown) => e.category)));
  }, [vault]);

  if (isLoading) return <LoadingScreen message="Sincronizando Nexuspédia..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-10 md:space-y-16 px-4 md:px-12 pb-40 relative">

      {/* HEADER (IDÊNTICO AO SEU) */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xs border-b border-white/40 p-6 md:p-8 rounded-3xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5 md:gap-7">
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-white rounded-[1.8rem] shadow-xl flex items-center justify-center">
              <Database size={24} className="text-slate-700" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic leading-none">Nexuspédia</h1>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Vault_Link_Active</span>
            </div>
          </div>

          {/* BUSCA */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Rastrear frequência..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-12 pr-6 rounded-full bg-white/60 border-2 border-white focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm"
            />
            <Search className="absolute left-4 top-4 text-slate-400" size={18} />
          </div>
        </div>
      </header>

      {/* SELETOR DE ABAS */}
      <div className="flex justify-center md:justify-start">
        <div className="bg-white/40 backdrop-blur-md p-1.5 rounded-full border-2 border-white shadow-sm flex gap-1">
          <TabButton label="Essências" isActive={activeTab === 'essences'} onClick={() => setActiveTab('essences')} icon={<Sparkles size={14} />} />
          <TabButton label="Arsenal" isActive={activeTab === 'weapons'} onClick={() => setActiveTab('weapons')} icon={<Crosshair size={14} />} />
        </div>
      </div>

      {/* GRID DE ESSÊNCIAS */}
      <AnimatePresence mode="wait">
        {activeTab === 'essences' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              <FilterButton label="Omni_Link" isActive={!selectedCat} onClick={() => setSelectedCat(null)} />
              {categories.map(cat => (
                <FilterButton key={cat} label={cat} isActive={selectedCat === cat} onClick={() => setSelectedCat(cat)} />
              ))}
            </div>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEssences.map((essence: unknown) => (
                <EssenceCrystalCard
                  key={essence._id}
                  essence={essence}
                  onClick={() => setSelectedItem(essence)}
                />
              ))}
            </main>
          </motion.div>
        ) : (

          <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vault.weapons.map((weapon) => (
              <div key={weapon._id} onClick={() => setSelectedWeapon(weapon)}>
                {/* Aqui você pode usar uma versão simplificada do card como gatilho */}
                <WeaponCardTrigger weapon={weapon}  />
              </div>
            ))}
          </main>
        )}
      </AnimatePresence>

      {/* --- MODAL DE DETALHES (O POP-UP) --- */}
      <AnimatePresence>
        {selectedItem && (
          <EssenceDetailModal
            essence={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedWeapon && (
          <WeaponDetailModal
            weapon={selectedWeapon}
            onClose={() => setSelectedWeapon(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- CARD SIMPLIFICADO (GATILHO) --- */
const EssenceCrystalCard = ({ essence, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${essence._id}`}
      onClick={onClick}
      style={{ '--accent-color': essence.colorVar } as unknown}
      className="group relative p-8 rounded-[3rem] bg-white/60 backdrop-blur-3xl border-2 border-white cursor-pointer transition-all duration-500 overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_var(--accent-color)]/50"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: 'var(--accent-color)' }} />

      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <motion.div
          layoutId={`icon-${essence._id}`}
          className="w-20 h-20 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-xl flex items-center justify-center"
          style={{ color: 'var(--accent-color)' }}
        >
          <NexusIcon name={essence.iconName} size={32} />
        </motion.div>

        <div>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1 block">{essence.category}</span>
          <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">{essence.name}</h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold py-2 px-4 bg-slate-50 rounded-full text-slate-400">
          <Info size={12} /> Clique para Diagnóstico
        </div>
      </div>
    </motion.div>
  );
};

export const EssenceDetailModal = ({ essence, onClose }) => {
  const statusData = essence.statusId;

  const modalJSX = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
      {/* 1. BACKDROP: REFRAÇÃO TOTAL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/40 backdrop-blur-3xl"
      >
        {/* Luzes Incidentes Dinâmicas */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 50%, ${essence.colorVar}22, transparent 70%)` }} />
      </motion.div>

      {/* 2. CHASSIS DO MODAL */}
      <motion.div
        layoutId={`card-${essence._id}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        style={{ '--accent-color': essence.colorVar } as unknown}
        className={`
          relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl 
          bg-white/80 backdrop-blur-2xl 
          md:rounded-[4rem] border-white/60 md:border-4 
          shadow-[0_50px_100px_-20px_rgba(15,23,42,0.15)] 
          flex flex-col lg:flex-row overflow-hidden
        `}
      >
        {/* BOTÃO FECHAR (Mobile Optimized) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-4 bg-slate-900/5 hover:bg-slate-900/10 rounded-full backdrop-blur-md transition-all active:scale-90"
        >
          <X size={20} className="text-slate-800" />
        </button>

        {/* --- LADO ESQUERDO: NÚCLEO DO CRISTAL (CERÂMICA) --- */}
        <div className="w-full lg:w-[40%] p-8 md:p-12 flex flex-col items-center justify-center relative bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="absolute inset-0 opacity-10 blur-[80px]" style={{ backgroundColor: 'var(--accent-color)' }} />

          <motion.div
            layoutId={`icon-${essence._id}`}
            className="relative w-32 h-32 md:w-48 md:h-48 bg-white rounded-[3rem] md:rounded-[4.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1),inset_0_0_40px_white] border-2 border-white flex items-center justify-center mb-8"
            style={{ color: 'var(--accent-color)' }}
          >
            <NexusIcon name={essence.iconName} size={80} className="drop-shadow-[0_0_15px_var(--accent-color)]" />

            {/* Scanline Orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2.5 border border-dashed border-slate-200 rounded-full opacity-40"
            />
          </motion.div>

          <div className="text-center space-y-2 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              {essence.name}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-0.5 bg-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                {essence.category}
              </span>
              <span className="w-8 h-0.5 bg-slate-200" />
            </div>
          </div>
        </div>

        {/* --- LADO DIREITO: TELEMETRIA (SCROLLABLE DATA) --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/40">
          <div className="p-8 md:p-16 space-y-12">

            {/* Seção: Lore & Eficácia */}
            <div className="grid grid-cols-1 gap-10">
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Quote size={18} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Data_Log_Lore</span>
                </div>
                <p className="text-lg md:text-2xl font-medium text-slate-600 italic leading-snug">
                  "{essence.description}"
                </p>
              </section>

              <section className="p-6 md:p-8 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                <div className="flex items-start gap-4">
                  <Activity size={20} className="text-slate-200 mt-1" />
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-2">Vantagem_Tática</span>
                    <p className="text-sm md:text-base font-bold text-slate-800 leading-relaxed">
                      {essence.advantageAgainst}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Seção: Status Effect (Biometria) */}
            {statusData && (
              <section className="space-y-8 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-50" style={{ color: 'var(--accent-color)' }}>
                      <Zap size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Impacto_Sináptico</h4>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                        {statusData.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 italic text-slate-500 text-sm leading-relaxed">
                  "{statusData.description}"
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatusMetricTile
                    label="Mecânica_Dano"
                    value={statusData.mechanic}
                    icon={<Fingerprint size={14} />}
                    color="var(--accent-color)"
                  />
                  <StatusMetricTile
                    label="Escudo_Resistência"
                    value={statusData.resistance}
                    icon={<ShieldAlert size={14} />}
                    color="slate-900"
                  />
                </div>
              </section>
            )}

            {/* Hardware Serial Footer */}
            <div className="flex items-center justify-between opacity-20 pt-10">
              <span className="text-[7px] font-mono font-bold tracking-[0.5em] text-slate-400 uppercase">
                Nexus_Vault_Registry: {essence._id.slice(-8).toUpperCase()}
              </span>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};

/* --- MINI COMPONENTE DE MÉTRICA --- */
const StatusMetricTile = ({ label, value, icon, color }) => (
  <div className="p-6 rounded-4xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2 transition-transform hover:scale-[1.02]">
    <div className="flex items-center gap-2 opacity-30">
      {icon}
      <span className="text-[7px] font-black uppercase tracking-widest text-slate-900">
        {label}
      </span>
    </div>
    <span className="text-sm font-black italic tracking-tight" style={{ color }}>
      {value}
    </span>
  </div>
);

/* --- BOTÕES AUXILIARES (SIMPLIFICADOS) --- */
const TabButton = ({ label, isActive, onClick, icon }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${isActive ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
    {icon} {label}
  </button>
);

const FilterButton = ({ label, isActive, onClick }) => (
  <button onClick={onClick} className={`shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${isActive ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/40 border-white text-slate-400'}`}>
    {label}
  </button>
);