import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Fingerprint } from 'lucide-react';

interface AuthHeaderProps {
    isLoginMode: boolean;
}

export const AuthHeader = ({ isLoginMode }: AuthHeaderProps) => {
    return (
        <header className="flex flex-col items-center mb-10">
            {/* --- NÚCLEO DE ÍCONE DINÂMICO --- */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 rounded-[2.2rem] bg-white border border-slate-50 shadow-sm flex items-center justify-center mb-5 relative"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLoginMode ? 'login-icon' : 'register-icon'}
                        initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 15, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isLoginMode ? (
                            <Cpu className="text-step-identity" size={34} strokeWidth={1.5} />
                        ) : (
                            <Fingerprint className="text-step-identity" size={34} strokeWidth={1.5} />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Micro-LED de Hardware (Indicador de Status) */}
                <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-step-identity border-4 border-white shadow-sm" />
            </motion.div>

            {/* --- TIPOGRAFIA DE PROTOCOLO --- */}
            <div className="text-center">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={isLoginMode ? 'title-login' : 'title-reg'}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -5, opacity: 0 }}
                        className="text-step-identity font-black text-2xl tracking-tighter uppercase"
                    >
                        {isLoginMode ? "Acesso_Vault" : "Vínculo_Sinal"}
                    </motion.h2>
                </AnimatePresence>
                
                <p className="text-slate-400 text-[8px] font-black tracking-[0.4em] uppercase mt-3 opacity-60 italic">
                    Sincronia_Omega_v.4.26
                </p>
            </div>
        </header>
    );
};