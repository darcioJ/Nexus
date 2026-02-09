import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NexusIcon } from '../../common/NexusIcon'; // Importação do núcleo de ícones

export const CrystalReactor = ({ iconName, isSelected, colorToken }) => (
    <div className="relative shrink-0 flex items-center justify-center">
        {/* 1. AURA EXTERNA (REATOR ATIVO) */}
        <AnimatePresence>
            {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">                    
                    {/* Pulso Volumétrico (Glow) */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.05, 0.15] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full blur-3xl" 
                        style={{ backgroundColor: colorToken }} 
                    />
                </div>
            )}
        </AnimatePresence>

        {/* 2. CORPO DO REATOR (CRISTAL VITRIFICADO) */}
        <motion.div 
            animate={{ 
                scale: isSelected ? 1 : 0.95,
                y: isSelected ? -5 : 0
            }}
            className={`
                relative w-32 h-32 md:w-40 md:h-40 rounded-[2.8rem] md:rounded-[3.8rem] 
                flex items-center justify-center border-2 transition-all duration-500 overflow-hidden
                ${isSelected 
                    ? 'bg-white/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-white' 
                    : 'bg-white/40 backdrop-blur-md border-white/50 text-slate-300 shadow-sm'}
            `}
            style={{ 
                boxShadow: isSelected ? `inset 0 0 20px ${colorToken}15, 0 10px 30px -10px ${colorToken}40` : ''
            }}
        >
            {/* SCANLINES INTERNAS (HUD DE SINCRONIA) */}
            {isSelected && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div 
                        className="absolute inset-0" 
                        style={{ 
                            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${colorToken} 3px)`,
                            backgroundSize: '100% 4px'
                        }} 
                    />
                </div>
            )}

            {/* TEXTURA DE FUNDO (EMISSÃO RADIAL) */}
            <div 
                className={`absolute inset-0 transition-opacity duration-700 ${isSelected ? 'opacity-10' : 'opacity-0'}`}
                style={{ background: `radial-gradient(circle at center, ${colorToken}, transparent)` }}
            />

            {/* 3. ÍCONE DINÂMICO (NEXUS ICON SYSTEM) */}
            <div 
                className={`transition-all duration-700 relative z-10 ${isSelected ? 'scale-[2.8] rotate-6' : 'scale-[1.5] opacity-40 grayscale'}`} 
                style={{ color: isSelected ? colorToken : 'currentColor' }}
            >
                <NexusIcon name={iconName} size={16} strokeWidth={2.5} />
            </div>

            {/* 4. EFEITO DE REFRAÇÃO (PRISMA GLOSS) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-linear-to-br from-white/40 via-transparent to-transparent -rotate-45 opacity-60" />
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white to-transparent" />
            </div>
        </motion.div>
    </div>
);