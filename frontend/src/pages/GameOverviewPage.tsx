import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Fingerprint, Clock, Radio, ShieldCheck } from 'lucide-react';
import { useMasterNexus } from '../hooks/useMasterNexus';
import { useVault } from '../hooks/useVault';
import { NexusIcon } from '../components/common/NexusIcon';

export const GameOverviewPage = () => {
    // 1. CONSUMO DO HUB DE COMANDO
    const { characters, isLoading, isConnected } = useMasterNexus();
    const { vault, isLoading: vaultLoading } = useVault();

    if (isLoading || vaultLoading) {
        return (
            <div className="h-screen w-full bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Sincronizando_Sinal...</span>
            </div>
        );
    }

    // 2. LÓGICA DE GRID ADAPTATIVO (FIXO NA TELA)
    // Ajusta as colunas/linhas para que SEMPRE caiba tudo sem scroll
    const gridConfig = characters.length <= 4 
        ? 'grid-cols-2 grid-rows-2' 
        : characters.length <= 6 
            ? 'grid-cols-3 grid-rows-2' 
            : 'grid-cols-4 grid-rows-2';

    return (
        <div className="h-screen w-full bg-[#f8fafc] overflow-hidden flex flex-col p-6 gap-6 antialiased">
            
            {/* HEADER DE COMANDO: CERÂMICA LÍQUIDA */}
            <header className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-sm relative overflow-hidden">
                {/* Linha de Cristal Superior */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-500 relative">
                        <Radio size={24} className={isConnected ? "animate-pulse" : "opacity-30"} />
                        {isConnected && <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-800 italic leading-none">Nexus_Live_Telemetry</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Monitoramento Biométrico em Tempo Real</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Estado_do_Rádio</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full transition-all duration-1000 ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`} />
                            <span className="text-xs font-mono font-bold text-slate-600">{isConnected ? 'STABLE_SIGNAL' : 'LOST_SIGNAL'}</span>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-slate-100" />
                    <ClockDisplay />
                </div>
            </header>

            {/* GRID DE OPERATIVOS (SINAL DINÂMICO) */}
            <main className={`flex-1 grid gap-4 h-full ${gridConfig}`}>
                <AnimatePresence mode="popLayout">
                    {characters.map((char) => (
                        <CharacterMonitorCell 
                            key={char._id} 
                            character={char} 
                            vault={vault} 
                        />
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white/80 backdrop-blur-xl border-2 border-white rounded-[3.5rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.04)] flex flex-col justify-between overflow-hidden"
        >
            {/* Bloom de Fundo Refratário */}
            <div className="absolute -top-24 -right-24 w-72 h-72 blur-[100px] opacity-[0.07] pointer-events-none" 
                 style={{ backgroundColor: status?.colorVar || '#3b82f6' }} />

            <div className="relative z-10 space-y-8">
                {/* IDENTIDADE TÁTICA (FORMATO 3:4) */}
                <div className="flex items-center gap-8">
                    <div className="relative shrink-0">
                        {/* Avatar retangular 3:4 */}
                        <div className="w-24 h-32 md:w-28 md:h-36 bg-slate-900 rounded-[2.5rem] border-2 border-white shadow-2xl overflow-hidden relative">
                            <img src={character.identity.avatar} className="w-full h-full object-cover grayscale-[0.2]" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        </div>
                        {/* Indicador de Status Flutuante */}
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-xl border border-slate-50 flex items-center justify-center" style={{ color: status?.colorVar }}>
                            <NexusIcon name={status?.iconName || 'Activity'} size={20} />
                        </div>
                    </div>
                    
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Op_{character._id.slice(-4)}</span>
                            <div className="h-px w-8 bg-slate-100" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none truncate mb-3">
                            {character.identity.name}
                        </h2>
                        <motion.div 
                            key={status?.name}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white/50 backdrop-blur-sm"
                            style={{ borderColor: `${status?.colorVar}30`, color: status?.colorVar }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: status?.colorVar }} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{status?.name || 'ESTÁVEL'}</span>
                        </motion.div>
                    </div>
                </div>

                {/* TELEMETRIA VITAL (ALTA VISIBILIDADE) */}
                <div className="grid grid-cols-1 gap-8">
                    <BigVitalBar 
                        label="Integridade Biológica" 
                        current={character.stats.hp} 
                        max={character.stats.maxHp} 
                        color="var(--nexus-hp)" 
                    />
                    <BigVitalBar 
                        label="Sincronia Neural" 
                        current={character.stats.san} 
                        max={character.stats.maxSan} 
                        color="var(--nexus-san)" 
                    />
                </div>
            </div>

            {/* FOOTER: HARDWARE ATIVO */}
            <div className="relative z-10 pt-6 border-t border-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-white flex items-center justify-center text-slate-400">
                        <Swords size={18} />
                    </div>
                    <span className="text-sm font-black text-slate-700 uppercase italic tracking-tight">
                        {weapon?.name || "Combat_Desarmado"}
                    </span>
                </div>
                <div className="flex flex-col items-end opacity-20">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Protocolo_Nexus</span>
                    <ShieldCheck size={14} />
                </div>
            </div>
        </motion.div>
    );
};

const BigVitalBar = ({ label, current, max, color }: any) => {
    const pct = Math.min((current / max) * 100, 100);
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</span>
                <div className="flex items-baseline gap-2">
                    <motion.span 
                        key={current}
                        initial={{ scale: 1.3, filter: 'blur(5px)' }} 
                        animate={{ scale: 1, filter: 'blur(0px)' }}
                        className="text-4xl font-black italic tracking-tighter leading-none"
                        style={{ color }}
                    >
                        {current}
                    </motion.span>
                    <span className="text-base font-bold text-slate-200">/ {max}</span>
                </div>
            </div>
            <div className="h-5 w-full bg-slate-100 rounded-[1.2rem] border-2 border-white shadow-inner overflow-hidden p-1 relative">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 40, damping: 12 }}
                    className="h-full rounded-lg relative"
                    style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
                >
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-full" />
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
        <div className="flex flex-col items-end min-w-[100px]">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={10} /> Local_Time
            </span>
            <span className="text-xl font-mono font-bold text-slate-700 leading-none mt-1">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
        </div>
    );
};