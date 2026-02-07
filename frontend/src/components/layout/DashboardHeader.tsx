import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface DashboardHeaderProps {
    isConnected: boolean;
    currentPath: string;
    onMenuClick: () => void; // 🟢 NOVO: Sinal de abertura da Sidebar
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    isConnected,
    currentPath,
    onMenuClick
}) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
    const { logout } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pathName = currentPath.split('/').pop()?.replace('-', '_') || 'Overview';

    return (
        <header className="h-20 border-b border-white/60 flex items-center justify-between px-6 lg:px-12 bg-white/20 backdrop-blur-3xl relative z-40">

            {/* 1. FIBRA ÓPTICA (LINHA DE TOPO) */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-white/60 to-transparent" />

            {/* 2. LADO ESQUERDO: LOCALIZAÇÃO NO KERNEL */}
            <div className="flex items-center gap-4">

                {/* 🟢 GATILHO SIDEBAR (Visível abaixo de LG) */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onMenuClick}
                    // hidden (sm) | md:flex (tablet) | lg:hidden (desktop)
                    className="hidden md:flex lg:hidden w-10 h-10 rounded-xl bg-white border border-slate-100 flex-col items-center justify-center gap-1 shadow-xs"
                >
                    <div className="w-4 h-0.5 rounded-full bg-slate-800" />
                    <div className="w-2 h-0.5 rounded-full self-start ml-3" style={{ backgroundColor: 'var(--system-color)' }} />
                    <div className="w-4 h-0.5 rounded-full bg-slate-800" />
                </motion.button>

                {/* Breadcrumb Técnico */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 group cursor-pointer">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Root</span>
                        <ChevronRight size={8} className="text-slate-200" />
                        <span
                            className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] italic font-mono border-b"
                            style={{ borderColor: 'var(--system-color)' }}
                        >
                            {pathName}
                        </span>
                    </div>

                    {/* Status de Sincronia */}
                    <div className="flex items-center gap-1 mt-0.5">
                        <div className={`w-1 h-1 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                        <span className="text-[6px] font-mono font-black text-slate-400 uppercase tracking-widest">
                            {isConnected ? 'Sinc_Online' : 'Link_Lost'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. LADO DIREITO: TELEMETRIA E SAÍDA */}
            <div className="flex items-center gap-4">

                {/* Clock (Desktop Only) */}
                <div className="hidden md:flex flex-col items-end pr-5 border-r border-slate-100">
                    <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">Nexus_Clock</span>
                    <span className="text-[10px] font-black text-slate-700 tabular-nums">{time}</span>
                </div>

                {/* Saída de Emergência */}
                <button
                    onClick={logout}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-white/40 border border-white text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300 group shadow-xs"
                >
                    <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </header>
    );
};