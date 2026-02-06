import { motion } from 'framer-motion';

export const AuthBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fdfdfd]">
            
            {/* --- CAMADA 1: ORBS DE REFRAÇÃO DINÂMICA (NEXUS ENERGY) --- */}
            <motion.div
                animate={{ 
                    x: [0, 40, 0], 
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[15%] -left-[10%] w-[80%] h-[60%] rounded-full blur-[140px] opacity-20 bg-step-identity-soft"
            />
            
            <motion.div
                animate={{ 
                    x: [0, -40, 0], 
                    y: [0, -30, 0],
                    scale: [1.1, 1, 1.1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[50%] rounded-full blur-[120px] opacity-15 bg-step-identity-soft"
            />

            {/* --- CAMADA 2: TEXTURA DE HARDWARE (MICRO-GRID) --- */}
            {/* Um grid quase invisível para dar sensação de interface técnica */}
            <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(90deg,var(--color-step-identity)_1px,transparent_1px),linear-gradient(0deg,var(--color-step-identity)_1px,transparent_1px)] bg-size-[40px_40px]" />

            {/* --- CAMADA 3: VINHETA DE LUZ (CENTRALIZADA) --- */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#fdfdfd_80%)]" />

            {/* --- DETALHES DE BORDA (REFRAÇÃO DE VIDRO) --- */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-step-identity/10 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-step-identity/10 to-transparent" />
        </div>
    );
};