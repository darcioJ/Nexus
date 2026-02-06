import React from 'react';
import { motion } from 'framer-motion';

export const NodeCard = ({ icon, label, value, colorToken }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            /* INJEÇÃO DE VARIÁVEL: O Core do sistema para evitar bugs */
            style={{ '--accent-color': colorToken } as React.CSSProperties}
            className={`
                relative p-5 md:p-7 rounded-4xl md:rounded-[3rem] transition-all duration-1000
                /* CHASSIS: Glassmorphism de Alta Pureza */
                bg-white/5 backdrop-blur-[32px] border-2 border-white/40
                shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),inset_0_0_30px_rgba(255,255,255,0.3)]
                group overflow-hidden flex flex-col justify-between
            `}
        >
            {/* 1. NÚCLEO DE LUZ: Bloom dinâmico via Variável CSS */}
            <div 
                className="absolute -inset-10 opacity-15 blur-[80px] transition-all duration-1000 group-hover:opacity-30 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, var(--accent-color), transparent)` }}
            />

            {/* 2. WATERMARK ESPECTRAL: Refração de Fundo */}
            <div 
                className="absolute -right-4 -bottom-4 opacity-[0.08] transition-all duration-1000 group-hover:opacity-[0.15] group-hover:-rotate-6 group-hover:scale-110 pointer-events-none"
                style={{ color: 'var(--accent-color)', filter: 'drop-shadow(0 0 15px currentColor)' }}
            >
                {React.cloneElement(icon as React.ReactElement, { size: 100, strokeWidth: 1 })}
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                {/* SOCKET: Módulo de Hardware com Glow Interno */}
                <div className="flex items-center gap-3">
                    <div 
                        className="relative w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center shadow-inner"
                        style={{ color: 'var(--accent-color)' }}
                    >
                        <div 
                            className="absolute inset-0 rounded-2xl opacity-20"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                        />
                        {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: 2.5, className: "relative z-10" })}
                    </div>

                    <div className="flex flex-col">
                        <span 
                            className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] opacity-80"
                            style={{ color: 'var(--accent-color)' }}
                        >
                            {label}
                        </span>
                        {/* Micro-pontos de Sincronia */}
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3].map(i => (
                                <div 
                                    key={i} 
                                    className="w-1 h-1 rounded-full opacity-30" 
                                    style={{ backgroundColor: 'var(--accent-color)' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* CONTEÚDO: Tipografia Tática */}
                <div className="space-y-1">
                    <p className="text-sm md:text-lg font-bold leading-tight tracking-tight text-slate-600 group-hover:text-slate-900 transition-colors duration-500">
                        {value}
                    </p>
                </div>
            </div>

            {/* 3. SHINE: Varredura de Reflexo Polido */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            {/* RIM LIGHT: Borda Superior de Cristal */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
        </motion.div>
    );
};