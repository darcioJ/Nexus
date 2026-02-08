import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Activity, Zap, Maximize, AlertTriangle, Crosshair, Target, Shield, Quote } from 'lucide-react';
import { NexusIcon } from '../../components/common/NexusIcon';
import { NodeCard } from '../../components/shared/NodeCardWeapon';

export const WeaponDetailModal = ({ weapon, onClose }) => {
    const essence = weapon.essenceId;
    const status = essence?.statusId;
    const colorToken = essence?.colorVar || 'var(--color-neutro)';

    const synergyNote = weapon.specialNotes?.find((note: any) =>
        note.name?.toUpperCase().includes('SINERGIA')
    );
    const synergyText = synergyNote?.description || null;

    // 2. Localiza o Efeito Principal (o primeiro item que NÃO seja Sinergia, ou o primeiro do array)
    const mainEffect = weapon.specialNotes?.find((note: any) =>
        !note.name?.toUpperCase().includes('SINERGIA')
    )?.description || weapon.specialNotes?.[0]?.description || 'Protocolo de Combate Padrão';

    const modalJSX = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 lg:p-12 overflow-hidden">
            {/* 1. BACKDROP: REFRAÇÃO PRISMÁTICA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-white/40 backdrop-blur-3xl"
            >
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${colorToken}, transparent 70%)` }} />
            </motion.div>

            {/* 2. CHASSIS DO ARMAMENTO (CERÂMICA & VIDRO) */}
            <motion.div
                layoutId={`weapon-${weapon._id}`}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                style={{ '--accent-color': colorToken } as unknown}
                className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl bg-white/80 backdrop-blur-2xl md:rounded-[4rem] border-white/60 md:border-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row overflow-hidden"
            >
                {/* BOTÃO FECHAR (Mobile Optimized) */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-4 bg-slate-900/5 hover:bg-slate-900/10 rounded-full backdrop-blur-md transition-all active:scale-90"
                >
                    <X size={20} className="text-slate-800" />
                </button>

                {/* --- LADO ESQUERDO: NÚCLEO DE FORJA (NXS_CORE) --- */}
                <div className="w-full lg:w-[42%] p-10 md:p-16 flex flex-col items-center justify-center bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100 relative shrink-0">
                    {/* Efeito de Aura */}
                    <div className="absolute inset-0 opacity-10 blur-[120px] pointer-events-none" style={{ backgroundColor: 'var(--accent-color)' }} />

                    {/* REATOR DE ESSÊNCIA */}
                    <div className="relative mb-10">
                        <motion.div
                            animate={{
                                rotate: [0, 3, -3, 0],
                                y: [0, -5, 0]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-44 h-44 md:w-64 md:h-64 bg-white rounded-[3.5rem] md:rounded-[5rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.12),inset_0_0_60px_white] border-2 border-white flex items-center justify-center group/reactor"
                        >
                            <div className="absolute inset-0 opacity-5 rounded-[inherit]" style={{ backgroundColor: 'var(--accent-color)' }} />

                            {/* Ícone com Brilho Refratário */}
                            <div className="scale-[3.5] md:scale-[5] transition-transform duration-700 group-hover/reactor:scale-[5.5]" style={{ color: 'var(--accent-color)' }}>
                                <NexusIcon name={essence?.iconName} className="drop-shadow-[0_0_15px_var(--accent-color)]" />
                            </div>

                            {/* Detalhe Técnico: Orbit */}
                            <div className="absolute -inset-3.75 border border-dashed border-slate-200 rounded-full opacity-30 animate-spin-slow" />
                        </motion.div>

                        {/* TAG DE CALIBRAGEM */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-8 py-3 bg-white border border-slate-100 rounded-2xl shadow-xl flex items-center gap-3 z-20">
                            <Zap size={14} style={{ color: 'var(--accent-color)' }} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--accent-color)' }}>
                                {essence?.name || "Standard_Essence"}
                            </span>
                        </div>
                    </div>

                    <div className="text-center space-y-3 relative z-10">
                        <div className="flex items-center justify-center gap-3 opacity-30">
                            <div className="w-8 h-px bg-slate-400" />
                            <span className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-500">Unit_Type_{weapon.typeLabel?.split(' ')[0]}</span>
                            <div className="w-8 h-px bg-slate-400" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ color: 'var(--accent-color)' }}>
                            {weapon.name}
                        </h2>
                    </div>
                </div>

                {/* --- LADO DIREITO: TELEMETRIA DE COMBATE (INTERFACE) --- */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/40">
                    <div className="p-8 md:p-16 space-y-12">

                        {/* HEADER DE STATUS (HARDWARE SCAN) */}
                        <div className="flex items-center justify-between p-5 bg-white rounded-4xl border-2 border-slate-50 shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: 'var(--accent-color)' }} />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-2 bg-slate-50 rounded-lg" style={{ color: 'var(--accent-color)' }}>
                                    <AlertTriangle size={18} className="animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Critical_Affliction</span>
                                    <span className="text-sm font-black uppercase italic text-slate-800">
                                        {status?.name || 'Protocolo Estável'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="text-right hidden sm:block">
                                    <div className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Signal_Intensity</div>
                                    <div className="text-[10px] font-mono font-bold text-slate-900">STABLE_V4</div>
                                </div>
                                <Target size={20} style={{ color: 'var(--accent-color)' }} />
                            </div>
                        </div>

                        {/* DESCRIÇÃO & SINCRONIA NEURAL */}
                        <section className="space-y-8">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Crosshair size={18} />
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Neural_Sync_Flow</span>
                                </div>
                                <span className="text-xs font-mono font-black animate-pulse" style={{ color: 'var(--accent-color)' }}>99.8%_LOCKED</span>
                            </div>

                            <div className="relative h-3 w-full bg-slate-100 rounded-full border border-white shadow-inner p-1 overflow-hidden">
                                <div
                                    className="h-full rounded-full shadow-[0_0_20px_var(--accent-color)]"
                                    style={{ backgroundColor: 'var(--accent-color)' }}
                                />
                            </div>

                            <div className="relative p-6 md:p-10 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-sm">
                                <Quote className="absolute -top-4 -left-4 text-slate-100" size={48} />
                                <p className="text-xl font-medium text-slate-600 italic leading-relaxed relative z-10">
                                    "{weapon.description}"
                                </p>
                            </div>
                        </section>

                        {/* GRID DE MÓDULOS TÁTICOS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <NodeCard
                                icon={<Activity size={18} />}
                                label="Potencial_Letal"
                                value={status?.mechanic || "Dano_Puro"}
                                colorToken={colorToken}
                            />

                            <NodeCard
                                icon={<Shield size={18} />}
                                label="Efeito_Principal"
                                value={mainEffect} // Exibe a descrição da nota principal
                                colorToken={colorToken}
                            />

                            {synergyText && (
                                <div className="md:col-span-2">
                                    <NodeCard
                                        icon={<Maximize size={18} />}
                                        label="Sinergia_Neural"
                                        value={synergyText} // Exibe a descrição da sinergia
                                        colorToken={colorToken}
                                    />
                                </div>
                            )}
                        </div>

                        {/* FOOTER TÉCNICO */}
                        <div className="pt-10 flex items-center justify-between opacity-20 border-t border-slate-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-[7px] font-mono font-bold tracking-[0.5em] text-slate-400 uppercase">Hardware_UID: {weapon._id?.slice(-8).toUpperCase()}</span>
                                <span className="text-[7px] font-mono font-bold tracking-[0.5em] text-slate-400 uppercase">Registry: NXS_VAULT_77</span>
                            </div>
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