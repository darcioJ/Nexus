import React from 'react';
import { motion } from 'framer-motion';
import { NexusIcon } from '../../../components/common/NexusIcon';
import { Target, Zap, ChevronRight, Radio } from 'lucide-react';

interface WeaponCardTriggerProps {
    weapon: unknown;
    onClick: () => void;
}

export const WeaponCardTrigger: React.FC<WeaponCardTriggerProps> = ({ weapon, onClick }) => {
    const essence = weapon.essenceId;
    const colorToken = essence?.colorVar || 'var(--color-neutro)';

    return (
        <motion.div
            layoutId={`weapon-${weapon._id}`}
            onClick={onClick}
            style={{ '--accent-color': colorToken } as React.CSSProperties}
            className={`
        group relative p-8 rounded-[3.5rem] cursor-pointer
        /* CHASSIS: Cerâmica Branca Refratária */
        bg-white/70 backdrop-blur-2xl border-2 border-white
        transition-all duration-700 flex flex-col h-full overflow-hidden
        shadow-[0_20px_50px_-20px_rgba(15,23,42,0.08),inset_0_0_40px_white]
        hover:shadow-[0_30px_70px_-15px_var(--accent-color)]/30 hover:-translate-y-2
      `}
        >
            {/* 1. LINHA DE FÓTONS (RIM LIGHT SUPERIOR) */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white to-transparent opacity-100" />

            {/* 2. LUZ INCIDENTE (REFRAÇÃO LATERAL) */}
            <div
                className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-10 group-hover:opacity-30 transition-all duration-1000 pointer-events-none"
                style={{ backgroundColor: 'var(--accent-color)' }}
            />

            <div className="relative z-10 flex flex-col h-full space-y-8">

                {/* HEADER: TELEMETRIA DE IDENTIFICAÇÃO */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Radio size={10} className="text-slate-300 group-hover:text-accent-color animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">
                                {weapon.typeLabel || "Standard_Unit"}
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none transition-transform group-hover:translate-x-1" style={{ color: 'var(--accent-color)' }}>
                            {weapon.name}
                        </h3>
                    </div>

                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center justify-center group-hover:border-slate-100 transition-all duration-500" style={{ color: 'var(--accent-color)' }}>
                        <Target size={20} strokeWidth={1.5} />
                    </div>
                </div>

                {/* MÓDULO DO REATOR (O CORE) */}
                <div className="flex items-center gap-6 p-4 rounded-[2.5rem] bg-white/40 border border-white shadow-[inset_0_0_20px_rgba(255,255,255,0.8)]">
                    <motion.div
                        layoutId={`icon-${weapon._id}`}
                        className="w-20 h-20 rounded-4xl bg-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1),inset_0_0_20px_white] border-2 border-white flex items-center justify-center relative overflow-hidden shrink-0 group-hover:rotate-6 transition-transform duration-500"
                        style={{ color: 'var(--accent-color)' }}
                    >
                        <div className="absolute inset-0 opacity-5" style={{ backgroundColor: 'var(--accent-color)' }} />
                        <NexusIcon name={essence?.iconName} size={40} className="relative z-10 drop-shadow-[0_0_10px_var(--accent-color)]" />
                    </motion.div>

                    {/* SYNC STATUS */}
                    <div className="flex flex-col gap-3 w-full pr-2">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                                <Zap size={12} style={{ color: 'var(--accent-color)' }} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{essence?.name}</span>
                            </div>
                            <span className="text-[8px] font-mono font-bold text-slate-300">SYNC_99%</span>
                        </div>

                        <div className="relative h-2 w-full bg-slate-100/50 rounded-full border border-white p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="h-full rounded-full shadow-[0_0_10px_var(--accent-color)]"
                                style={{ backgroundColor: 'var(--accent-color)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* FOOTER: COMANDOS DO SISTEMA */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.4em]">Signal_Range</span>
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter italic">
                            {weapon.range}
                        </span>
                    </div>

                    <div
                        className="flex items-center gap-3 py-2.5 px-6 rounded-2xl bg-white border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-tighter transition-all"
                        style={{ color: 'var(--accent-color)' }}
                    >
                        Dossiê <ChevronRight size={14} />
                    </div>
                </div>
            </div>

            {/* 3. SHINE EFFECT (VARREDURA TÁTICA) */}
            <motion.div
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent pointer-events-none z-0 skew-x-[-25deg]"
            />
        </motion.div>
    );
};