import React from 'react';
import { motion } from 'framer-motion';
import { NexusIcon } from '../../../components/common/NexusIcon';

export const AttributeGrid = ({ character, vault }) => {
    if (!vault?.attributes || !character?.attributes) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {vault.attributes.map((attr, index) => {
                const value = character.attributes[attr.key] || 0;
                const attrColor = attr.colorVar || '#94a3b8';

                return (
                    <motion.div
                        key={attr._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="group relative p-2.5 rounded-3xl bg-white border border-slate-50 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* GLOW DE REFRAÇÃO */}
                        <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500"
                            style={{ backgroundColor: attrColor }}
                        />

                        {/* ÍCONE E LABEL REDUZIDOS */}
                        <div className="flex items-center gap-1.5 mb-0.5 relative z-10">
                            <div 
                                className="p-1.5 rounded-lg bg-slate-50/50 group-hover:bg-white transition-colors"
                                style={{ color: attrColor }}
                            >
                                <NexusIcon name={attr.iconName} size={12} />
                            </div>
                            <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest">
                                {attr.label.slice(0, 3)}
                            </span>
                        </div>

                        {/* VALOR COMPACTO */}
                        <div className="relative z-10 leading-none">
                            <span className="text-lg font-black text-slate-900 italic tracking-tighter">
                                {value}
                            </span>
                        </div>

                        {/* INDICADOR DE SINTONIA */}
                        <div 
                            className="absolute bottom-0 inset-x-0 h-0.5 opacity-20"
                            style={{ backgroundColor: attrColor }}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
};