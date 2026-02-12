import React from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { textareaBaseClass } from '../../config/vault.config';

interface Macro {
    label: string;
    value: string;
    color: string;
}

interface LogicInputProps {
    register: any;
    watch: any;
    setValue: any;
    name: string;
    placeholder?: string;
    icon?: React.ReactNode;
    macros?: Macro[];
}

const DEFAULT_MACROS: Macro[] = [
    // --- OFENSIVA (Vermelhos/Laranjas) ---
    { label: 'Dano', value: 'Causa X de dano [TIPO].', color: '#f43f5e' },
    { label: 'Crítico', value: 'Em crítico, aplica [EFEITO].', color: '#fb923c' },
    { label: 'Penetração', value: 'Ignora X de Defesa/Resistência.', color: '#e11d48' },

    // --- SUPORTE & CURA (Verdes) ---
    { label: 'Cura', value: 'Restaura X de HP.', color: '#10b981' },
    { label: 'Vigor', value: 'Recupera X de [ENERGIA/STAMINA].', color: '#059669' },
    { label: 'Escudo', value: 'Garante X de barreira temporária.', color: '#2dd4bf' },

    // --- UTILITÁRIOS & ATRIBUTOS (Azuis/Roxos) ---
    { label: 'Buff', value: 'Concede +X em [ATRIBUTO].', color: '#3b82f6' },
    { label: 'Debuff', value: 'Reduz -X em [ATRIBUTO].', color: '#6366f1' },
    { label: 'Status', value: 'Aplica o estado [NOME_DO_STATUS].', color: '#8b5cf6' },

    // --- CONTROLE & FLUXO (Âmbar/Ciano) ---
    { label: 'Duração', value: 'Ativo por X rodadas.', color: '#06b6d4' },
    { label: 'Gatilho', value: 'Se [CONDIÇÃO], então [EFEITO].', color: '#f59e0b' },
    { label: 'Alcance', value: 'Afeta alvos em um raio de Xm.', color: '#0ea5e9' },

    // --- RESTRIÇÃO & CUSTO (Slate) ---
    { label: 'Custo', value: 'Consome X de [RECURSO] por uso.', color: '#64748b' },
    { label: 'Limite', value: 'Pode ser usado X vezes por combate.', color: '#475569' },
];

export const LogicInput = ({
    register,
    watch,
    setValue,
    name,
    placeholder = "Aguardando definição de protocolo...",
    macros = DEFAULT_MACROS
}: LogicInputProps) => {

    const currentValue = watch(name) || "";

    const injectMacro = (macroValue: string) => {
        const space = currentValue && !currentValue.endsWith(' ') ? ' ' : '';
        setValue(name, currentValue + space + macroValue, { shouldValidate: true });
    };

    return (
        <div className="space-y-4 w-full">
            {/* 1. SELETOR DE MACROS (NUVEM DE INJEÇÃO COMPACTA) */}
            <div className="flex flex-wrap gap-2 px-1 py-2 max-h-40 overflow-y-auto no-scrollbar">
                {macros.map((macro) => (
                    <motion.button
                        key={macro.label}
                        type="button"
                        whileHover={{
                            y: -2,
                            backgroundColor: "rgba(255, 255, 255, 1)",
                            boxShadow: `0 8px 15px -8px ${macro.color}60`
                        }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => injectMacro(macro.value)}
                        style={{ '--hover-color': macro.color } as any}
                        className={`
        relative flex items-center gap-2.5 px-3 py-1.5 
        bg-white/60 backdrop-blur-sm border-2 border-white/80 rounded-xl 
        transition-all duration-300 hover:border-[var(--hover-color)]
      `}
                    >
                        {/* DOT DE FREQUÊNCIA (STATUS LED) */}
                        <div
                            className="w-1.5 h-1.5 rounded-full shadow-inner shrink-0"
                            style={{ backgroundColor: macro.color }}
                        />

                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider group-hover:text-slate-800 whitespace-nowrap">
                            {macro.label}
                        </span>

                        {/* INDICADOR DE CATEGORIA (OVERLAY SUTIL) */}
                        <div
                            className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-40 transition-opacity"
                            style={{ backgroundColor: macro.color }}
                        />
                    </motion.button>
                ))}
            </div>

            <textarea
                {...register(name)}
                rows={4}
                className={textareaBaseClass}
                placeholder={placeholder}
            />

        </div>
    );
};