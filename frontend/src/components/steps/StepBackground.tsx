import { motion } from 'framer-motion';
import type { CharacterData } from '../../models/character';

import {
    Package, Users,
    Activity, FileText
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { triggerHaptic } from '../../utils/triggerHaptic';

import { useVault } from '../../hooks/useVault';
import { NexusIcon } from '../common/NexusIcon';
import { LoadingScreen } from '../common/LoadingScreen';

import { HeaderStep } from '../shared/HeaderStep';

export const StepBackground = () => {
    const { vault, isLoading } = useVault(); // Puxa os dados do DB
    const { register, watch, setValue } = useFormContext<CharacterData>();

    const selectedClub = watch('background.club');
    const selectedArchetype = watch('background.archetype');

    if (isLoading || !vault) return <LoadingScreen message="Sincronizando Vault..." />;

    return (
        <div className="w-full space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">

            <HeaderStep
                icon="Library"
                label="Módulo 2"
                title="Dossiê de"
                highlight="Antecedentes"
                description="Compilando registros históricos..."
                accentColor="var(--color-step-background)"
                secondaryColor="var(--color-step-background-soft)"
            />

            {/* 2. ORIGEM CIVIL: CHIPS DE ESPECIALIZAÇÃO NEXUS CRYSTAL */}
            <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between px-3">
                    <div className="flex items-center gap-3">
                        {/* Ícone de Cabeçalho Sincronizado */}
                        <div className="p-1.5 bg-step-background-soft rounded-lg border border-step-background-soft">
                            <Users size={14} className="text-step-background" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Clubs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-step-background rounded-full animate-pulse shadow-[0_0_5px_#f59e0b]" />
                        <span className="text-[7px] font-mono text-step-background/60 uppercase font-black tracking-widest">Protocol_Sync_Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {vault.clubs.map((occ) => {
                        const isSelected = selectedClub === occ._id;
                        const attribute = vault.attributes.find(a => a._id === occ.bonus.attributeId._id);
                        return (
                            <button
                                key={occ._id}
                                type="button"
                                onClick={() => {
                                    setValue('background.club', occ._id);
                                    triggerHaptic('LIGHT');
                                }}
                                className={`group/chip relative p-4 md:p-5 rounded-4xl border-2 transition-all duration-500 text-left overflow-hidden backdrop-blur-md
                        ${isSelected
                                        ? 'border-step-background bg-white shadow-[0_15px_30px_-10px_rgba(245,158,11,0.2)] scale-[1.02] md:scale-100'
                                        : 'border-white/80 bg-white/40 hover:border-step-background-soft shadow-sm'
                                    }`}
                            >
                                {/* BRILHO DE SUPERFÍCIE (CERAMIC GLOSS) */}
                                <div className={`absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white to-transparent transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-40'}`} />

                                {/* TEXTURA HUD INTERNA (SUTIL) */}
                                {isSelected && (
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] bg-size-[12px_12px]" />
                                )}

                                <div className="relative z-10 flex items-center gap-4">
                                    {/* Icon Box: Ceramic Socket */}
                                    <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                            ${isSelected
                                            ? 'bg-step-background text-white border-step-background shadow-[0_5px_15px_var(--color-step-background)]'
                                            : 'bg-white text-slate-400 border-slate-100 shadow-inner'
                                        }`}>
                                        <div className={`transition-transform duration-500 ${isSelected ? 'scale-110 rotate-3' : 'scale-100'}`}>
                                            <NexusIcon name={occ.iconName} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <div className="flex justify-between items-center gap-2">
                                            <h4 className={`text-xs md:text-sm font-black uppercase tracking-tighter truncate ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {occ.name}
                                            </h4>
                                            {/* Bonus Chip: Nexus Pattern */}
                                            <span className={`shrink-0 text-[8px] font-black px-2 py-0.5 rounded-lg border-2 transition-all duration-500
    ${isSelected
                                                    ? 'bg-step-background-soft border-step-background-soft text-step-background shadow-sm'
                                                    : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                                                }`}>
                                                +{occ.bonus.value} {attribute?.name.slice(0, 3).toUpperCase() || '???'}
                                            </span>
                                        </div>
                                        <p className={`text-[9px] md:text-[10px] font-bold leading-tight line-clamp-2 transition-colors duration-500
                                ${isSelected ? 'text-step-background' : 'text-slate-400'}`}>
                                            {occ.description}
                                        </p>
                                    </div>
                                </div>

                                {/* SHIMMER DE SELEÇÃO */}
                                {isSelected && (
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. MANIFESTO DE CARGA: KITS DE SOBREVIVÊNCIA (TANGERINE SYNC) */}
            <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between px-3">
                    <div className="flex items-center gap-3">
                        {/* Ícone com novo acento Laranja */}
                        <div className="p-1.5 bg-step-background-soft rounded-lg border border-step-background-soft">
                            <Package size={14} className="text-step-kits" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Inventory_Loadout</span>
                    </div>
                    <div className="flex gap-1.5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-2.5 h-1 rounded-full transition-all duration-500 ${selectedArchetype ? 'bg-step-kits shadow-[0_0_8px_var(--color-step-kits)]/50' : 'bg-slate-100'}`} />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {vault.archetypes.map((archetype) => {
                        const isSelected = selectedArchetype === archetype._id;
                        return (
                            <button
                                key={archetype._id}
                                type="button"
                                onClick={() => {
                                    setValue('background.archetype', archetype._id);
                                    if (triggerHaptic) triggerHaptic('LIGHT');
                                }}
                                className={`
                group/kit relative p-5 md:p-6 rounded-[2.5rem] border-2 transition-all duration-700 text-left overflow-hidden backdrop-blur-3xl
                ${isSelected
                                        ? 'border-step-kits bg-white shadow-[0_20px_40px_-15px_var(--color-step-kits-soft)] scale-[1.02]'
                                        : 'border-white/80 bg-white/40 hover:border-step-kits/30 shadow-sm hover:-translate-y-0.5'
                                    }
            `}
                            >
                                {/* 1. NÚCLEO DE FÓTONS (BRILHO DE SUPERFÍCIE) */}
                                <div className={`absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white to-transparent transition-opacity duration-700 ${isSelected ? 'opacity-100' : 'opacity-20'}`} />

                                <div className="relative z-10 flex flex-col gap-5">

                                    {/* HEADER: IDENTIDADE E ÍCONE */}
                                    <div className="flex items-start gap-4">
                                        <div className={`
                        shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2
                        ${isSelected
                                                ? 'bg-step-kits text-white border-step-kits shadow-[0_10px_20px_-5px_var(--color-step-kits)]'
                                                : 'bg-white text-slate-400 border-slate-100 shadow-inner'
                                            }
                    `}>
                                            <div className={`transition-all duration-700 ${isSelected ? 'scale-110 rotate-0' : 'scale-90 -rotate-6'}`}>
                                                <NexusIcon name={archetype.iconName} />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[7px] font-black text-step-kits uppercase tracking-[0.3em] opacity-60">Kit_Manifesto</span>
                                                {isSelected && (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-step-kits-soft rounded-full border border-step-kits/10">
                                                        <div className="w-1.5 h-1.5 bg-step-kits rounded-full animate-pulse" />
                                                        <span className="text-[6px] font-black text-step-kits uppercase">Active</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className={`text-sm md:text-base font-black uppercase tracking-tight truncate ${isSelected ? 'text-step-kits' : 'text-step-kits/50'}`}>
                                                {archetype.name}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* 2. DESCRIÇÃO: BRIEFING TÁTICO (A ALMA DO KIT) */}
                                    <div className={`
                    relative p-3.5 rounded-2xl border transition-all duration-500
                    ${isSelected ? 'bg-step-kits-soft/30 border-step-kits/10' : 'bg-slate-50/50 border-transparent'}
                `}>
                                        <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-colors ${isSelected ? 'bg-step-kits' : 'bg-slate-200'}`} />
                                        <p className={`text-[10px] md:text-[11px] leading-relaxed font-medium italic pl-4 ${isSelected ? 'text-slate-700' : 'text-slate-400'}`}>
                                            "{archetype.description}"
                                        </p>
                                    </div>

                                    {/* 3. ITEMS: CARGA DE INVENTÁRIO (Sincronizado com o novo data) */}
                                    <div className="space-y-2">
                                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest pl-1">Carga_Inicial</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {archetype.items?.map((item: any, i: number) => (
                                                <div key={i} className={`
                                                flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all duration-500
                                                    ${isSelected
                                                        ? 'bg-white border-step-kits/20 text-slate-700 shadow-sm'
                                                        : 'bg-white/40 border-slate-100 text-slate-400 opacity-60'
                                                    }
                                                `}>
                                                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-step-kits' : 'bg-slate-300'}`} />
                                                    <span className="text-[8px] font-black uppercase tracking-tighter text-nowrap">
                                                        {/* Acessamos a propriedade .name do objeto IItem */}
                                                        {item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 4. FRAGMENTO DE MEMÓRIA: TERMINAL DE LOG */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2.5">
                        <FileText size={14} className="text-step-background" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">Memory_Recovery</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-step-background-soft border border-step-background-soft rounded-md">
                        <Activity size={8} className="text-step-background" />
                        <span className="text-[6px] font-mono font-bold text-step-background uppercase">Input_Stable</span>
                    </div>
                </div>

                <div className="relative">
                    {/* Brackets de Hardware (Minimalistas) */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-step-background-soft/50 rounded-tl-xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-step-background-soft/50 rounded-br-xl pointer-events-none" />

                    <textarea
                        {...register('background.biography')}
                        placeholder="Acesso ao banco de memórias... descreva sua origem."
                        className="w-full h-36 p-5 bg-white/60 border-2 border-slate-100 rounded-[1.8rem] outline-none 
                        focus:border-step-background focus:bg-white transition-all text-sm text-slate-700 
                        placeholder:text-slate-200 font-medium leading-relaxed resize-none shadow-inner"
                    />

                    <div className="absolute bottom-4 right-6 flex items-center gap-2 opacity-30">
                        <span className="text-[7px] font-black text-step-background uppercase tracking-widest">Sincronizando_Dados</span>
                        <div className="w-1.5 h-1.5 bg-step-background rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};