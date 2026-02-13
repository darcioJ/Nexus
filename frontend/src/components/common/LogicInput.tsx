import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
    placeholder = "Inicie a redação do protocolo...",
    macros = DEFAULT_MACROS
}: LogicInputProps) => {
    const currentValue = watch(name) || "";
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Protocolo de expansão automática do terminal
    React.useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [currentValue]);

    const injectMacro = (macroValue: string) => {
        const space = currentValue && !currentValue.endsWith(' ') ? ' ' : '';
        setValue(name, currentValue + space + macroValue, { shouldValidate: true });
    };

    const { ref, ...rest } = register(name);

    return (
        <div className="space-y-6 w-full">
            {/* 1. NUVEM DE INJEÇÃO (MACROS SUAVES) */}
            <div className="flex flex-wrap gap-2.5">
                {macros.map((macro) => (
                    <motion.button
                        key={macro.label}
                        type="button"
                        whileHover={{ y: -2, backgroundColor: "#fff" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => injectMacro(macro.value)}
                        className="flex items-center gap-2.5 px-4 py-2 bg-white/40 backdrop-blur-md border border-white rounded-2xl shadow-sm hover:shadow-md transition-all group"
                    >
                        <div
                            className="w-1.5 h-1.5 rounded-full shadow-sm"
                            style={{ backgroundColor: macro.color }}
                        />
                        <span className="text-[10px] font-bold text-slate-500 tracking-tight group-hover:text-slate-800 transition-colors">
                            {macro.label}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* 2. ÁREA DE TEXTO AUTO-EXPANSÍVEL (CERAMIC GLASS) */}
            <div className="relative group">
                <textarea
                    {...rest}
                    ref={(e) => {
                        ref(e);
                        textAreaRef.current = e;
                    }}
                    placeholder={placeholder}
                    className={`${textareaBaseClass} min-h-45! bg-white/20! backdrop-blur-xl! border-white! rounded-[2.5rem]! py-8! px-8! text-base! leading-relaxed! resize-none! overflow-hidden focus:bg-white/80! focus:shadow-2xl focus:shadow-blue-500/5 transition-all duration-700`}
                />

                {/* INDICADOR DE SINAL (VISUAL) */}
                <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-20 group-focus-within:opacity-100 transition-opacity duration-500">
                    <span className="text-[9px] font-bold text-blue-500 tracking-widest uppercase">Escrita_Ativa</span>
                    <Sparkles size={14} className="text-blue-500" />
                </div>
            </div>
        </div>
    );
};