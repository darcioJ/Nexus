import React from 'react';
import {
    ChevronUp,
    ChevronDown,
    Zap,
    Sparkles
} from 'lucide-react';

import { useFormContext } from 'react-hook-form';
import { VitalTelemetry } from '../shared/VitalTelemetry';

import { CHAR_LIMITS } from '../../models/character';

import { motion } from 'framer-motion';
import { triggerHaptic } from '../../utils/triggerHaptic';

import { HeaderStep } from '../shared/HeaderStep';

import { useVault } from '../../hooks/useVault';
import { NexusIcon } from '../common/NexusIcon';
import { LoadingScreen } from '../common/LoadingScreen';

export const StepAttributes = () => {
    const { vault, isLoading } = useVault();
    const { watch, setValue } = useFormContext<CharacterData>();
    const attributes = watch('attributes');
    const selectedOrigin = watch('background.origin');

    // Busca o Clube e a chave do bônus direto do DB
    const clubData = vault?.clubs.find(o => o._id === selectedOrigin);
    const bonusAttrKey = clubData?.bonus?.attributeKey || null; // ex: 'strength'

    const TOTAL_ALLOWED = CHAR_LIMITS.TOTAL_POINTS;
    const MIN_REQUIRED = CHAR_LIMITS.MIN_POINTS_REQUIRED; // Mínimo para liberar o protocolo
    const currentTotal = Object.values(attributes).reduce((acc, val) => acc + (val || 0), 0);
    const pointsRemaining = TOTAL_ALLOWED - currentTotal;

    const isSystemReady = currentTotal >= MIN_REQUIRED;

    const adjustValue = (attrKey: string, delta: number) => {
        const current = attributes[attrKey] || 1;
        const isBonusAttr = attrKey === bonusAttrKey;
        const maxValue = isBonusAttr ? CHAR_LIMITS.ATTR_MAX_BONUS : CHAR_LIMITS.ATTR_MAX;

        if (delta < 0 && current <= 1) return;
        if (delta > 0 && (current >= maxValue || pointsRemaining <= 0)) return;

        setValue(`attributes.${attrKey}`, current + delta, { shouldValidate: true });
    };

    // 1. PROTOCOLO DE SANITIZAÇÃO (Auto-ajuste de Sincronia)
    React.useEffect(() => {
        if (!bonusAttrKey) return;

        const currentValue = attributes[bonusAttrKey] || 0;
        const maxManualAllowed = CHAR_LIMITS.ATTR_MAX_BONUS; // Geralmente 11

        // Se o valor manual atual excede o teto permitido para atributos com bônus
        if (currentValue > maxManualAllowed) {
            // Reduzimos o valor para o máximo permitido (11)
            setValue(`attributes.${bonusAttrKey}`, maxManualAllowed, { shouldValidate: true });

            // O ponto removido volta automaticamente para o 'pointsRemaining'
            // pois o 'currentTotal' é recalculado com base nos valores do watch('attributes')
            triggerHaptic([50, 100, 50]); // Alerta de recalibração de hardware
        }
    }, [bonusAttrKey, setValue, attributes]);

    if (isLoading || !vault) return <LoadingScreen message="Sincronizando Vault..." />;

    return (
        <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">

            <HeaderStep
                icon="Cpu"
                label="Módulo 3"
                title="Matriz de"
                highlight="Atributos"
                description="Ajustando frequências de performance biológica..."
                accentColor="var(--color-step-attributes)"
                secondaryColor="var(--color-step-attributes-soft)"
            />

            <VitalTelemetry attributes={attributes} />

            <motion.div
                layout
                whileHover={{ scale: 1.005 }}
                /* ESTRUTURA: Vidro Cerâmico Nexus */
                className={`
        relative p-5 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] 
        transition-all duration-700 overflow-hidden group border-2
        bg-white/60 backdrop-blur-3xl
        ${isSystemReady
                        ? 'border-step-attributes-soft shadow-[inset_0_0_40px_step-attributes/10%,0_25px_50px_-15px_step-attributes/20%]'
                        : 'border-white shadow-[inset_0_0_40px_rgba(255,255,255,0.5),0_20px_50px_-15px_rgba(0,0,0,0.05)]'
                    }
    `}
            >
                {/* CAMADA DE GLOSS & MICRO-GRADE (Z-0) */}
                <div className="absolute inset-0 pointer-events-none select-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white to-transparent opacity-50" />
                    <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(var(--color-step-attributes)_1px,transparent_1px)] bg-size-[20px_20px]" />

                    {/* Glow de Ativação Lateral */}
                    <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] transition-opacity duration-1000 ${isSystemReady ? 'bg-step-attributes/20 opacity-100' : 'opacity-0'}`} />
                </div>

                <div className="relative z-10 flex flex-col gap-5 md:gap-7">

                    {/* HEADER: SOCKET DE PROCESSAMENTO */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* ICON SOCKET: Núcleo de Energia */}
                            <div className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center 
                    transition-all duration-500 border shadow-sm relative overflow-hidden
                    ${isSystemReady
                                    ? 'bg-white border-step-attributes/30 text-step-attributes'
                                    : 'bg-slate-50 border-slate-100 text-slate-300'}
                `}>
                                <div className={`absolute inset-0 opacity-10 ${isSystemReady ? 'bg-step-attributes' : 'bg-transparent'}`} />
                                <Sparkles
                                    size={22}
                                    strokeWidth={2.5}
                                    className={`relative z-10 transition-all ${isSystemReady ? 'animate-pulse scale-110' : ''}`}
                                />
                            </div>

                            <div className="flex flex-col text-left">
                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mb-0.5">
                                    Módulo_Atributos
                                </span>
                                <h2 className={`text-base md:text-lg font-black uppercase tracking-tighter leading-none transition-colors duration-500 ${isSystemReady ? 'text-step-attributes' : 'text-slate-500'}`}>
                                    {isSystemReady ? "Sincronia_Psiônica" : "Distribuição_Pendente"}
                                </h2>
                            </div>
                        </div>

                        {/* DISPLAY NUMÉRICO: Foco Mobile */}
                        <div className="flex items-baseline justify-between md:justify-end gap-3 bg-slate-50/50 md:bg-transparent p-3 md:p-0 rounded-2xl border border-slate-100 md:border-none">
                            <span className="md:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest">Carga_Total</span>
                            <div className="flex items-baseline gap-1.5">
                                <motion.span
                                    key={currentTotal}
                                    className={`text-4xl md:text-6xl font-black tabular-nums tracking-tighter transition-colors ${isSystemReady ? 'text-step-attributes' : 'text-slate-800'}`}
                                >
                                    {currentTotal}
                                </motion.span>
                                <span className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                                    / {TOTAL_ALLOWED} Pts
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* PROGRESS BAR: FIBRA ÓPTICA (Sincronia Instantânea) */}
                    <div className="relative h-2 md:h-2.5 w-full bg-slate-100/50 rounded-full border border-white shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden p-0.5">
                        <motion.div
                            // initial={false} evita que a barra comece do zero toda vez que o componente monta
                            initial={false}
                            animate={{ width: `${(currentTotal / TOTAL_ALLOWED) * 100}%` }}
                            // CONFIGURAÇÃO "INSTA": Mola de alta tensão (stiff) e amortecimento rápido
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            className="h-full rounded-full relative"
                            style={{
                                backgroundColor: isSystemReady ? 'var(--color-step-attributes)' : '#cbd5e1',
                                boxShadow: isSystemReady ? `0 0 15px var(--color-step-attributes)60` : 'none'
                            }}
                        >
                            {/* Filamento de Luz (Core da Fibra) */}
                            <div className="absolute top-0 left-0 w-full h-[0.5px] bg-white/50" />

                            {/* Shimmer de Ativação (Pulso de Dados) */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                            />
                        </motion.div>

                        {/* Marcador de Segurança Tático */}
                        <div
                            className="absolute top-0 h-full w-0.5 bg-slate-400/30 z-10 transition-all duration-300"
                            style={{ left: `${(MIN_REQUIRED / TOTAL_ALLOWED) * 100}%` }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* GRID RESPONSIVA: 1 (sm) -> 2 (md) -> 3 (lg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-1">
                {vault.attributes.map((attr) => {
                    const val = attributes[attr.key] || 1;
                    const modifier = Math.floor(val / (attr.modDiv || 5));
                    const hasHobbyBonus = attr.key === bonusAttrKey;
                    const maxValue = hasHobbyBonus ? CHAR_LIMITS.ATTR_MAX_BONUS : CHAR_LIMITS.ATTR_MAX;
                    const isMax = val >= maxValue;
                    const attrColor = attr.colorVar;

                    return (
                        <motion.div
                            key={attr._id}
                            layout
                            className={`
                    group relative p-5 md:p-6 transition-all duration-700 overflow-hidden gap-3
                    bg-white/70 backdrop-blur-2xl border-2 rounded-[2.5rem] flex flex-col justify-between lg:aspect-square
                    ${isMax ? 'border-amber-200 shadow-xl' : 'border-white shadow-sm hover:shadow-md'}
                `}
                            style={{
                                color: attrColor,
                                background: isMax
                                    ? `linear-gradient(135deg, color-mix(in srgb, #f59e0b, transparent 70%) 0%, color-mix(in srgb, #f59e0b, transparent 95%) 100%)`
                                    : `linear-gradient(135deg, color-mix(in srgb, ${attrColor}, transparent 70%) 0%, color-mix(in srgb, ${attrColor}, transparent 98%) 70%)`,
                                boxShadow: isMax
                                    ? `inset 0 0 20px color-mix(in srgb, #f59e0b, transparent 80%)`
                                    : `inset 0 0 20px color-mix(in srgb, ${attrColor}, transparent 80%)`
                            }}
                        >
                            {/* 1. HEADER TÁTICO: Compacto e Elegante */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Ícone: Socket Cerâmico Menor */}
                                    <div className={`
                            w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border transition-all duration-500
                            ${isMax ? 'bg-amber-500 text-white border-amber-400' : 'bg-white border-slate-50 shadow-inner'}
                        `}>
                                        <NexusIcon name={attr.iconName} size={isMax ? 20 : 18} strokeWidth={2.5} />
                                    </div>

                                    <div className="flex flex-col">
                                        <h4 className="text-sm md:text-base font-black uppercase tracking-tighter text-slate-800 leading-none">
                                            {attr.label}
                                        </h4>
                                        <span className="text-[6px] md:text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                                            {attr.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Badge de Bônus (Zap) Simplificado */}
                                {hasHobbyBonus && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-amber-100 shadow-sm">
                                        <Zap size={8} className="text-amber-500 fill-amber-500" />
                                        <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest">+1</span>
                                    </div>
                                )}
                            </div>

                            <div className={`p-3 rounded-2xl border backdrop-blur-sm transition-all duration-500 ${isMax ? 'bg-amber-50/70 border-amber-200/40 text-amber-900' : 'bg-white/80 border-white/60 text-slate-500 shadow-inner'
                                }`}>
                                <p className="text-[10px] font-semibold leading-relaxed italic line-clamp-2 md:line-clamp-none">
                                    "{attr.details}"
                                </p>
                            </div>

                            {/* 2. SELETOR DE VALOR: Integrado ao Chassis */}
                            <div className="flex items-center justify-between bg-slate-50/50 rounded-2xl p-1.5 mb-5 border border-white/50 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => adjustValue(attr.key, -1)}
                                    disabled={val <= 1}
                                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 shadow-sm active:scale-90 disabled:opacity-30"
                                >
                                    <ChevronDown size={16} strokeWidth={3} />
                                </button>

                                <div className="flex flex-col items-center leading-none">
                                    <motion.span key={val} className="text-xl md:text-2xl font-black tabular-nums" style={{ color: isMax ? '#b45309' : attrColor }}>
                                        {val}
                                    </motion.span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => adjustValue(attr.key, 1)}
                                    disabled={val >= maxValue || pointsRemaining <= 0}
                                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm active:scale-90 disabled:opacity-30"
                                    style={{ color: val < maxValue ? attrColor : 'inherit' }}
                                >
                                    <ChevronUp size={16} strokeWidth={3} />
                                </button>
                            </div>

                            {/* 3. IMPACT OUTPUT: Telemetria Slim */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl md:text-3xl font-black italic tracking-tighter" style={{ color: isMax ? '#b45309' : attrColor }}>
                                            +{modifier}
                                        </span>
                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                            {attr.modLabel}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[6px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5">Limite_NX</span>
                                        <span className="text-[9px] font-black text-slate-500 px-2 py-0.5 bg-white border border-slate-100 rounded-md">
                                            {maxValue}
                                        </span>
                                    </div>
                                </div>

                                {/* BARRA DE PROGRESSO: Estilo Fibra Ótica Slim */}
                                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-white shadow-inner">
                                    <motion.div
                                        initial={false}
                                        animate={{ width: `${(val / maxValue) * 100}%` }}
                                        className="h-full rounded-full relative"
                                        style={{
                                            backgroundColor: isMax ? '#f59e0b' : attrColor,
                                            boxShadow: `0 0 10px ${isMax ? '#f59e0b' : attrColor}40`
                                        }}
                                    >
                                        {/* Brilho de Fibra Ótica */}
                                        <div className="absolute top-0 left-0 w-full h-[0.5px] bg-white/40" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};