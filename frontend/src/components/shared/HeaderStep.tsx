import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { NexusIcon } from '../common/NexusIcon';

export const HeaderStep = ({
    icon,
    label,
    title,
    highlight,
    description,
    accentColor,
    secondaryColor,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
                '--accent-color': accentColor,
                '--secondary-color': secondaryColor
            } as React.CSSProperties}
            className={`
                relative p-5 md:p-10 rounded-[2.2rem] md:rounded-[3.5rem] overflow-hidden mb-6 md:mb-12
                bg-white/30 backdrop-blur-3xl border-2 border-white/80
                shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),inset_0_0_40px_rgba(255,255,255,0.5)]
            `}
        >
            {/* 1. NÚCLEO CRYSTAL: Gradiente Radial de Profundidade */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: `radial-gradient(circle at 20% 20%, var(--accent-color), transparent 70%)` }} />

            {/* 2. SCANLINE HUD: Otimizado para Mobile (Menor opacidade) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,var(--accent-color)_2px)] bg-size-[100%_3px]" />
            </div>

            {/* 3. REFLEXO DE LENTE (GLOSS) */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white to-transparent opacity-100" />
            <div className="absolute top-0 left-0 w-px h-full bg-linear-to-b from-white/80 to-transparent opacity-50" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">

                {/* --- REATOR DE ÍCONE (DESIGN COMPACTO) --- */}
                <div className="relative group">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-white/90 border-2 border-white rounded-3xl md:rounded-[2.2rem] flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-500 group-hover:rotate-3">
                        {/* Shimmer de Energia Interna */}

                        <div className="relative z-10 drop-shadow-[0_0_8px_var(--accent-color)]" style={{ color: 'var(--accent-color)' }}>
                            <NexusIcon name={icon} size={32} />
                        </div>

                        {/* LED DE STATUS (NEXUS DOT) */}
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full border border-white shadow-[0_0_8px_var(--accent-color)]"
                            style={{ backgroundColor: 'var(--accent-color)' }} />
                    </div>

                    {/* Radar HUD Sutil */}
                    <div className="absolute -inset-2 border border-dashed rounded-full animate-[spin_20s_linear_infinite] pointer-events-none opacity-20"
                        style={{ borderColor: 'var(--accent-color)' }} />
                </div>

                {/* --- TEXTOS DE IDENTIFICAÇÃO (HIERARQUIA MOBILE) --- */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-color)' }} />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-60" style={{ color: 'var(--accent-color)' }}>
                            {label}
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter leading-tight">
                        {title} <span className="text-transparent bg-clip-text bg-linear-to-br from-(--accent-color) via-(--accent-color) to-(--secondary-color)">{highlight}</span>
                    </h2>

                    {/* BADGE DE PERFORMANCE (COMPRIMIDO PARA MOBILE) */}
                    <div className="flex items-center gap-2 py-1.5 px-4 bg-white/50 border border-white/80 rounded-full backdrop-blur-md shadow-sm mt-1">
                        <Zap size={10} className="text-amber-400 animate-pulse" />
                        <p className="text-[8px] md:text-xs font-bold text-slate-500 uppercase tracking-widest italic">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. BEAM DE DADOS (FEIXE CONCENTRADO) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-900/5 overflow-hidden">
                <div className="h-full w-full opacity-80"
                    style={{
                        background: `linear-gradient(to right, transparent, var(--accent-color), transparent)`,
                        boxShadow: `0 0 15px var(--accent-color)`
                    }} />
                {/* Core do Feixe de Luz */}
                <div className="absolute inset-0 bg-white/50 blur-[1px]" />
            </div>
        </motion.div>
    );
};
