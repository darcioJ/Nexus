import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace } from 'lucide-react';

export const IdentityInput = ({ register, error, value, label, placeholder, maxLength = 20 }) => {
    const hasContent = value.length > 0;
    const progress = Math.min((value.length / maxLength) * 100, 100);

    return (
        <div className={`
      relative p-5 md:p-7 rounded-[2.5rem] transition-all duration-700 border-2
      backdrop-blur-3xl overflow-hidden
      ${error
                ? 'bg-red-50/50 border-red-200'
                : 'bg-white/60 border-white shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05),inset_0_0_25px_white/50%]'
            }
      focus-within:bg-white/80 focus-within:border-step-identity/20 
      focus-within:shadow-[0_20px_50px_-15px_step-identity/20%,inset_0_0_20px_white]
    `}>

            <div className="relative z-10">
                {/* Cabeçalho do Módulo */}
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${error ? 'bg-red-500' : 'bg-step-identity'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${error ? 'bg-red-500' : 'bg-step-identity'}`}></span>
                        </div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">
                            {label}
                        </label>
                    </div>

                    <div className={`p-2 rounded-xl border-2 transition-all duration-500 ${hasContent ? 'bg-step-identity/10 border-step-identity-soft/50 text-step-identity scale-110' : 'bg-white/20 border-slate-100 text-slate-200'}`}>
                        <ScanFace size={16} strokeWidth={2.5} />
                    </div>
                </div>

                <textarea
                    {...register}
                    placeholder={placeholder}
                    rows={2}
                    className="w-full bg-transparent outline-none font-black text-slate-900 
            text-2xl md:text-3xl tracking-tighter uppercase 
            placeholder:text-slate-300 resize-none 
            leading-tight pt-1
            caret-step-identity transition-all"
                />

                {/* Barra de Progresso (Fibra de Dados) */}
                <div className="mt-6 flex items-center gap-4">
                    <div className="h-2 flex-1 bg-slate-100/30 rounded-full overflow-hidden p-[1.5px] border border-white/20 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{
                                /* O SEGREDO: Curva de aceleração negativa (Rápido -> Devagar) */
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className={`
                h-full rounded-full relative transition-colors duration-300
                ${error
                                    ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]'
                                    : 'bg-linear-to-r from-step-identity-soft to-step-identity shadow-[0_0_12px_var(--color-step-identity)]'
                                }
            `}
                        >
                            {/* Núcleo de Fótons: Linha de brilho interna para efeito 3D */}
                            <div className="absolute top-0 left-0 w-full h-px bg-white/40" />
                        </motion.div>
                    </div>

                    {/* Contador de Caracteres */}
                    <div className="flex flex-col items-end min-w-8">
                        <span className={`text-[8px] font-mono font-black tracking-widest transition-colors duration-300 ${error ? 'text-red-400' : 'text-slate-300'}`}>
                            {value.length.toString().padStart(2, '0')}/{maxLength}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mensagem de Erro */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="absolute bottom-3 left-7 flex items-center gap-2 text-red-500">
                        <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest italic">{error.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const MetadataChip = ({ icon: Icon, label, value, status, isLongValue }) => (
    <div className="group relative p-4 md:p-5 
    bg-white/60 backdrop-blur-2xl 
    border-2 border-white 
    rounded-[2.2rem] 
    transition-all duration-500 
    hover:scale-[1.02]
    shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05),inset_0_0_25px_rgba(255,255,255,0.5)] 
    hover:shadow-[0_20px_40px_-20px_var(--color-step-identity),inset_0_0_20px_white]
    overflow-hidden cursor-default"
    >

        {/* 1. LIGHT LEAK (T4: bg-var/opacidade) */}
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-step-identity/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* 2. OVERLAY DE HARDWARE */}
        <div className="absolute -top-3 -right-3 opacity-5 rotate-12 transition-all duration-700 group-hover:rotate-25 group-hover:scale-125 pointer-events-none group-hover:opacity-10">
            <Icon size={80} className="text-step-identity" />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
            {/* 3. NÚCLEO DO ÍCONE (Efeito Cristal) */}
            <div className="w-10 h-10 rounded-2xl 
        bg-white border border-white shadow-sm
        flex items-center justify-center 
        text-step-identity transition-all duration-500
        group-hover:shadow-[0_0_20px_var(--color-step-identity-soft)]
        group-hover:scale-110 group-hover:-rotate-3"
            >
                <Icon size={20} strokeWidth={2.5} />
            </div>

            <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {label}
                    </span>
                    <div className="h-[0.5px] flex-1 bg-slate-200/50" />
                </div>

                <span className={`
          font-black text-slate-900 font-mono tracking-tighter leading-none
          ${isLongValue ? 'text-[10px] md:text-[11px] truncate' : 'text-[13px] md:text-base italic'}
        `}>
                    {value}
                </span>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                    <div className="flex items-center gap-1.5">
                        <div className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-step-identity opacity-40"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-step-identity"></span>
                        </div>
                        <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">
                            {status}
                        </span>
                    </div>
                    <span className="text-[5px] font-mono text-slate-300">NX-SYS-VER.01</span>
                </div>
            </div>
        </div>
    </div>
);