import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal, Activity, BookOpen, Zap,
    ShieldCheck, Binary, BarChart3
} from 'lucide-react';

import { NodeCard } from '../../shared/NodeCardWeapon';
import { AfflictionMonitor } from './AfflictionMonitor';

export const WeaponDossier = ({ weapon, colorToken, status, essenceInfo }) => {

    const synergyNotes = weapon.specialNotes?.filter((n: any) =>
        n.category?.toUpperCase() === 'SINERGIA'
    ) || [];

    const technicalNotes = weapon.specialNotes?.filter((n: any) =>
        n.category?.toUpperCase() !== 'SINERGIA'
    ) || [];

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="px-2 md:px-6 pb-12 overflow-hidden"
            style={{ '--accent-color': colorToken } as React.CSSProperties}
        >
            <div className={`
                mt-6 mx-auto max-w-5xl p-6 md:p-12 space-y-10
                bg-white/70 backdrop-blur-2xl rounded-[3.5rem] md:rounded-[4.5rem] 
                border-2 border-white relative overflow-hidden
            `}
                style={{
                    boxShadow: `inset 0 0 40px ${colorToken}10, 0 25px 50px -15px rgba(0,0,0,0.1)`
                }}>

                {/* --- 3. HEADER: IDENTIFICAÇÃO DE HARDWARE --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8 relative z-10">
                    <div className="flex items-center gap-6">
                        {/* Reator de Ícone (Socket de Segurança) */}
                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white/50 border border-slate-100 rounded-4xl flex items-center justify-center shadow-lg overflow-hidden group">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: colorToken }} />
                            <Terminal size={28} strokeWidth={2.5} style={{ color: colorToken }} className="group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="flex flex-col text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <Activity size={12} className="animate-pulse" style={{ color: colorToken }} />
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                                    Análise_Dados
                                </span>
                            </div>
                            <h4 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                                Especificação <span style={{ color: colorToken }}>Técnica</span>
                            </h4>
                        </div>
                    </div>
                </div>

                {/* --- 4. DATA GRID: EXTRAÇÃO DE DADOS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-10">

                    {/* Atributos Secundários / Tipo */}
                    <div className="md:col-span-1">
                        <NodeCard
                            icon={<BookOpen />}
                            label="Registro"
                            value={weapon.description}
                            colorToken={colorToken}
                        />
                    </div>

                    {/* 3. MAP: Notas Técnicas (Controle, Lore, Tático, etc.) */}
                    <AnimatePresence>
                        {technicalNotes.map((note: any, index: number) => (
                            <motion.div
                                key={note._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <NodeCard
                                    // Helper para escolher ícone baseado na categoria
                                    icon={<Binary />}
                                    label={note.category}
                                    value={note.content}
                                    colorToken={colorToken}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* 4. MAP: Notas de Sinergia (Destaque Visual) */}
                    <div className="md:col-span-2 grid grid-cols-1 gap-4">
                        {synergyNotes.map((note: any, index: number) => (
                            <motion.div
                                key={note._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (technicalNotes.length + index) * 0.1 }}
                            >
                                <NodeCard
                                    icon={<Zap className="animate-bounce" />}
                                    label="Sinergia"
                                    value={note.content}
                                    colorToken={colorToken}
                                    isHighlight
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- 5. BIO-MONITOR INTEGRADO --- */}
                <div className="pt-4 relative z-10">
                    <div className="flex items-center gap-3 mb-6 pl-2">
                        <BarChart3 size={14} style={{ color: colorToken }} />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
                            Análise_de_Efeito_Status
                        </span>
                    </div>
                    <AfflictionMonitor
                        status={status}
                        colorToken={colorToken}
                        vs={essenceInfo?.advantageAgainst}
                        weaponStatus={weapon.status}
                    />
                </div>

                {/* --- 6. FOOTER: BARRAMENTO DE ENERGIA --- */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
                    <div className="flex items-center gap-4">
                        <ShieldCheck size={14} style={{ color: colorToken }} />
                        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500">
                            Integridade_do_Dossiê_Confirmada
                        </span>
                    </div>
                    <div className="h-px flex-1 bg-slate-100 hidden md:block mx-8" />
                    <span className="text-[7px] font-mono text-slate-400 tracking-[0.5em]">
                        PRISMA_NEXUS_VAULT_2026
                    </span>
                </div>
            </div>
        </motion.div>
    );
};