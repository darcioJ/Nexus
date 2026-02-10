import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Fingerprint, Clock, Radio, ShieldCheck, Activity, Heart, Brain } from 'lucide-react';
import { useMasterNexus } from '../hooks/useMasterNexus';
import { useVault } from '../hooks/useVault';
import { NexusIcon } from '../components/common/NexusIcon';

export const GameOverviewPage = () => {
    const { characters, isLoading, isConnected } = useMasterNexus();
    const { vault, isLoading: vaultLoading } = useVault();

    if (isLoading || vaultLoading) {
        return (
            <div className="h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center gap-6">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-t-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                    />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400 animate-pulse">Sincronia_Global</span>
            </div>
        );
    }

    const gridConfig = characters.length <= 4 
        ? 'grid-cols-2' 
        : characters.length <= 6 
            ? 'grid-cols-3' 
            : 'grid-cols-4';

    return (
        <div className="h-screen w-full bg-[#F5F7FA] overflow-hidden flex flex-col p-8 gap-8 antialiased">
            
            {/* HEADER DE COMANDO: CERÂMICA LÍQUIDA */}
            <header className="flex justify-between items-center px-12 py-6 bg-white border border-white rounded-[3.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center text-blue-500">
                        <Radio size={28} className={isConnected ? "animate-pulse" : "opacity-20"} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-800 italic leading-none">Nexus_Telemetry</h1>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                             Monitoramento Biométrico Ativo
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-10 relative z-10">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sinal_Rede</span>
                        <span className={`text-sm font-mono font-bold ${isConnected ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isConnected ? 'SIGNAL_STABLE_V2' : 'SIGNAL_LOST'}
                        </span>
                    </div>
                    <div className="h-12 w-px bg-slate-100" />
                    <ClockDisplay />
                </div>
            </header>

            {/* GRID DE OPERATIVOS */}
            <main className={`flex-1 grid gap-6 h-full ${gridConfig}`}>
                <AnimatePresence mode="popLayout">
                    {characters.map((char) => (
                        <CharacterMonitorCell key={char._id} character={char} vault={vault} />
                    ))}
                </AnimatePresence>
            </main>
        </div>
    );
};

const CharacterMonitorCell = ({ character, vault }: any) => {
    const status = vault?.statusEffects?.find((s: any) => s._id === character.stats?.status);
    const weapon = vault?.weapons?.find((w: any) => w._id === character.weapons?.primary);

    return (
        <motion.div
            layout
            className="relative bg-white/90 backdrop-blur-xl border-2 border-white rounded-[4rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] flex flex-col justify-between overflow-hidden"
        >
            {/* Bloom de Fundo Refratário */}
            <div className="absolute -top-24 -right-24 w-80 h-80 blur-[120px] opacity-[0.06] pointer-events-none transition-colors duration-1000" 
                 style={{ backgroundColor: status?.colorVar || '#3b82f6' }} />

            <div className="relative z-10 space-y-10">
                {/* IDENTIDADE */}
                <div className="flex items-center gap-8">
                    <div className="relative shrink-0">
                        <div className="w-28 h-36 bg-slate-900 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden">
                            <img src={character.identity.avatar} className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-slate-50 flex items-center justify-center" style={{ color: status?.colorVar }}>
                            <NexusIcon name={status?.iconName || 'Activity'} size={24} />
                        </div>
                    </div>
                    
                    <div className="min-w-0">
                        <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none truncate mb-3">
                            {character.identity.name}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                OP_{character._id.slice(-4)}
                            </span>
                            <div className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-2"
                                 style={{ backgroundColor: `${status?.colorVar}10`, borderColor: `${status?.colorVar}30`, color: status?.colorVar }}>
                                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: status?.colorVar }} />
                                {status?.name || 'ESTÁVEL'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* VITAIS TÉCNICOS */}
                <div className="grid grid-cols-1 gap-8">
                    <BigVitalBar 
                        label="Integridade Biológica" 
                        current={character.stats.hp} 
                        max={character.stats.maxHp} 
                        color="var(--nexus-hp)" 
                        icon={<Heart size={10} />}
                    />
                    <BigVitalBar 
                        label="Sincronia Neural" 
                        current={character.stats.san} 
                        max={character.stats.maxSan} 
                        color="var(--nexus-san)" 
                        icon={<Brain size={10} />}
                    />
                </div>
            </div>

            {/* FOOTER */}
            <div className="relative z-10 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-white flex items-center justify-center text-slate-400">
                        <Swords size={20} />
                    </div>
                    <span className="text-[12px] font-black text-slate-700 uppercase italic tracking-tight">
                        {weapon?.name || "Standard_Issue"}
                    </span>
                </div>
                <div className="flex flex-col items-end opacity-20">
                    <Fingerprint size={16} />
                </div>
            </div>
        </motion.div>
    );
};

const BigVitalBar = ({ label, current, max, color, icon }: any) => {
    const pct = Math.min((current / max) * 100, 100);
    
    return (
        <div className="space-y-3 group/bar">
            {/* LABELS */}
            <div className="flex justify-between items-end px-1">
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-slate-50 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                        {icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                    <motion.span 
                        key={current}
                        initial={{ opacity: 0.5, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black italic tracking-tighter leading-none"
                        style={{ color }}
                    >
                        {current}
                    </motion.span>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-tighter">/ {max}</span>
                </div>
            </div>

            {/* BARRA CHASSIS */}
            <div className="relative h-6 w-full bg-slate-100/50 rounded-[1.2rem] border-2 border-white shadow-inner overflow-hidden p-1.5 backdrop-blur-sm">
                
                {/* GRID DE FUNDO (MARCADORES DE 25%) */}
                <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
                    <div className="w-px h-full bg-slate-300" />
                    <div className="w-px h-full bg-slate-300" />
                    <div className="w-px h-full bg-slate-300" />
                </div>

                {/* FILLEMENT DE ENERGIA (A BARRA REAL) */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="h-full rounded-lg relative overflow-hidden"
                    style={{ 
                        backgroundColor: color, 
                        boxShadow: `0 0 25px ${color}50, inset 0 0 10px rgba(255,255,255,0.3)` 
                    }}
                >
                    {/* Efeito de Vidro/Brilho Superior */}
                    <div className="absolute top-0 left-0 w-full h-[40%] bg-white/20 rounded-t-full" />
                    
                    {/* Scanline Dinâmico que percorre a barra */}
                    <motion.div 
                        animate={{ x: ['-100%', '700%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-20 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                    />
                </motion.div>
            </div>
        </div>
    );
};

const ClockDisplay = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="flex flex-col items-end min-w-[120px]">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} /> Local_Time
            </span>
            <span className="text-2xl font-mono font-bold text-slate-800 leading-none mt-2">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
        </div>
    );
};