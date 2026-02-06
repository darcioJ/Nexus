import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export const AuthSuccess = () => {
    return (
        <motion.div
            key="success-nexus"
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-10 z-40"
        >
            {/* --- NÚCLEO DE VALIDAÇÃO --- */}
            <div className="relative">
                {/* Aura de Sucesso (Refração de Fundo) */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2] 
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-step-identity blur-3xl rounded-full"
                />

                <div className="w-36 h-36 rounded-[3.5rem] bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center justify-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.5, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20,
                            delay: 0.2 
                        }}
                    >
                        <ShieldCheck className="text-step-identity" size={70} strokeWidth={1} />
                    </motion.div>
                    
                    {/* Micro-LED de Hardware Ativo */}
                    <div className="absolute top-8 right-8 w-3 h-3 bg-step-identity rounded-full border-4 border-white shadow-[0_0_10px_var(--color-step-identity)]" />
                </div>
            </div>

            {/* --- TEXTO DE TELEMETRIA FINAL --- */}
            <div className="text-center space-y-3">
                <motion.h1 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-950 font-black text-3xl tracking-tighter uppercase"
                >
                    Sinal_Estabilizado
                </motion.h1>
                
                <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-3"
                >
                    <span className="h-px w-8 bg-slate-100" />
                    <p className="text-step-identity text-[10px] font-black tracking-[0.6em] uppercase animate-pulse">
                        Entrando_No_Vault
                    </p>
                    <span className="h-px w-8 bg-slate-100" />
                </motion.div>
            </div>
        </motion.div>
    );
};