import React from 'react';
import { motion } from 'framer-motion';
import { NodeCard } from './NodeCardWeapon';
import { useVault } from '../../hooks/useVault';
import { NexusIcon } from '../common/NexusIcon';

import {
    Activity,
    Info,
    Maximize,
    AlertTriangle,
} from 'lucide-react';

export const WeaponCardReview = ({ data }) => {

    const { vault, isLoading } = useVault();

    const selectedWeapon = React.useMemo(() => {
        if (!vault?.weapons || !data?.weapons?.primary) return null;

        // Tenta encontrar pelo _id (padrão DB) OU pelo nome (fallback de transição)
        return vault.weapons.find((w: any) =>
            w._id === data.weapons.primary ||
            w.name === data.weapons.primary ||
            w.key === data.weapons.primary
        );
    }, [vault, data]);

    // 2. LOADING STATE: Evita o erro de "null" enquanto o banco responde
    if (isLoading || !selectedWeapon) {
        return (
            <div className="p-10 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Aguardando_Sincronia_Arsenal</span>
            </div>
        );
    }

    // 3. DESESTRUTURAÇÃO SEGURA (Dados Populados)
    const essence = selectedWeapon.essenceId;
    const status = essence?.statusId;
    const colorToken = essence?.colorVar || 'var(--color-neutro)';

    const hasSynergy = selectedWeapon?.specialNotes?.includes('SINERGIA:');
    const synergyText = hasSynergy ? selectedWeapon.specialNotes.split('SINERGIA:')[1] : null;

    return (

        <motion.div
            key={selectedWeapon._id}
            layout
            style={{ '--accent-color': colorToken } as React.CSSProperties}
            className={`
                            relative overflow-hidden flex flex-col transition-all duration-1000
                            bg-white/90 backdrop-blur-3xl border-2 border-white
                            shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05),inset_0_0_80px_rgba(255,255,255,1)]
                            rounded-[3rem] md:rounded-[4.5rem] group hover:scale-[1.01]
                        `}
        >
            {/* 1. REFRAÇÃO DINÂMICA (CAUSTICS) */}
            <div
                className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
                style={{ background: `linear-gradient(to top right, var(--accent-color), white)` }}
            />
            <div
                className="absolute -bottom-40 -right-40 w-120 h-120 rounded-full blur-[120px] pointer-events-none opacity-10"
                style={{ backgroundColor: 'var(--accent-color)' }}
            />

            <div className="relative z-10 flex flex-col h-full">

                {/* 2. STATUS ALERT STRIP (ALERTA DE HARDWARE) */}
                <div
                    className="relative w-full py-2 px-6 md:px-16 flex justify-between items-center overflow-hidden transition-colors duration-700"
                    style={{ backgroundColor: selectedWeapon ? 'var(--accent-color)' : '#e2e8f0' }}
                >
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                    />

                    <div className="flex items-center gap-2 relative z-10 text-white">
                        <AlertTriangle size={10} className="animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-90">
                            Status_Protocol_Active
                        </span>
                    </div>

                    <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">
                        {status.name || 'Sistema Estável'}
                    </span>
                </div>

                <div className="p-5 md:p-10 space-y-6 md:space-y-10 relative z-10">
                    <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 relative">

                        {/* REATOR DE ESSÊNCIA (O PRISMA CENTRAL) */}
                        <div className="relative shrink-0 group/reactor">
                            <div
                                className="absolute -inset-6 blur-3xl opacity-20 animate-pulse pointer-events-none"
                                style={{ backgroundColor: 'var(--accent-color)' }}
                            />

                            <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-[3rem] md:rounded-[4rem] flex items-center justify-center transition-all duration-700 bg-white border-2 border-white shadow-xl overflow-hidden backdrop-blur-3xl">
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{ backgroundColor: 'var(--accent-color)' }}
                                />
                                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/60 to-transparent pointer-events-none" />

                                <div
                                    className="scale-[2.5] md:scale-[3.5] relative z-10 transition-all duration-700 group-hover/reactor:scale-[3.8] group-hover/reactor:rotate-12"
                                    style={{ color: 'var(--accent-color)', filter: 'drop-shadow(0 0 10px currentColor)' }}
                                >
                                    <NexusIcon name={essence?.iconName} />
                                </div>
                            </div>

                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-white/90 backdrop-blur-2xl border border-white rounded-2xl shadow-xl flex items-center gap-2.5">
                                <span
                                    className="text-[10px] font-black uppercase tracking-[0.3em]"
                                    style={{ color: 'var(--accent-color)' }}
                                >
                                    {essence?.name || 'Neutro'}
                                </span>
                            </div>
                        </div>

                        {/* TELEMETRIA DE IDENTIFICAÇÃO */}
                        <div className="flex-1 w-full text-center md:text-left space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-center md:justify-start gap-3 opacity-60">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                                        Legacy_Hardware_Link
                                    </span>
                                </div>

                                <h4 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-slate-900">
                                    {selectedWeapon?.name || 'Punhos Nus'}
                                </h4>
                            </div>

                            {/* BARRA DE FLUXO NEURAL (SYNC FLOW) */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Neural_Sync_Flow</span>
                                    <span
                                        className="text-[9px] font-mono font-black animate-pulse"
                                        style={{ color: 'var(--accent-color)' }}
                                    >
                                        {selectedWeapon ? '99.8%_ACTIVE' : 'STANDBY'}
                                    </span>
                                </div>

                                <div className="relative h-2.5 w-full bg-slate-100/50 rounded-full border border-white shadow-inner p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: selectedWeapon ? '100%' : '15%' }}
                                        className="h-full rounded-full relative overflow-hidden transition-all duration-1000"
                                        style={{
                                            backgroundColor: 'var(--accent-color)',
                                            boxShadow: `0 0 15px var(--accent-color)`
                                        }}
                                    >
                                        <motion.div
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. MÓDULO DE DIAGNÓSTICO */}
                    <div className="space-y-4">
                        <div className="p-5 rounded-[2.2rem] bg-white border border-white shadow-inner relative overflow-hidden">
                            <div
                                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundColor: 'var(--accent-color)' }}
                            />
                            <div className="flex items-center gap-4 mb-2">
                                <div
                                    className="p-2 rounded-xl bg-white shadow-sm"
                                    style={{ color: 'var(--accent-color)' }}
                                >
                                    <Info size={16} strokeWidth={2.5} />
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Affliction_Protocol</span>
                            </div>
                            <p className="text-[11px] md:text-xs font-bold text-slate-600 leading-relaxed italic pl-1.5 border-l-2 border-slate-100">
                                "{status?.description || 'Aguardando aplicação de status...'}"
                            </p>
                        </div>

                        {/* NODES TÁTICOS (REUTILIZANDO O SEU COMPONENTE) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <NodeCard
                                icon={<Activity />}
                                label="Efeito_Primário"
                                value={selectedWeapon?.description || '--'}
                                colorToken={colorToken}
                            />
                            <NodeCard
                                icon={<NexusIcon name={essence?.iconName} />}
                                label="Mecânica_Status"
                                value={status?.mechanic || 'Estável'}
                                colorToken={colorToken}
                            />
                            {synergyText && (
                                <div className="md:col-span-2">
                                    <NodeCard
                                        icon={<Maximize />}
                                        label="Sinergia_Neural"
                                        value={synergyText}
                                        colorToken={colorToken}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="relative py-4 w-full bg-white/60 border-t border-white/80 flex flex-col items-center justify-center gap-1">
                    <span className="text-[6px] font-mono font-bold text-slate-400 uppercase tracking-[0.5em]">
                        Nexus_Forger_NX_Review
                    </span>
                </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white to-transparent opacity-100" />
        </motion.div>
    );
};