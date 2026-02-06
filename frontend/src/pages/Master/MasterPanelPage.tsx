import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, SearchX, RefreshCw, Terminal, Activity } from 'lucide-react';

// --- INFRAESTRUTURA ---
import { triggerHaptic } from '../../utils/triggerHaptic';
import { useVault } from '../../hooks/useVault';
import { useMasterNexus } from '../../hooks/useMasterNexus';

// --- COMPONENTES ---
import { MasterHeader } from './components/MasterHeader';
import { CharacterCard } from './components/CharacterCard';
import { DossierAtmosphere } from '../../components/shared/DossierAtmosphere';

export const MasterPanelPage = () => {
    // 1. HOOKS DE ESTADO GLOBAL
    const { vault, loading: vaultLoading } = useVault();

    // O useMasterNexus agora gerencia: characters, isLoading, modulate e socket listeners
    const {
        characters,
        isLoading: nexusLoading,
        modulate,
        changeStatus,
        refresh,
        sendPulse
    } = useMasterNexus();

    // 2. ESTADOS LOCAIS DE UI
    const [searchTerm, setSearchTerm] = useState("");
    const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);

    // 3. AÇÕES DE COMANDO
    const handleGlobalSync = async () => {
        setIsGlobalSyncing(true);
        triggerHaptic('SUCCESS');
        await refresh(); // Função de recarga vinda do hook
        setTimeout(() => setIsGlobalSyncing(false), 1000);
    };

    // 4. FILTRAGEM (Computação Derivada)
    const filteredChars = useMemo(() => {
        return characters.filter(c =>
            c.identity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c._id.includes(searchTerm)
        );
    }, [characters, searchTerm]);

    // 5. LOADING STATE
    if ((nexusLoading && characters.length === 0) || vaultLoading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
                <div className="relative w-16 h-16">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-amber-500 rounded-full"
                    />
                    <Radar size={24} className="absolute inset-0 m-auto text-amber-500 animate-pulse" />
                </div>
                <h2 className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px]">Varrendo_Sinais_Nexus...</h2>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <DossierAtmosphere accentColor="#f59e0b" />

            <div className="max-w-6xl mx-auto space-y-6 pb-20 pt-8 relative z-10 px-4 md:px-0">
                {/* --- HEADER --- */}
                <MasterHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalSinals={characters.length}
                    onGlobalSync={handleGlobalSync}
                    isSyncing={isGlobalSyncing}
                />

                {/* --- STATUS HUD --- */}
                <div className="flex items-center justify-between px-6 py-2.5 bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-emerald-500" />
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Sinais: Ativos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Terminal size={12} className="text-amber-500" />
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Master_Override: On</span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isGlobalSyncing && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-amber-600"
                            >
                                <RefreshCw size={10} className="animate-spin" />
                                <span className="text-[7px] font-black uppercase tracking-widest italic">Syncing_Core...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- GRID DE OPERADORES --- */}
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredChars.length > 0 ? (
                            filteredChars.map((char, index) => (
                                <CharacterCard
                                    key={char._id}
                                    character={char}
                                    vault={vault}
                                    index={index}
                                    onModulate={modulate} // Conecta direto com a lógica do hook
                                    onStatusChange={changeStatus} // Conecta direto com a lógica do hook
                                    onSendPulse={sendPulse}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-48 flex flex-col items-center justify-center bg-white/20 backdrop-blur-sm rounded-4xl border-2 border-dashed border-slate-100"
                            >
                                <SearchX size={32} className="text-slate-200 mb-3" />
                                <h3 className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Nenhum_Sinal_Detectado</h3>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};