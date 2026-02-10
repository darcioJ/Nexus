import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Zap, Plus, Edit3, Trash2, Box, Layers } from 'lucide-react';
import { CATEGORY_MAP } from '../../config/character.config';
import { NexusIcon } from '../common/NexusIcon';
import { InventoryModal } from './InventoryModal';

interface Item {
    _id: string;
    name: string;
    category: string;
    description: string;
    quantity: number;
}

export const InventoryDisplay = ({ items, onSave, onDelete }: {
    items: Item[],
    onSave: (data: any, itemId?: string) => Promise<void>,
    onDelete: (itemId: string) => Promise<void>
}) => {
    const [modalData, setModalData] = useState<{ open: boolean, item?: Item }>({ open: false });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
                
                {/* BOTÃO ADICIONAR: PRISMA MINIMAL GHOST */}
                <motion.button
                    onClick={() => setModalData({ open: true })}
                    whileHover={{ scale: 0.98, backgroundColor: 'rgba(255, 255, 255, 1)' }}
                    className="relative h-full min-h-[140px] rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-white/40 flex flex-col items-center justify-center gap-2 transition-all group overflow-hidden"
                >
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-50 flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:rotate-90 transition-all duration-500">
                        <Plus size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-emerald-600 transition-colors">
                        Add_Registry
                    </span>
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:12px_12px]" />
                </motion.button>

                {items.map((item, index) => {
                    const config = CATEGORY_MAP[item.category] || CATEGORY_MAP.DEFAULT;
                    const color = config.color;

                    return (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="group relative rounded-[2.5rem] p-4 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-500 overflow-hidden"
                        >
                            {/* ENGINE DE REFRAÇÃO (BLOOM SUTIL) */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 blur-[50px] opacity-10 pointer-events-none transition-colors" style={{ backgroundColor: color }} />

                            {/* CONTROLES DE COMANDO (SEMPRE VISÍVEIS) */}
                            <div className="absolute top-4 right-4 flex gap-1 z-20">
                                <button 
                                    onClick={() => setModalData({ open: true, item })} 
                                    className="p-2 rounded-xl bg-white/50 border border-white shadow-sm text-slate-400 hover:text-blue-500 hover:bg-white transition-all active:scale-90"
                                >
                                    <Edit3 size={11} />
                                </button>
                                <button 
                                    onClick={() => onDelete(item._id)} 
                                    className="p-2 rounded-xl bg-white/50 border border-white shadow-sm text-slate-400 hover:text-rose-500 hover:bg-white transition-all active:scale-90"
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>

                            <div className="relative z-10 space-y-3">
                                {/* HEADER DO ITEM */}
                                <div className="flex items-start gap-3 mr-16">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-inner flex items-center justify-center border border-slate-50 shrink-0" style={{ color }}>
                                        <NexusIcon name={config.icon} size={18} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-1">
                                            <Layers size={7} className="text-slate-300" />
                                            <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest truncate">{item.category}</span>
                                        </div>
                                        <h4 className="text-xs font-black text-slate-800 uppercase italic tracking-tight leading-tight truncate">
                                            {item.name}
                                        </h4>
                                    </div>
                                </div>

                                {/* BADGE QUANTIDADE & DESCRIÇÃO */}
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-[8px] leading-tight font-medium text-slate-500 italic line-clamp-2 flex-1">
                                        "{item.description}"
                                    </p>
                                    
                                    <div className="px-2 py-1 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-1 shrink-0">
                                        <Zap size={7} className="text-amber-400 fill-amber-400" />
                                        <span className="text-[9px] font-mono font-black text-slate-900 italic">
                                            {String(item.quantity).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>

                                {/* FOOTER TÉCNICO */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-50/50">
                                    <div className="flex items-center gap-1.5 opacity-30">
                                        <ScanLine size={8} className="text-slate-400" />
                                        <span className="text-[5px] font-black text-slate-400 uppercase tracking-[0.3em]">Registry_NX</span>
                                    </div>
                                    <span className="text-[5px] font-mono font-bold text-slate-300">ID:{item._id.slice(-4).toUpperCase()}</span>
                                </div>
                            </div>

                            {/* SCANLINE ANIMADO (HOVER) */}
                            <motion.div 
                                animate={{ y: [-100, 200] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-0 h-px bg-slate-900/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {modalData.open && (
                    <InventoryModal 
                        item={modalData.item} 
                        onClose={() => setModalData({ open: false })} 
                        onSave={async (data) => {
                            await onSave(data, modalData.item?._id);
                            setModalData({ open: false });
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};