import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Package, Layers, FileText, Hash, Sparkles } from 'lucide-react';
import { InputGroup } from "../../pages/Admin/components/InputGroup";

export const InventoryModal = ({ item, onClose, onSave }: any) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        category: item?.category || 'OUTROS',
        description: item?.description || '',
        quantity: item?.quantity || 1
    });

    // Conteúdo do Modal
    const modalContent = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/5 backdrop-blur-md"
            onClick={onClose} // Fecha ao clicar fora
        >
            <motion.div
                initial={{ scale: 0.95, y: 30, rotateX: 10 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full max-w-lg bg-white/80 border border-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
                onClick={e => e.stopPropagation()} // Impede fechar ao clicar no modal
            >
                {/* --- ENGINE DE REFRAÇÃO (BLOOMS DE COR) --- */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-400/20 blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400/10 blur-[80px] pointer-events-none" />

                {/* HEADER: CERÂMICA TRANSLÚCIDA */}
                <div className="relative z-10 p-8 flex justify-between items-center bg-white/40 backdrop-blur-xl border-b border-white/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 border border-white">
                            <Package size={22} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                                {item ? 'Recalibrar registro' : 'Novo registro de item'}
                            </h3>
                            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-[0.2em]">
                                Manifesto de inventário v.2.6
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-400 transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* FORMULÁRIO: CLEAN MODE */}
                <div className="relative z-10 p-10 space-y-6">
                    <InputGroup label="Identificação do item" icon={<Sparkles size={14} className="text-emerald-500" />}>
                        <input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome do suprimento ou tecnologia..."
                            className="w-full bg-white/50 border border-slate-100 rounded-[1.5rem] px-5 py-4 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-4 ring-emerald-500/5 transition-all outline-none"
                        />
                    </InputGroup>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Categoria" icon={<Layers size={14} className="text-blue-500" />}>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white/50 border border-slate-100 rounded-[1.5rem] px-5 py-4 text-sm font-bold text-slate-600 appearance-none focus:bg-white transition-all outline-none"
                            >
                                <option value="TECNOLOGIA">Tecnologia</option>
                                <option value="DISPOSITIVO">Dispositivo</option>
                                <option value="FERRAMENTA">Ferramenta</option>
                                <option value="MEDICINA">Medicina</option>
                                <option value="OUTROS">Outros</option>
                            </select>
                        </InputGroup>

                        <InputGroup label="Quantidade" icon={<Hash size={14} className="text-amber-500" />}>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                className="w-full bg-white/50 border border-slate-100 rounded-[1.5rem] px-5 py-4 text-sm font-black text-slate-700 focus:bg-white transition-all outline-none"
                            />
                        </InputGroup>
                    </div>

                    <InputGroup label="Descrição técnica" icon={<FileText size={14} className="text-slate-400" />}>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descreva as propriedades neurais ou físicas..."
                            rows={3}
                            className="w-full bg-white/50 border border-slate-100 rounded-[2rem] px-5 py-4 text-sm font-medium text-slate-500 italic focus:bg-white transition-all outline-none resize-none"
                        />
                    </InputGroup>

                    {/* BOTÃO DE AÇÃO: GRADIENTE VIBRANTE */}
                    <div className="pt-4">
                        <button
                            onClick={() => onSave(formData)}
                            className="group relative w-full h-16 rounded-[2rem] overflow-hidden transition-all active:scale-[0.98]"
                        >
                            {/* Camada de Gradiente */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 transition-transform duration-500 group-hover:scale-110" />
                            
                            <div className="relative flex items-center justify-center gap-3 text-white">
                                <Check size={20} strokeWidth={3} />
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Sincronizar manifesto</span>
                            </div>

                            {/* Brilho de Hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                        </button>
                    </div>
                </div>

                {/* DETALHE DE DESIGN: LINHA DE CRISTAL */}
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent z-50" />
            </motion.div>
        </motion.div>
    );

    // Renderiza via Portal no final do body
    return createPortal(modalContent, document.body);
};