import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Shield,
} from 'lucide-react';
import { useVault } from '../../hooks/useVault';
import { NexusIcon } from '../common/NexusIcon';

interface IdentityCardProps {
    data?: any;      // Dados voláteis do Form (Step 5)
    character?: any; // Dados sólidos do DB (Dashboard)
}

export const IdentityCard = memo(({ data, character }: IdentityCardProps) => {
    const { vault } = useVault();
    const CURRENT_YEAR = new Date().getFullYear();;

    const identity = data?.identity || character?.identity || {};
    const background = data?.background || character?.background || {};

    const age = identity.age || 14;
    const name = identity.name || "Cidadão_Nexus";
    const birthYear = CURRENT_YEAR - age;

    const clubInfo = useMemo(() => {
        const clubRef = background.club;
        return vault?.clubs.find(c => c._id === clubRef || c.key === clubRef || c.id === clubRef);
    }, [vault, background.club]);

    const archetypeInfo = useMemo(() => {
        const archetypeRef = background.archetype;
        return vault?.archetypes.find(a => a._id === archetypeRef || a.key === archetypeRef || a.id === archetypeRef);
    }, [vault, background.archetype]);

    return (
        <div className="relative bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] md:rounded-[3rem] p-5 md:p-8 shadow-xl overflow-hidden group">

            {/* 1. PADRÃO DE FUNDO TÉCNICO */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">

                {/* 2. AVATAR MODULE (PRISMA VISOR) */}
                <div className="relative shrink-0">
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-4xl flex items-center justify-center text-white shadow-2xl relative overflow-hidden group/avatar">
                        <div className="absolute inset-0 bg-linear-to-tr from-step-identity to-transparent opacity-70" />
                        <NexusIcon name={clubInfo?.iconName || 'UserCircle2'} size={32} className="relative z-10 opacity-80 group-hover/avatar:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-[6px] font-black text-slate-500 uppercase tracking-tighter">ID</span>
                    </div>
                </div>

                {/* 3. INFO CONTENT */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <span className="text-[8px] font-mono font-bold text-step-identity uppercase tracking-[0.3em]">
                                ID_{birthYear}.NXS
                            </span>
                            <div className="h-px w-8 bg-slate-100" />
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter">
                            {name}
                        </h3>
                    </div>

                    {/* 4. CHIPS GRID (COMPACTO) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <InfoChip label="Idade" value={`${age} anos`} icon={<Activity size={12} />} />
                        <InfoChip label="Clube" value={clubInfo?.name || "N/A"} accent="var(--color-step-background)" />
                        <InfoChip label="Arquétipo" value={archetypeInfo?.name || "N/A"} accent="var(--color-step-kits)" />
                    </div>
                </div>
            </div>
        </div>
    );
});

const InfoChip = ({ label, value, icon, accent }: any) => (
    <div
        className="flex flex-col p-2.5 md:p-3 bg-white/60 border border-white rounded-2xl shadow-sm hover:bg-white transition-all duration-300"
        style={{ borderLeft: accent ? `3px solid ${accent}` : '1px solid white' }}
    >
        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
        <div className="flex items-center gap-1.5">
            {icon && <span style={{ color: accent || 'var(--color-step-identity)' }}>{icon}</span>}
            <span className="text-[10px] md:text-[11px] font-black text-slate-700 uppercase truncate">{value}</span>
        </div>
    </div>
);