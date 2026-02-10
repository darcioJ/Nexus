import { motion } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const LoadingScreen = ({ message }: { message: string }) => {
    return (
        <div className="h-dvh w-full bg-[#FAFAFA] flex flex-col items-center justify-center relative overflow-hidden font-sans">
            
            {/* 1. ENGINE DE REFRAÇÃO CROMÁTICA (Fundo Iridescente) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Bloom Esmeralda/Ciano */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 50, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,transparent_70%)] blur-[120px]" 
                />
                {/* Bloom Safira/Violeta */}
                <motion.div 
                    animate={{ 
                        scale: [1.3, 1, 1.3],
                        opacity: [0.15, 0.3, 0.15],
                        x: [0, -50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-1/4 -right-1/4 w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)] blur-[120px]" 
                />
            </div>

            {/* 2. GRID DE CALIBRAÇÃO (Sinal de Fundo) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} 
            />

            {/* 3. O PRISMA NEURAL (Visual Central) */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                    {/* Anéis de Cristal Rotativos */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ 
                                rotate: i % 2 === 0 ? 360 : -360,
                                scale: [1, 1.05, 1],
                                borderColor: ['rgba(226,232,240,0.8)', 'rgba(99,102,241,0.3)', 'rgba(226,232,240,0.8)']
                            }}
                            transition={{ 
                                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                borderColor: { duration: 3, repeat: Infinity }
                            }}
                            className="absolute inset-0 border-[1px] rounded-[2.5rem] bg-white/5 backdrop-blur-sm"
                            style={{ 
                                padding: `${i * 12}px`,
                                margin: `${i * 4}px`,
                                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)'
                            }}
                        />
                    ))}

                    {/* Núcleo de Luz Prisma */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360],
                                filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-blue-500 to-purple-500 blur-[2px] shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                        />
                        <div className="absolute w-6 h-6 bg-white rounded-lg shadow-inner flex items-center justify-center">
                            <Sparkles size={12} className="text-slate-300 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* 4. MENSAGEM & TELEMETRIA (Sentence Case) */}
                <div className="mt-12 text-center space-y-6">
                    <div className="space-y-1">
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300"
                        >
                            Iniciando Protocolo
                        </motion.p>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                            {message}...
                        </h2>
                    </div>

                    {/* Barra de Espectro Iridescente */}
                    <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative border border-white">
                        <motion.div 
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 opacity-60"
                        />
                    </div>

                    {/* Status Chips */}
                    <div className="flex gap-3 justify-center">
                        <StatusTag icon={<Zap size={8} />} label="Energia Estável" />
                        <StatusTag icon={<ShieldCheck size={8} />} label="Sinal Criptografado" />
                    </div>
                </div>
            </div>

            {/* 5. HUD LATERAIS (Labels de Sistema) */}
            <div className="absolute inset-0 pointer-events-none p-10 hidden md:block">
                <div className="h-full w-full border border-slate-900/[0.03] rounded-[4rem] relative">
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                        <span className="text-[6px] font-mono font-black text-slate-200 uppercase tracking-[1em]">Nexus_System_Loading</span>
                    </div>
                    <div className="absolute bottom-8 left-12 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Sincronia: 100%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusTag = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
        <span className="text-slate-400">{icon}</span>
        <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
);