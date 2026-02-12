import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, Sparkles, Crosshair, Book, FilePlus } from 'lucide-react';
import { useVault } from '../../hooks/useVault';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { WeaponCardTrigger } from './Weapon/WeaponCardTrigger';
import { WeaponDetailModal } from './Weapon/WeaponDetailModal';
import { EssenceCrystalCard } from './Essence/EssenceCrystalCard';
import { EssenceDetailModal } from './Essence/EssenceDetailModal';
import { useArchive } from '../../hooks/useArchive'; // O hook que criamos
import { ArchiveCard } from './Archive/ArchiveCard';
import { ArchiveDetailModal } from './Archive/ArchiveDetailModal';
import { ArchiveFormModal } from './Archive/ArchiveFormModal';

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

export const Nexuspedia: React.FC = () => {
  const { vault, isLoading } = useVault();
  const { archives, fetchAll, addArchive, editArchive, removeArchive } = useArchive();

  const [activeTab, setActiveTab] = useState<'essences' | 'weapons' | 'archives'>('essences');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState(); // ESTADO DO POP-UP
  const [selectedWeapon, setSelectedWeapon] = useState();
  const [selectedArchive, setSelectedArchive] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Efeito para carregar os arquivos ao montar
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Lógica de filtragem para Arquivos
  const filteredArchives = useMemo(() => {
    if (!archives) return [];
    return archives.filter((arc) => {
      const matchesSearch = arc.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCat ? arc.category === selectedCat : true;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCat, archives]);

  // Categorias dinâmicas baseadas na aba ativa
  const currentCategories = useMemo(() => {
    if (activeTab === 'essences') return Array.from(new Set(vault?.essences?.map((e) => e.category) || []));
    if (activeTab === 'archives') return ["LORE", "REGRAS", "LOGS", "SISTEMA"];
    return [];
  }, [activeTab, vault, archives]);


  const filteredEssences = useMemo(() => {
    if (!vault?.essences) return [];
    return vault.essences.filter((ess) => {
      const matchesSearch = ess.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCat ? ess.category === selectedCat : true;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCat, vault]);

  const categories = useMemo(() => {
    if (!vault?.essences) return [];
    return Array.from(new Set(vault.essences.map((e) => e.category)));
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
          <TabButton label="Códice" isActive={activeTab === 'archives'} onClick={() => { setActiveTab('archives'); setSelectedCat(null); }} icon={<Book size={14} />} />
        </div>
      </div>

      {/* GRID PRINCIPAL SINCROZINADO */}
      <AnimatePresence mode="wait">
        {(() => {
          switch (activeTab) {
            case 'essences':
              return (
                <motion.div
                  key="essences-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    <FilterButton label="Omni_Link" isActive={!selectedCat} onClick={() => setSelectedCat(null)} />
                    {currentCategories.map(cat => (
                      <FilterButton key={cat} label={cat} isActive={selectedCat === cat} onClick={() => setSelectedCat(cat)} />
                    ))}
                  </div>

                  <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEssences.filter((essence) => !essence.isSystem).map((essence) => (
                      <EssenceCrystalCard
                        key={essence._id}
                        essence={essence}
                        onClick={() => setSelectedItem(essence)}
                      />
                    ))}
                  </main>
                </motion.div>
              );

            case 'weapons':
              return (
                <motion.main
                  key="weapons-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {vault.weapons.filter((attr) => !attr.isSystem).map((weapon) => (
                    <WeaponCardTrigger
                      key={weapon._id}
                      weapon={weapon}
                      onClick={() => setSelectedWeapon(weapon)}
                    />
                  ))}
                </motion.main>
              );

            case 'archives':
              return (
                <motion.div
                  key="archives-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center">
                    <FilterButton label="Omni_Link" isActive={!selectedCat} onClick={() => setSelectedCat(null)} />
                    {currentCategories.map(cat => (
                      <FilterButton key={cat} label={cat} isActive={selectedCat === cat} onClick={() => setSelectedCat(cat)} />
                    ))}

                    {/* ACESSO RÁPIDO PARA INJEÇÃO (Mestre_Nexus) */}
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="ml-auto shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                    >
                      <FilePlus size={14} /> Injetar_Log
                    </button>
                  </div>

                  <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArchives.map((archive) => (
                      <ArchiveCard
                        key={archive._id}
                        archive={archive}
                        onClick={() => setSelectedArchive(archive)}
                      />
                    ))}
                  </main>
                </motion.div>
              );

            default:
              return null;
          }
        })()}
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

      {/* --- MODAIS DO CÓDICE --- */}
      <AnimatePresence>
        {selectedArchive && (
          <ArchiveDetailModal
            archive={selectedArchive}
            onClose={() => setSelectedArchive(null)}
            isMaster={true} // Aqui você passaria a lógica do seu hook de Auth
          />
        )}
      </AnimatePresence>

      <ArchiveFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(data) => {
          addArchive(data);
          setIsFormOpen(false);
        }}
      />

    </div>
  );
};