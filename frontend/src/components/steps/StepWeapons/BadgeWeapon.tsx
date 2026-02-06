import React from 'react';

export const Badge = ({ label, value, active, colorToken }) => {
    return (
        <div 
            /* SINCRONIA DE NÚCLEO: Define a cor base do Prisma */
            style={{ '--accent-color': colorToken } as React.CSSProperties}
            className={`
                relative px-5 py-3 rounded-2xl md:rounded-3xl transition-all duration-1000 
                overflow-hidden flex flex-col border-2 backdrop-blur-2xl group/badge select-none
                ${active
                    /* CHASSIS: Vidro Temperado de Alta Refração */
                    ? `bg-white/10 border-white/80 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1),inset_0_0_20px_white] scale-[1.05]`
                    : 'bg-white/5 border-white/5 opacity-20 grayscale hover:opacity-50 hover:grayscale-0'
                }
            `}
        >
            {/* 1. NÚCLEO DE EMISSÃO (GLOW REFRATADO) */}
            {active && (
                <>
                    <div 
                        className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full blur-2xl opacity-30 transition-all duration-1000 group-hover/badge:scale-150 pointer-events-none"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                    />
                </>
            )}

            {/* 2. LABELS TÉCNICOS (TIPOGRAFIA DE PRECISÃO) */}
            <div className="relative z-10 flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1.5 mb-1">
                    <span className={`
                        text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] leading-none
                        ${active ? 'text-slate-400/80' : 'text-slate-500'}
                    `}>
                        {label}
                    </span>
                </div>

                <span 
                    className={`text-[10px] md:text-[12px] font-black tracking-tighter uppercase transition-all duration-1000 leading-none`}
                    style={{ 
                        color: active ? 'var(--accent-color)' : '#94a3b8',
                        textShadow: active ? `0 0 10px ${colorToken}40` : 'none'
                    }}
                >
                    {value}
                </span>
            </div>

            {/* 3. CAUSTICS & REFRACTION (CAMADA DE BRILHO) */}
            <div className={`
                absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent 
                opacity-0 group-hover/badge:opacity-100 transition-opacity duration-1000 pointer-events-none
            `} />

            {/* RIM LIGHT: Polimento de Borda Superior */}
            <div className={`absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/90 to-transparent transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`} />
        </div>
    );
};