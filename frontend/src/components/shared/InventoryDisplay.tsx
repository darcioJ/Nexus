import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { CATEGORY_MAP } from '../../config/character.config';
import { NexusIcon } from '../common/NexusIcon';

interface Item {
    _id: string;
    name: string;
    category: string;
    description: string;
    quantity: number;
}

interface InventoryProps {
    items: Item[];
}

export const InventoryDisplay: React.FC<InventoryProps> = ({ items }) => {

    if (!items || items.length === 0) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                <Package className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Inventário_Vazio // Vault_Sem_Registros
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
            {items.map((item, index) => {
                const config = CATEGORY_MAP[item.category] || CATEGORY_MAP.DEFAULT;

                return (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white/80 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-5 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                    >
                        {/* Indicador Lateral de Categoria */}
                        <div
                            className="absolute top-0 left-0 w-1.5 h-full opacity-50"
                            style={{ backgroundColor: config.color }}
                        />

                        <div className="relative z-10 space-y-4">
                            {/* Header do Item */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 shadow-inner"
                                        style={{ color: config.color }}
                                    >
                                        <NexusIcon name={config.icon} size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400 block">
                                            {item.category}_Class
                                        </span>
                                        <h4 className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">
                                            {item.name}
                                        </h4>
                                    </div>
                                </div>

                                {/* Badge de Quantidade */}
                                <div className="bg-slate-900 px-3 py-1 rounded-full">
                                    <span className="text-[9px] font-mono font-black text-white italic">
                                        x{String(item.quantity).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>

                            {/* Descrição Técnica */}
                            <div className="min-h-10">
                                <p className="text-[10px] leading-relaxed font-medium text-slate-500 italic">
                                    "{item.description}"
                                </p>
                            </div>

                            {/* Footer / Meta-dados */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <div className="w-4 h-1 rounded-full opacity-30" style={{ backgroundColor: config.color }} />
                                </div>
                                <span className="text-[6px] font-mono font-bold text-slate-300 uppercase tracking-widest">
                                    UID: {item._id.slice(-6)}
                                </span>
                            </div>
                        </div>

                        {/* Efeito de Hover: Reflexo */}
                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    </motion.div>
                );
            })}
        </div>
    );
};