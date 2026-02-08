import { motion } from 'framer-motion';

export const LoadingScreen = ({ message }: { message: string }) => {
    return (
        <div className="h-dvh w-full bg-[#FDFDFD] flex flex-col items-center justify-center relative overflow-hidden font-sans">
            
            {/* 1. MESH GRADIENT DINÂMICO (Ambiente Refrativo) */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-full h-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-full h-h-fullg-[radial-gradient(circle,rgba(244,63,94,0.1)_0%,transparent_70%)] blur-[120px]" 
                />
            </div>

            {/* 2. HUD DE COORDENADAS (Estética Técnica) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none">
                <div className="absolute top-10 left-10 flex flex-col gap-1">
                    <span className="text-[8px] font-mono font-black tracking-widest uppercase">LAT: 38.8951</span>
                    <span className="text-[8px] font-mono font-black tracking-widest uppercase">LONG: -77.0364</span>
                </div>
                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-1 text-right">
                    <span className="text-[8px] font-mono font-black tracking-widest uppercase">Nexus_Core_Active</span>
                    <div className="flex gap-0.5">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-px h-2 bg-slate-900" />
                        ))}
                    </div>
                </div>
                {/* Grid de fundo */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* 3. O MONÓLITO PRISMÁTICO (Visual Principal) */}
            <div className="relative z-10 scale-75 md:scale-100">
                <div className="relative w-48 h-64">
                    {/* Camadas de Vidro Refratado */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, rotateY: 45 }}
                            animate={{ 
                                opacity: [0.4, 0.8, 0.4],
                                y: [0, -15, 0],
                                rotateY: [45, 55, 45],
                                rotateZ: [i * 5, i * 5 + 2, i * 5]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity, 
                                delay: i * 0.4,
                                ease: "easeInOut" 
                            }}
                            className="absolute inset-0 rounded-2xl border-2 border-white bg-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05),inset_0_0_30px_white]"
                            style={{ 
                                zIndex: 10 - i,
                                transformStyle: 'preserve-3d',
                                left: `${i * 12}px`,
                                top: `${i * 8}px`
                            }}
                        >
                            {/* Feixe de Luz Interno */}
                            <div className="absolute inset-0 overflow-hidden rounded-inherit">
                                <motion.div 
                                    animate={{ x: ['-200%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg]"
                                />
                            </div>
                        </motion.div>
                    ))}

                    {/* Núcleo Pulsante de Dados */}
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full blur-[10px] z-20" 
                    />
                </div>
            </div>

            {/* 4. TIPOGRAFIA DE SINCRONIA (A Mensagem) */}
            <div className="relative z-10 mt-16 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center">
                    <motion.h2 
                        initial={{ letterSpacing: "0.2em", opacity: 0 }}
                        animate={{ letterSpacing: "0.8em", opacity: 1 }}
                        className="text-[10px] md:text-[12px] font-black uppercase text-slate-900/80 mb-4 transition-all"
                    >
                        {message}
                    </motion.h2>
                    
                    {/* Barra de Progresso "Bit-Stream" */}
                    <div className="flex gap-1.5 h-1">
                        {[...Array(24)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ 
                                    backgroundColor: ["#E2E8F0", "#6366F1", "#E2E8F0"],
                                    scaleY: [1, 2, 1]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    delay: i * 0.05 
                                }}
                                className="w-0.5 rounded-full"
                            />
                        ))}
                    </div>
                </div>

                {/* Status de Carga */}
                <div className="flex items-center gap-4 px-6 py-2 bg-white border border-slate-100 rounded-full shadow-sm">
                    <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-[7px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">
                        Sync_In_Progress // Sector_4_Stable
                    </span>
                </div>
            </div>

            {/* 5. FOOTER: ASSINATURA DE HARDWARE */}
            <div className="absolute bottom-12 w-full px-12 flex justify-between items-center">
                <div className="h-px flex-1 bg-slate-100 max-w-25" />
                <span className="text-[6px] md:text-[8px] font-mono font-bold text-slate-300 tracking-[0.8em] uppercase mx-8">
                    Prisma_Nexus_OS // Neural_Induction_Active
                </span>
                <div className="h-px flex-1 bg-slate-100 max-w-25" />
            </div>
        </div>
    );
};