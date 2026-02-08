import React from 'react';
import { motion } from "framer-motion";
import { Activity, Zap, ShieldCheck } from "lucide-react";

import { NexusIcon } from '../../common/NexusIcon';

export const AfflictionMonitor = ({ status, colorToken, vs }) => (
    <div className={`
        relative p-6 md:p-10 rounded-[3rem] md:rounded-[4rem] border-2 border-white 
        overflow-hidden bg-white/90 backdrop-blur-3xl transition-all duration-700
        shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),inset_0_0_80px_white]
    `}
        style={{
            boxShadow: `0 30px 60px -15px rgba(0,0,0,0.08), inset 0 0 80px white, inset 0 0 40px ${colorToken}10`
        }}>

        {/* 1. EMISSÃO DE RADIAÇÃO (GLOW) */}
        <div
            className="absolute -top-32 -left-32 w-80 h-80 blur-[100px] transition-all duration-1000 opacity-10 pointer-events-none"
            style={{ backgroundColor: colorToken }}
        />

        {/* 2. GRID TÉCNICO DE HUD */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
                backgroundImage: `radial-gradient(${colorToken} 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
            }}
        />

        <div className="relative z-10 space-y-10">

            {/* HEADER: SOCKET DE DIAGNÓSTICO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-5 md:gap-7">
                    {/* ICON REACTOR: Socket Cerâmico */}
                    <div className="relative w-16 h-16 rounded-4xl md:rounded-[3rem] flex items-center justify-center bg-white border border-slate-50 shadow-xl group-hover:rotate-6 transition-transform duration-700 overflow-hidden">
                        <div className="absolute inset-0 opacity-10 rounded-inherit" style={{ backgroundColor: colorToken }} />
                        <div className="relative z-10" style={{ color: colorToken }}>
                            <NexusIcon name={status.iconName} size={40} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Activity size={10} style={{ color: colorToken }} className="animate-pulse" />
                            <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">
                                Monitor_Aflição
                            </p>
                        </div>
                        <h4 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                            {status.name}
                        </h4>
                    </div>
                </div>
            </div>

            {/* 3. BRIEFING DE LORE (DADOS TÁTICOS) */}
            <div className="relative p-6 md:p-8 bg-slate-50/40 border border-white rounded-4xl overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full" style={{ backgroundColor: colorToken }} />
                <p className="text-sm font-bold text-slate-600 italic leading-relaxed pl-4">
                    "{status.description}"
                </p>
            </div>

            {/* 4. SUB-GRIDS: MÓDULOS DE IMPACTO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
                <StatModule
                    icon={<Zap size={14} />}
                    label="Impacto_Turno"
                    value={status.mechanic}
                    color={colorToken}
                />
                <StatModule
                    icon={<ShieldCheck size={14} />}
                    label="Resistência_Sistêmica"
                    value={status.resistance}
                    color="#64748b"
                />
            </div>

            {/* 5. SCANNER DE VULNERABILIDADE (SINAL DE FIBRA ÓTICA) */}
            <div className="mt-8 pt-8 border-t border-slate-100/60 space-y-6">

                {/* HEADER TÉCNICO: Tipografia de Alta Precisão */}
                <div className="flex justify-between items-end px-1">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: colorToken }} />
                            <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">
                                Cálculo_Eficácia
                            </span>
                        </div>
                        <span className="text-[10px] md:text-xs font-bold uppercase text-slate-500 tracking-tight italic">
                            Vulnerabilidade_vs: <span className="font-black" style={{ color: colorToken }}>{vs}</span>
                        </span>
                    </div>

                    {/* Contador Digital Minimalista */}
                    <div className="flex flex-col items-end">
                        <span className="text-[6px] font-mono font-black text-slate-300 uppercase tracking-widest mb-1 text-right">Percentage</span>
                        <span className="text-sm md:text-lg font-mono font-black tabular-nums italic leading-none" style={{ color: colorToken }}>
                            85.4%
                        </span>
                    </div>
                </div>

                {/* O CHASSIS DA FIBRA (Gauges) */}
                <div className="relative h-2 md:h-3 w-full bg-slate-50 rounded-full border border-white shadow-inner flex items-center p-0.5 overflow-hidden">

                    {/* 1. O NÚCLEO (CORE) DA FIBRA: Gradiente Suave */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85.4%' }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{
                            background: `linear-gradient(90deg, 
                    color-mix(in srgb, ${colorToken}, transparent 80%), 
                    ${colorToken}
                )`,
                            boxShadow: `0 0 15px ${colorToken}40`
                        }}
                    >
                        {/* 2. O FILAMENTO DE LUZ (HIGH-BRIGHTNESS) */}
                        <div className="absolute top-0 left-0 w-full h-px bg-white/40" />

                        {/* 3. PULSO FOTÔNICO (SHIMMER) */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] pointer-events-none"
                        />
                    </motion.div>

                    {/* 4. AURA DE RADIAÇÃO (EXTERNA) */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85.4%' }}
                        className="absolute inset-0 blur-md opacity-20 pointer-events-none"
                        style={{ backgroundColor: colorToken }}
                    />

                    {/* 5. MARCADORES DE CALIBRAGEM (MICRO-RÉGUA) */}
                    <div className="absolute inset-0 flex justify-between px-4 opacity-10 pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-px h-full bg-slate-900" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* --- MÓDULO AUXILIAR: DATA CHIP (PRECISION NEXUS) --- */
const StatModule = ({ label, value, color, icon }) => (
    <div
        className={`
            relative p-5 md:p-7 rounded-4xl md:rounded-[2.8rem] transition-all duration-700
            bg-white/90 backdrop-blur-2xl border-2 border-white group/mod overflow-hidden
            shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05),inset_0_0_30px_white]
            hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]
        `}
    >
        {/* 1. EMISSÃO INTERNA (GLOW) */}
        <div
            className="absolute -top-12 -right-12 w-24 h-24 blur-[60px] opacity-0 group-hover/mod:opacity-20 transition-opacity duration-1000"
            style={{ backgroundColor: color }}
        />

        <div className="relative z-10 flex flex-col gap-5">

            {/* HEADER: SOCKET E TAG TÉCNICA */}
            <div className="flex items-center justify-between">
                <div
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-inner transition-transform duration-700 group-hover/mod:scale-110"
                    style={{ color: color }}
                >
                    {React.cloneElement(icon as React.ReactElement, { size: 16, strokeWidth: 2.5 })}
                </div>
            </div>

            {/* CONTEÚDO: TIPOGRAFIA TÁTICA (Menos "garrafal", mais "técnica") */}
            <div className="flex flex-col text-left space-y-1">
                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.35em] text-slate-400 leading-none">
                    {label}
                </span>

                <div className="flex items-baseline gap-2">
                    <span
                        className="text-lg md:text-2xl font-black tracking-tight tabular-nums leading-none"
                        style={{ color: color }}
                    >
                        {value}
                    </span>
                    {/* Linha de Base Prismática */}
                    <div className="h-px flex-1 bg-slate-100 relative overflow-hidden">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-linear-to-r from-transparent via-current to-transparent opacity-20"
                            style={{ color: color }}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* 4. RIM LIGHT (BRILHO DE BORDA) */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white to-transparent opacity-60" />
    </div>
);