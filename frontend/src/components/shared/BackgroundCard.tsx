import { useMemo } from 'react';
import { motion } from 'framer-motion';

import {
    Database, Binary
} from 'lucide-react';

import { useVault } from '../../hooks/useVault';
import { NexusIcon } from '../common/NexusIcon';
import { LoadingScreen } from '../common/LoadingScreen';

export const BackgroundCard = ({ data, character }) => {
    const { vault, isLoading } = useVault();
    const background = data?.background || character?.background || {};

    const selectedKitData = useMemo(() => {
        const kitRef = background.starterKit;
        return vault?.archetypes.find(a => a._id === kitRef || a.key === kitRef || a.id === kitRef);
    }, [vault, background.starterKit]);

    const selectedOriginData = useMemo(() => {
        const originRef = background.origin;
        return vault?.clubs.find(c => c._id === originRef || c.key === originRef || c.id === originRef);
    }, [vault, background.origin]);

    if (isLoading || !vault?.archetypes) {
        return <LoadingScreen message="Calibrando Matriz..." />;
    }

    return (
        <div className="flex flex-col gap-5 md:gap-8">
            {/* --- SEÇÃO 01: LOGÍSTICA (STARTER KIT) --- */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
            >
                <div className="relative p-5 md:p-8 bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-step-kits via-step-kits/20 to-transparent" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* 1.1 HEADER KIT */}
                        <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg z-10 transition-transform duration-500 group-hover:scale-105">
                                    <NexusIcon name={selectedKitData?.iconName || 'Package'} size={24} />
                                    <div className="absolute inset-0 bg-step-kits opacity-20 blur-lg rounded-full animate-pulse" />
                                </div>
                                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                                    {selectedKitData?.name || "Kit Padrão"}
                                </h4>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 italic leading-snug text-center lg:text-left">
                                {selectedKitData?.description}
                            </p>
                        </div>

                        {/* 1.2 GRID DE ITENS (INVENTORY MATRIX) */}
                        <div className="lg:col-span-8 space-y-3">
                            {/* Header de Metadados do Grid */}
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1 h-1 bg-step-kits rounded-full animate-pulse" />
                                    Inventory
                                </span>
                                <span className="text-[7px] font-mono text-slate-300">QTY: {selectedKitData?.items.split(' • ').length || 0}</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                                {selectedKitData?.items.split(' • ').map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        className="group/item relative p-2.5 bg-white/50 backdrop-blur-md border border-white/80 rounded-xl shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Indicador de Slot (Fundo) */}
                                        <div className="absolute top-0 right-0 p-1 opacity-[0.05] group-hover/item:opacity-10 transition-opacity">
                                            <span className="text-[12px] font-black text-slate-900 italic">#{idx + 1}</span>
                                        </div>

                                        <div className="flex items-start gap-2 relative z-10">
                                            {/* Marcador Técnico Lateral */}
                                            <div className="flex flex-col gap-0.5 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-[0.2rem] bg-step-kits/20 group-hover/item:bg-step-kits transition-colors" />
                                                <div className="w-1.5 h-3 rounded-full bg-slate-100 group-hover/item:bg-step-kits/10 transition-colors" />
                                            </div>

                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[7px] font-mono font-black text-slate-300 uppercase tracking-tighter mb-0.5">
                                                    Slot_0{idx + 1}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-tight wrap-break-word pr-2">
                                                    {item}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Efeito de Reflexo no Hover */}
                                        <div className="absolute inset-0 bg-linear-to-tr from-step-kits/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* --- SEÇÃO 02: ORIGEM (BACKGROUND) --- */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
            >
                <div className="relative p-6 md:p-10 bg-white/30 backdrop-blur-2xl border border-white rounded-[3rem] shadow-xl overflow-hidden">
                    {/* Linha Lateral de Atividade */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-20 bg-step-background rounded-r-full opacity-60" />

                    <div className="relative z-10 flex flex-col gap-8">
                        {/* TOP HEADER */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white rounded-3xl shadow-md border border-slate-100 flex items-center justify-center text-step-background">
                                    <NexusIcon name={selectedOriginData?.iconName || 'Terminal'} size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-step-background uppercase tracking-[0.4em]">Neural_Entry</span>
                                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                                        {selectedOriginData?.name || 'Desconhecido'}
                                    </h2>
                                </div>
                            </div>

                            {/* STATUS MINIATURE */}
                            <div className="flex flex-col items-end gap-1.5 opacity-60 scale-75 origin-right">
                                <div className="flex gap-1">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`w-3 h-1 rounded-full ${i < 5 ? 'bg-step-background shadow-[0_0_5px_var(--color-step-background)]' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                                <span className="text-[7px] font-mono font-bold text-slate-400 uppercase tracking-widest">Signal_84%</span>
                            </div>
                        </div>

                        {/* BIOGRAPHY NARRATIVE */}
                        <div className="relative px-4 md:px-8 py-2">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100" />
                            <p className="text-base md:text-xl font-medium text-slate-600 leading-relaxed italic font-serif">
                                "{background.biography || 'Fragmentos de memória dispersos detectados...'}"
                            </p>
                        </div>

                        {/* TECHNICAL FOOTER */}
                        <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Database size={10} className="text-step-background/40" />
                                    <span className="text-[8px] font-mono font-bold text-slate-300 uppercase">Sector_0x7F</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Binary size={10} className="text-step-background/40" />
                                    <span className="text-[8px] font-mono font-bold text-slate-300 uppercase">Sync_2026</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex gap-0.5">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className={`w-0.5 bg-slate-900 ${i % 3 === 0 ? 'h-3' : 'h-1.5'} opacity-20`} />
                                    ))}
                                </div>
                                <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">End_File</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};