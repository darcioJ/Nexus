import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../../utils/triggerHaptic';

interface LoginFormProps {
    onSubmit: (data: { email: string; pass: string }) => void;
    isLoading: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password.length >= 4) {
            onSubmit({ email, pass: password });
        }
    };

    return (
        <motion.form 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleFormSubmit} 
            className="space-y-6 w-full"
        >
            {/* --- CAMPO: IDENTIFICADOR (EMAIL) --- */}
            <div className="space-y-2">
                <label className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                    <Mail size={12} className="text-step-identity" /> ID_De_Acesso
                </label>
                <input
                    type="email"
                    required
                    placeholder="operativo@nexus.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-100 p-5 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-step-identity outline-none transition-all shadow-inner font-semibold placeholder:text-slate-300"
                />
            </div>

            {/* --- CAMPO: CHAVE MESTRA (PASSWORD) --- */}
            <div className="space-y-2">
                <label className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                    <Lock size={12} className="text-step-identity" /> Chave_Mestra
                </label>
                <div className="relative group/pass">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 p-5 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-step-identity outline-none transition-all shadow-inner font-mono pr-14"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setShowPassword(!showPassword);
                            triggerHaptic('LIGHT');
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-step-identity transition-all duration-300 flex items-center justify-center"
                    >
                        {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeOff size={18} strokeWidth={1.5} />}
                    </button>
                </div>
            </div>

            {/* --- REATOR DE ACESSO (SUBMIT) --- */}
            <div className="pt-4">
                <motion.button
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || !email || password.length < 4}
                    className="w-full py-6 bg-white border border-slate-100 text-slate-900 font-black rounded-[2.5rem] flex items-center justify-center gap-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_var(--color-step-identity-soft)] disabled:opacity-40 transition-all group relative overflow-hidden"
                >
                    <div className="absolute inset-y-0 left-0 w-1.5 bg-step-identity opacity-70 group-hover:opacity-100 transition-opacity" />
                    
                    <span className="relative z-10 tracking-[0.5em] uppercase text-[10px] ml-2">
                        {isLoading ? "Validando_Sinal" : "Acessar_Vault"}
                    </span>

                    <div className="relative z-10 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-step-identity" />
                    </div>
                </motion.button>
            </div>
        </motion.form>
    );
};