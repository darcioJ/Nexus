import { motion } from 'framer-motion';
import { Terminal, Zap } from 'lucide-react';

interface AuthTelemetryProps {
    logs: string[];
}

export const AuthTelemetry = ({ logs }: AuthTelemetryProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-8 left-8 hidden 2xl:block z-40"
        >
            <div className="bg-white/40 backdrop-blur-xl border border-white p-5 rounded-4xl w-72 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
                {/* --- HEADER DO TERMINAL --- */}
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[9px] font-black text-slate-900 tracking-widest uppercase flex items-center gap-2">
                        <Terminal size={12} className="text-step-identity" /> 
                        Console_Nexus
                    </span>
                    <Zap size={10} className="text-step-identity animate-pulse" />
                </div>

                {/* --- ÁREA DE LOGS --- */}
                <div className="space-y-1.5 font-mono overflow-hidden">
                    {logs.map((log, i) => (
                        <motion.div 
                            key={`${i}-${log}`}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter flex gap-2"
                        >
                            <span className="text-step-identity/40">[{i}]</span> 
                            <span className="truncate">{log}</span>
                        </motion.div>
                    ))}
                </div>

                {/* --- DECORAÇÃO DE HARDWARE --- */}
                <div className="mt-4 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-0.5 rounded-full ${i === 3 ? 'w-8 bg-step-identity' : 'w-2 bg-slate-100'}`} 
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};