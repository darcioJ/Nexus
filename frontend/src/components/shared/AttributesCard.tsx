import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useVault } from '../../hooks/useVault';
import { NexusIcon } from '../common/NexusIcon';
import { LoadingScreen } from '../common/LoadingScreen';

export const AttributesCard = ({ data, character }) => {
    const { vault, isLoading } = useVault();

    // 1. GARANTE O ACESSO AOS DADOS
    const attributes = character?.attributes || data?.attributes || {};
    const background = character?.background || data?.background || {};

    const selectedClub = React.useMemo(() => {
        if (!vault?.clubs || !background.club) return null;
        const clubRef = String(background.club);

        return vault.clubs.find(c =>
            String(c._id) === clubRef || c.key === clubRef
        );
    }, [vault, background.club]);

    // O bônus geralmente vem via ID no seu novo esquema
    const bonusAttrId = selectedClub?.bonus?.attributeId?._id
        ? String(selectedClub.bonus.attributeId._id)
        : selectedClub?.bonus?.attributeId
            ? String(selectedClub.bonus.attributeId)
            : null;

    if (isLoading || !vault?.attributes) {
        return <LoadingScreen message="Calibrando Matriz de Atributos..." />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4">
            {vault.attributes.filter((attr) => !attr.isSystem).map((attr) => {
                const attrId = String(attr._id);

                // Agora a busca é 100% segura, seja por ID (preferencial) ou por Key (fallback)
                const baseValue = attributes instanceof Map
                    ? (attributes.get(attrId) || attributes.get(attr.key))
                    : (attributes[attrId] || attributes[attr.key]);

                const value = baseValue || 0;

                const modifier = Math.floor(value / (attr.modDiv || 5));
                const hasBonus = String(attr._id) === bonusAttrId;

                const attrColor = attr.colorVar;

                return (
                    <motion.div
                        key={attr._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5, transition: { duration: 0.4 } }}
                        className={`
                    group relative p-8 transition-all duration-700 overflow-hidden flex flex-col items-center justify-between
                    backdrop-blur-[20px] border border-white
                    rounded-[3.5rem] lg:aspect-square
                    shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.8)]
                `}
                        style={{
                            background:
                                `linear-gradient(color-mix(in srgb, ${attrColor}, transparent 60%) 0%, color-mix(in srgb, ${attrColor}, transparent 95%) 50%)`,
                            boxShadow:
                                `0 0 20px color-mix(in srgb, ${attrColor}, transparent 70%)`
                        }}
                    >
                        {/* 1. NÚCLEO DE LUZ (Efeito Aurora Estático) */}
                        <div
                            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at 50% 50%, ${attrColor}, transparent 70%)`
                            }}
                        />

                        {/* 2. SINCRO-INDICATOR (Minimalista) */}
                        {hasBonus && (
                            <div className="absolute top-8 right-8 z-30">
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/60 border border-white shadow-sm backdrop-blur-md">
                                    <Zap size={7} style={{ color: attrColor, fill: attrColor }} className="animate-pulse" />
                                    <span className="text-[6px] font-black text-slate-400 uppercase tracking-[0.2em]">Boost</span>
                                </div>
                            </div>
                        )}

                        {/* 3. HEADER: Identidade Técnica */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative w-14 h-14 rounded-3xl bg-white/50 border border-white/80 flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 opacity-10 rounded-inherit" style={{ backgroundColor: attrColor }} />
                                <div style={{ color: attrColor }} className="opacity-80 group-hover:opacity-100 transition-opacity">
                                    <NexusIcon name={attr.iconName} size={22} />
                                </div>
                            </div>

                            <h4 className="text-[12px] font-black text-slate-600 uppercase tracking-widest">
                                {attr.name.slice(0, 3)}
                            </h4>
                        </div>

                        {/* 4. VALOR CENTRAL (Tipografia Prisma) */}
                        <div className="relative z-10 flex items-baseline gap-1">
                            <motion.span
                                key={value}
                                className="text-6xl font-black text-slate-800 tracking-tighter tabular-nums leading-none"
                            >
                                {value}
                            </motion.span>
                            <div className="flex flex-col mb-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase italic">Pts</span>
                                <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: attrColor }} />
                            </div>
                        </div>

                        {/* 5. FOOTER: Módulo de Impacto */}
                        <div className="w-full relative z-10">
                            <div className="py-4 rounded-4xl bg-white/40 border border-white/40 flex flex-col items-center transition-all duration-500 group-hover:bg-white/60 group-hover:border-white">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-black italic tabular-nums tracking-tighter" style={{ color: attrColor }}>
                                        +{modifier}
                                    </span>
                                    <div className="h-3 w-px bg-slate-200" />
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                                        {attr.modLabel}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* EFEITO DE VARREDURA (SCANLINE) */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{
                                background: `linear-gradient(135deg, transparent 45%, ${attrColor}05 50%, transparent 55%)`
                            }}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
};