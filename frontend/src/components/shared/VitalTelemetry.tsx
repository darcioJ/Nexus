import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck } from 'lucide-react';
import { NexusIcon } from '../common/NexusIcon';
import { useVault } from '../../hooks/useVault';
import { useNexus } from '../../hooks/useNexus';

export const VitalTelemetry = ({ attributes }) => {

    // 1. Pegamos o vault para traduzir "Nomes" em "IDs"
    const { vault } = useVault();
    const { character, stats, currentStatus, isSyncing } = useNexus();

    // 2. HELPER: Encontra o valor do atributo pelo "Slug" ou "Key"
    const getAttrValue = useCallback((key: string) => {
        // Busca o ID do atributo no vault pelo nome/chave
        const attrDefinition = vault?.attributes?.find(a =>
            a.key === key || a.name.toLowerCase().includes(key)
        );

        if (!attrDefinition) return 0;

        const attrId = String(attrDefinition._id);

        // Busca o valor no objeto 'attributes' (do Forger) ou no character.attributes (Map do DB)
        const source = attributes || character?.attributes;

        // Se for um Map do Mongoose (Dashboard), usamos .get(), se for objeto (Forger), usamos chave direta
        if (source instanceof Map) return source.get(attrId) || 0;
        return source?.[attrId] || 0;
    }, [vault, attributes, character]);

    // 3. RESOLUÇÃO DE VALORES
    const vit = getAttrValue('vitality');
    const int = getAttrValue('intelligence');
    const ess = getAttrValue('essence');
    // ^ Ajuste os nomes acima para baterem com o seu 'name' ou 'key' no banco

    const charHp = stats?.hp;
    const charMaxHp = stats?.maxHp;
    const charSan = stats?.san;
    const charMaxSan = stats?.maxSan;

    const statsData = useMemo(() => {
        const isDashboard = typeof charHp === 'number';

        const finalMaxHp = isDashboard ? charMaxHp! : (90 + (vit * 2));
        const finalMaxSan = isDashboard ? charMaxSan! : (30 + (int + ess));

        return [
            {
                id: "hp-module",
                label: "Vida",
                current: isDashboard ? charHp! : finalMaxHp,
                max: finalMaxHp,
                formula: "90 + (VIT * 2)",
                iconName: "Heart",
                color: "var(--nexus-hp)",
            },
            {
                id: "san-module",
                label: "Sanidade",
                current: isDashboard ? charSan! : finalMaxSan,
                max: finalMaxSan,
                formula: "30 + (INT + ESS)",
                iconName: "Brain",
                color: "var(--nexus-san)",
            }
        ];
    }, [vit, int, ess, charHp, charMaxHp, charSan, charMaxSan]);

    const vitalSpan = character
        ? "md:col-span-6 lg:col-span-3" // Com Personagem: Ocupam 1/4 da tela em LG
        : "md:col-span-6 lg:col-span-6"; // Sem Personagem: Ocupam 1/2 da tela (Full Width)

    if (isSyncing && !character) {
        return (
            <div className="h-32 flex items-center justify-center bg-white/50 rounded-4xl border border-dashed border-slate-200">
                <span className="text-[10px] font-black text-slate-400 animate-pulse tracking-[0.5em]">
                    CALIBRANDO_SINAL...
                </span>
            </div>
        );
    }

    const renderStatCard = (stat: unknown) => {
        const percentage = Math.min((stat.current / stat.max) * 100, 100);
        const colorToken = stat.color;

        return (
            <motion.div
                key={stat.id}
                layout
                className="group relative p-6 transition-all duration-700 overflow-hidden bg-white/90 backdrop-blur-2xl border-2 border-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06),inset_0_0_40px_white]"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-30 pointer-events-none" style={{ backgroundColor: colorToken }} />

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-50 flex items-center justify-center shadow-sm" style={{ color: colorToken }}>
                            <NexusIcon name={stat.iconName} size={18} fill="currentColor" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">Telemetria_Ativa</span>
                            <h4 className="text-sm font-black text-slate-800 uppercase italic leading-none">{stat.label}</h4>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black tabular-nums tracking-tighter text-slate-900 italic leading-none">{stat.current}</span>
                        <span className="text-xs font-bold text-slate-300 italic">/ {stat.max}</span>
                    </div>

                    <div className="relative h-1.5 w-full bg-slate-100/50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: colorToken, boxShadow: `0 0 10px ${colorToken}40` }}
                        />
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-50">
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">{stat.formula}</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    const statusColor = currentStatus?.colorVar;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full max-w-7xl mx-auto px-4">

            {/* CARDS VITAIS (HP & SAN) */}
            {statsData.map((stat) => (
                <motion.div
                    key={stat.id}
                    className={`${vitalSpan} transition-all duration-500`} // Meia tela no md, 1/4 no lg
                >
                    {renderStatCard(stat)}
                </motion.div>
            ))}

            {/* CARD EXTRA: DIAGNÓSTICO DE STATUS */}
            {character && (
                <motion.div
                    key={currentStatus?._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        // Usamos o color-mix para criar o fundo translúcido sem precisar de novas variáveis
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, color-mix(in srgb, ${statusColor}, transparent 92%) 100%)`,
                        borderColor: `color-mix(in srgb, ${statusColor}, transparent 80%)`
                    }}
                    className="md:col-span-12 lg:col-span-6 group relative p-5 bg-white/90 backdrop-blur-2xl border-2 rounded-4xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between"
                >
                    {/* REFRAÇÃO DE FUNDO DINÂMICA */}
                    <div
                        className="absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-[0.15] pointer-events-none"
                        style={{ backgroundColor: statusColor }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* IDENTIDADE DO STATUS */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-50 flex items-center justify-center shadow-sm"
                                style={{ color: statusColor }}
                            >
                                <Activity size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">Diagnóstico_Sinal</span>
                                <h4 className="text-sm font-black text-slate-800 uppercase italic leading-none">Status_Atual</h4>
                            </div>
                        </div>

                        {/* INFO DE ESTADO */}
                        <div className="flex flex-col md:text-right">
                            <motion.span
                                key={currentStatus?.key}
                                className="text-xl font-black uppercase italic tracking-tighter leading-none"
                                style={{ color: statusColor }}
                            >
                                {currentStatus?.name || "Estabilizado"}
                            </motion.span>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {currentStatus?.description || "Integridade nominal detectada."}
                            </p>
                        </div>
                    </div>

                    {/* LINHA DE INTEGRIDADE */}
                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-50">
                        <ShieldCheck size={10} style={{ color: statusColor }} />
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Protocolo_Nexus_Stable</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};