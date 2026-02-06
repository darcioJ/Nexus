import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Layers } from 'lucide-react';
import { Badge } from './BadgeWeapon';
import { CrystalReactor } from './CrystalReactor';
import { WeaponDossier } from './WeaponDossier';

export const WeaponCard = ({ weapon, isSelected, onSelect, register }) => {
    // 1. EXTRAÇÃO DE DADOS DO BANCO (Populate System)
    const essence = weapon.essenceId; 
    const status = essence?.baseStatusId; // O objeto de aflição (Queimado, etc.)
    const colorToken = essence?.colorVar || 'var(--color-neutro)';

    return (
        <label
            onClick={() => onSelect(weapon._id)}
            className="group relative block cursor-pointer mb-8 select-none"
        >
            <input type="radio" {...register} value={weapon._id} className="hidden" />

            <motion.div
                animate={{
                    scale: isSelected ? 1.01 : 1,
                    y: isSelected ? -4 : 0
                }}
                className={`
                    relative p-1 rounded-[3.8rem] md:rounded-[4.8rem] transition-all duration-700
                    ${isSelected ? 'bg-white shadow-xl' : 'hover:bg-white/30'}
                `}
                style={{
                    boxShadow: isSelected ? `0 25px 50px -12px ${colorToken}40, inset 0 0 20px ${colorToken}10` : 'none'
                }}
            >
                {/* EFEITO DE GLOW VOLUMÉTRICO */}
                <AnimatePresence>
                    {isSelected && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.12 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 blur-[80px] pointer-events-none"
                            style={{ backgroundColor: colorToken }}
                        />
                    )}
                </AnimatePresence>

                <div className={`
                    relative p-6 md:p-10 backdrop-blur-3xl rounded-[3.5rem] md:rounded-[4.5rem] border-2 transition-all duration-500
                    ${isSelected
                        ? 'bg-white/95 border-white shadow-[inset_0_0_40px_rgba(255,255,255,0.9)]'
                        : 'bg-white/50 border-white/60 shadow-sm'}
                `}>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center relative z-10">

                        {/* REATOR CRYSTAL (Agora recebendo apenas o Nome do Ícone) */}
                        <CrystalReactor
                            iconName={weapon.iconName || essence?.iconName}
                            isSelected={isSelected}
                            colorToken={colorToken}
                        />

                        <div className="flex-1 w-full space-y-6 text-center md:text-left">
                            <h3 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter transition-all duration-700 ${isSelected ? '' : 'text-slate-300 opacity-50'}`}
                                style={{ color: isSelected ? colorToken : '' }}>
                                {weapon.name}
                            </h3>

                            {/* BADGES PRISMA NEXUS */}
                            <div className="grid grid-cols-2 md:flex gap-4 md:gap-5 items-center justify-center md:justify-start">
                                <Badge
                                    label="Essência"
                                    value={essence?.name}
                                    active={isSelected}
                                    colorToken={colorToken}
                                />
                                <Badge
                                    label="Classe"
                                    value={weapon.typeLabel}
                                    active={isSelected}
                                    colorToken={colorToken}
                                />
                                <div className="col-span-2 md:col-span-1 flex justify-center md:block">
                                    <Badge
                                        label="Alcance"
                                        value={weapon.range}
                                        active={isSelected}
                                        colorToken={colorToken}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* INDICADOR DE SELEÇÃO */}
                        <div className="shrink-0">
                            {isSelected ? (
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="w-16 h-16 md:w-20 md:h-20 bg-white border border-slate-50 rounded-full flex items-center justify-center shadow-2xl"
                                    style={{ color: colorToken }}
                                >
                                    <CheckCircle2 size={36} strokeWidth={2.5} className="relative z-10" />
                                </motion.div>
                            ) : (
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/60 bg-white/20 flex items-center justify-center text-slate-300/40">
                                    <Layers size={28} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* DOSSIER: Passando o Status (Aflição) e a Essência (Vantagem) */}
                <AnimatePresence>
                    {isSelected && (
                        <motion.div className="relative mt-2 px-2">
                            <WeaponDossier
                                weapon={weapon}
                                colorToken={colorToken}
                                status={status} // Objeto do banco: description, mechanic, resistance
                                essenceInfo={essence} // Objeto do banco: advantageAgainst
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LINHA DE ENERGIA INFERIOR */}
                <div className="absolute bottom-0 left-16 right-16 h-px opacity-40"
                    style={{ background: `linear-gradient(to right, transparent, ${colorToken}, transparent)` }} />
            </motion.div>
        </label>
    );
};