import { useMemo, type Key } from 'react';
import {
    Swords, Cpu, Info, Box,
    Zap
} from 'lucide-react';
import { NexusIcon } from '../../../components/common/NexusIcon';

export const DetailedScan = ({ character, vault }) => {
    // 1. SINCRONIA DE ARSENAL
    const equippedWeapon = useMemo(() => {
        return vault?.weapons?.find((w: { _id: unknown; }) => w._id === character.weapons?.primary);
    }, [vault, character.weapons?.primary]);

    const weaponEssence = useMemo(() => {
        const rawEssence = equippedWeapon?.essenceId;
        if (!rawEssence) return null;
        if (typeof rawEssence === 'object' && rawEssence._id) return rawEssence;
        return vault?.essences?.find((e: { _id: unknown; }) => String(e._id) === String(rawEssence));
    }, [equippedWeapon, vault]);

    // 2. SINCRONIA DE KIT (ARQUÉTIPO)
    const archetypeDetails = useMemo(() => {
        return vault?.archetypes?.find((c: { _id: unknown; }) => c._id === character.background?.archetype);
    }, [vault, character.background?.archetype]);

    return (
        <div className="pt-6 mt-6 border-t border-slate-100/50 grid grid-cols-1 lg:grid-cols-2 gap-6 relative">

            {/* --- COLUNA 1: ARSENAL DETALHADO (HARDWARE) --- */}
            <div className="space-y-3">
                <SectionHeader icon={<Swords size={10} />} label="Hardware_Arsenal" />

                <div className="relative p-6 rounded-[2.5rem] bg-white border border-white shadow-xs overflow-hidden group">

                    {/* --- ENGINE DE REFRAÇÃO DINÂMICA --- */}
                    {/* 1. Brilho de Fundo (Aura) */}
                    <div
                        className="absolute -top-12 -right-12 w-64 h-64 blur-[80px] opacity-[0.12] transition-colors duration-1000"
                        style={{ backgroundColor: weaponEssence?.colorVar || 'var(--color-slate-200)' }}
                    />

                    {/* 2. Streak de Luz (Refração Diagonal) */}
                    <div
                        className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{
                            background: `linear-gradient(135deg, transparent 0%, ${weaponEssence?.colorVar || 'transparent'} 50%, transparent 100%)`,
                            transform: 'skewY(-10deg) translateY(-20%)'
                        }}
                    />

                    {/* 3. Spot Radial (Foco no Ícone) */}
                    <div
                        className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at 20% 30%, ${weaponEssence?.colorVar || 'transparent'} 0%, transparent 70%)`
                        }}
                    />

                    {/* --- CONTEÚDO --- */}
                    <div className="relative z-10 space-y-5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                {/* Container do Ícone com Refração de Borda */}
                                <div className="relative">
                                    <div
                                        className="absolute inset-0 blur-md opacity-20"
                                        style={{ backgroundColor: weaponEssence?.colorVar }}
                                    />
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-white relative z-10" style={{ color: weaponEssence?.colorVar }}>
                                        <NexusIcon name={weaponEssence?.iconName || 'Target'} size={28} />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Arsenal</span>
                                    <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                                        {equippedWeapon?.name || "Desarmado"}
                                    </h4>

                                    {/* Badge de Tipo Dinâmico */}
                                    <span
                                        className="mt-1.5 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border self-start transition-all"
                                        style={{
                                            backgroundColor: `${weaponEssence?.colorVar}10`, // 10% de opacidade
                                            color: weaponEssence?.colorVar || 'var(--color-slate-400)',
                                            borderColor: `${weaponEssence?.colorVar}20`
                                        }}
                                    >
                                        {equippedWeapon?.typeLabel || "Standard"}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-[6px] font-black text-slate-200 uppercase tracking-widest block">Alcance</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase italic">{equippedWeapon?.range || "---"}</span>
                            </div>
                        </div>

                        {/* Specs do Arsenal */}
                        <div className="space-y-5">
                            {/* 1. DESCRIÇÃO TÉCNICA */}
                            <div className="px-1 space-y-2">
                                <label className="text-[7px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Info size={10} className="opacity-50" />
                                    <span>Dossiê_Operacional</span>
                                </label>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                    "{equippedWeapon?.description || "Aguardando sincronia de dados..."}"
                                </p>
                            </div>

                            {/* 2. CÉLULA DE PROTOCOLOS (SPECIAL NOTES) */}
                            {equippedWeapon?.specialNotes && (() => {
                                const [protocol, ...synergyParts] = equippedWeapon.specialNotes.split('.');
                                const synergyClean = synergyParts.join('.').trim().replace(/sinergia:?\s*/i, '');

                                return (
                                    <div className="relative group/notes overflow-hidden rounded-4xl bg-linear-to-b from-slate-50/50 to-white border border-slate-100 shadow-xs">
                                        {/* Indicador de Energia Lateral */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 group-hover/notes:w-1.5"
                                            style={{ backgroundColor: weaponEssence?.colorVar || 'var(--color-slate-200)' }}
                                        />

                                        <div className="p-5 space-y-5">
                                            {/* BLOCO: PROTOCOLO ESPECIAL */}
                                            <div className="ml-2 space-y-2">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="p-1 rounded-md bg-white shadow-xs border border-slate-50"
                                                        style={{ color: weaponEssence?.colorVar }}
                                                    >
                                                        <Zap size={10} />
                                                    </div>
                                                    <label className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">Protocolo_Ativo</label>
                                                </div>
                                                <p className="text-[11px] text-slate-700 font-bold leading-snug tracking-tight">
                                                    {protocol.trim()}
                                                </p>
                                            </div>

                                            {/* BLOCO: SINERGIA (DESIGN DE EXPANSÃO) */}
                                            {synergyClean && (
                                                <div className="ml-2 pt-4 border-t border-slate-100/80 relative">
                                                    {/* Marker Técnico */}
                                                    <div
                                                        className="absolute -top-1.25 left-0 w-8 h-2 rounded-full opacity-20"
                                                        style={{ backgroundColor: weaponEssence?.colorVar }}
                                                    />

                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: weaponEssence?.colorVar }} />
                                                        <label className="text-[7px] font-black text-amber-600 uppercase tracking-[0.2em]">Sinergia_Detectada</label>
                                                    </div>

                                                    <div className="p-3 rounded-2xl bg-white border border-slate-50 shadow-xs">
                                                        <p className="text-[9px] text-slate-400 font-semibold leading-normal uppercase tracking-tighter">
                                                            {synergyClean}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- COLUNA 2: KIT INICIAL (SOFT-MODS) --- */}
            <div className="space-y-3">
                <SectionHeader icon={<Cpu size={10} />} label="Starter_Kit_Protocol" />

                <div className="relative p-6 rounded-[2.5rem] bg-slate-50/50 border border-white shadow-inner group h-full">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-white transition-transform group-hover:rotate-6">
                                <NexusIcon name={archetypeDetails?.iconName || 'Box'} size={24} />
                            </div>
                            <div>
                                <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest block">Arquétipo</span>
                                <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                                    {archetypeDetails?.name || "NEXUS_GHOST"}
                                </h4>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-500 font-bold italic leading-relaxed px-1">
                                    {archetypeDetails?.description || "Descrição de kit não indexada."}
                                </p>
                            </div>

                            {/* Itens do Kit como Tags Técnicas */}
                            <div className="space-y-2">
                                <label className="text-[6px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-1 ml-1">
                                    <Box size={8} /> Inventário_Base
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {archetypeDetails?.items?.split('•').map((item: string, idx: Key | null | undefined) => (
                                        <span key={idx} className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[7px] font-black text-slate-400 uppercase tracking-widest shadow-xs">
                                            {item.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function SectionHeader({ icon, label }) {
    return (
        <div className="flex items-center gap-2 text-slate-300 ml-4">
            <div className="p-1 rounded-md bg-slate-50 border border-white shadow-xs">{icon}</div>
            <span className="text-[7px] font-black uppercase tracking-[0.4em]">{label}</span>
        </div>
    );
}