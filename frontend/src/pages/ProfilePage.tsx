import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {
    ScrollText, Crosshair, Activity,
    LayoutDashboard, Zap,
} from 'lucide-react';

// Componentes Sincronizados
import { WeaponCardReview } from '../components/shared/WeaponCardReview';
import { VitalTelemetry } from '../components/shared/VitalTelemetry';
import { IdentityCard } from '../components/shared/IdentityCard';
import { AttributesCard } from '../components/shared/AttributesCard';
import { BackgroundCard } from '../components/shared/BackgroundCard';
import { InventoryDisplay } from '../components/shared/InventoryDisplay';

import { useNexus } from '../hooks/useNexus';
import { useVault } from '../hooks/useVault';

export const ProfilePage = () => {
    const { character, lastPulse, isSyncing } = useNexus();
    const { vault } = useVault();

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Geral', icon: LayoutDashboard },
        { id: 'stats', label: 'Sincronia', icon: Activity },
        { id: 'arsenal', label: 'Arsenal', icon: Crosshair },
        { id: 'lore', label: 'Dossiê', icon: ScrollText },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto space-y-10 pb-32 px-4 md:px-8 relative"
        >
            {/* --- I. ATMOSFERA DE FUNDO (PRISMA GLOW) --- */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            {/* --- III. NAVEGAÇÃO SUPERIOR (DOCK PRISMA) --- */}
            <div className="sticky top-6 z-50">
                <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-full p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex items-center justify-between max-w-lg mx-auto relative overflow-hidden">
                    {/* Grade sutil interna */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[10px_10px]" />

                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative flex-1 py-3 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-500
                                ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}
                            `}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabProfile"
                                    className="absolute inset-0 bg-white shadow-md border border-slate-100 rounded-full z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <tab.icon size={18} className="relative z-10" />
                            <span className="text-[7px] font-black uppercase tracking-[0.2em] relative z-10 hidden sm:block">
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- IV. VIEWPORT DE COMPONENTES --- */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="space-y-12 relative z-10"
                >
                    {/* --- TAB: GERAL (LAYOUT ASSIMÉTRICO) --- */}
                    {activeTab === 'overview' && (
                        <div className="flex flex-col gap-10">

                            {/* Seção 1: Identidade & Background */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                <div className="lg:col-span-12">
                                    <IdentityCard data={character} />
                                </div>
                                <div className="lg:col-span-12">
                                    <VitalTelemetry character={character} vault={vault} />
                                </div>
                                <div className="lg:col-span-12">
                                    <BackgroundCard data={character} />
                                </div>
                                <div className="lg:col-span-12">
                                    <InventoryDisplay items={character?.inventory} />
                                </div>
                            </div>

                            {/* Alerta de Pulso (Só aparece se houver comando do mestre) */}
                            {lastPulse && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-6 rounded-[2.5rem] bg-slate-900 text-white border-2 border-white shadow-2xl flex items-center gap-6"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400">
                                        <Zap size={24} fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inbound_Pulse</p>
                                        <p className="text-sm font-bold uppercase tracking-tight">
                                            Modificador de {lastPulse.type} detectado: {lastPulse.value > 0 ? `+${lastPulse.value}` : lastPulse.value}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* --- TAB: SINCRONIA (DADOS TÉCNICOS) --- */}
                    {activeTab === 'stats' && (
                        <div className="mx-auto space-y-12">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Sincronia_Matriz</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Hardware_Calibration_Alpha</p>
                            </div>
                            <VitalTelemetry character={character} />
                            <AttributesCard data={character} />
                        </div>
                    )}

                    {/* --- TAB: ARSENAL --- */}
                    {activeTab === 'arsenal' && (
                        <div className="mx-auto">
                            <WeaponCardReview data={character} />
                        </div>
                    )}

                    {/* --- TAB: DOSSIÊ --- */}
                    {activeTab === 'lore' && (
                        <div className="mx-auto">
                            <BackgroundCard data={character} />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};