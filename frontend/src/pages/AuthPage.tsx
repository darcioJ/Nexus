import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Cpu, ArrowRight, Lock, Mail,
    Terminal, Fingerprint,
    ChevronLeft, Zap, Eye, EyeOff
} from 'lucide-react';
import { api } from '../api';
import { triggerHaptic } from '../utils/triggerHaptic';
import { useAuth } from '../hooks/useAuth';

/**
 * AUTH PAGE: PROTOCOLO DE IDENTIFICAÇÃO NEXUS [V4.0 - MOBILE FIRST]
 * Estética: Prisma Nexus (Cerâmica Ultra-Branca, Refração Dinâmica, Glassmorphism)
 * Cores: Uso estrito de var(--color-step-identity) e White.
 */
export const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    // --- PROTOCOLOS DE RECUPERAÇÃO DE SINAL ---
    const charId = localStorage.getItem("@Nexus:PendingCharId");
    const charName = localStorage.getItem("@Nexus:PendingCharName") || "OPERADOR_ANONIMO";

    // Geração de e-mail baseada na identidade forjada
    const generatedEmail = useMemo(() => {
        if (!charName) return "guest@nexus.com";

        const emailPrefix = charName
            .trim()
            .split(/\s+/)[0]
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
        return `${emailPrefix}@nexus.com`;
    }, [charName]);

    // --- ESTADOS DE SISTEMA E TELEMETRIA ---
    const [password, setPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [isActivating, setIsActivating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(!charId);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

    // --- LOGIC: TERMINAL DE TELEMETRIA (CLEAN BOOT) ---
    useEffect(() => {
        setTerminalLogs(["> Inicializando_Protocolo_Nexus..."]);
        const coreLogs = [
            `Sinal_Detectado: ${charName}`,
            "Interface: PRISMA_CERAMIC_V4",
            "Criptografia: RSA_4096_OMEGA",
            isLoginMode ? "Status: Modo_Acesso_Cofre" : "Status: Modo_Vinculo_Novo",
            "Hardware: Neural_Link_Stable"
        ];

        const timeoutIds = coreLogs.map((log, i) =>
            setTimeout(() => {
                setTerminalLogs(prev => [...prev.slice(-4), `> ${log}`]);
            }, i * 300)
        );

        return () => timeoutIds.forEach(id => clearTimeout(id));
    }, [isLoginMode, charName]);

    // --- HANDLER: SUBMISSÃO TÁTICA ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActivating(true);
        triggerHaptic('MEDIUM');

        try {
            let response;
            if (isLoginMode) {
                response = await api.post("/auth/login", { email: loginEmail, password });
            } else {
                response = await api.post("/auth/finalize", {
                    characterId: charId,
                    name: charName,
                    password
                });
            }

            login({
                token: response.data.token,
                user: response.data.user
            });

            // Remova apenas os itens temporários
            localStorage.removeItem("@Nexus:PendingCharId");
            localStorage.removeItem("@Nexus:PendingCharName");

            setShowSuccess(true);
            triggerHaptic('SUCCESS');

            setTimeout(() => navigate('/dashboard', { replace: true }), 2200);

            // Transição suave para o Dashboard após imortalização
            setTimeout(() => navigate('/dashboard', { replace: true }), 2200);
        } catch (error) {
            console.error(error);
            triggerHaptic('HEAVY');
            alert("⚠️ Erro de Autenticação: Sinal não reconhecido pelo Vault.");
        } finally {
            setIsActivating(false);
        }
    };

    return (
        <div className="fixed inset-0 h-dvh w-full bg-[#fdfdfd] flex items-center justify-center p-5 overflow-hidden selection:bg-step-identity/20">

            {/* --- CAMADA 1: ORBS DE REFRAÇÃO DINÂMICA --- */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[70%] h-[50%] rounded-full blur-[120px] opacity-20 bg-step-identity-soft"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[40%] rounded-full blur-[100px] opacity-15 bg-step-identity-soft"
                />
            </div>

            {/* --- CAMADA 2: TELEMETRIA HUD (SUTIL E FIXA) --- */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-8 left-8 hidden 2xl:block z-40"
            >
                <div className="bg-white/40 backdrop-blur-xl border border-white p-5 rounded-4xl w-72 shadow-sm">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                        <span className="text-[9px] font-black text-slate-900 tracking-widest uppercase flex items-center gap-2">
                            <Terminal size={12} className="text-step-identity" /> Terminal_Console
                        </span>
                        <Zap size={10} className="text-step-identity animate-pulse" />
                    </div>
                    <div className="space-y-1.5 font-mono">
                        {terminalLogs.map((log, i) => (
                            <div key={i} className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter flex gap-2">
                                <span className="text-step-identity/40">[{i}]</span> {log}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* --- CAMADA 3: O CARD CERÂMICO CENTRALIZADO --- */}
            <AnimatePresence mode="wait">
                {!showSuccess ? (
                    <motion.div
                        key="auth-card"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                        className="relative z-30 w-full max-w-110" // Reduzi para 440px para um look mais "slim"
                    >
                        {/* Efeito de Vidro Cerâmico */}
                        <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] p-8 sm:p-12 relative overflow-hidden">

                            {/* Linha de Refração Superior */}
                            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-step-identity/30 to-transparent" />

                            {/* HEADER DO MÓDULO */}
                            <header className="flex flex-col items-center mb-10">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-20 h-20 rounded-[2.2rem] bg-white border border-slate-50 shadow-sm flex items-center justify-center mb-5 relative"
                                >
                                    {isLoginMode ?
                                        <Cpu className="text-step-identity relative z-10" size={34} strokeWidth={1.5} /> :
                                        <Fingerprint className="text-step-identity relative z-10" size={34} strokeWidth={1.5} />
                                    }
                                    <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-step-identity border-4 border-white shadow-sm" />
                                </motion.div>

                                <h2 className="text-step-identity font-black text-2xl tracking-tighter uppercase">
                                    {isLoginMode ? "Acesso ao Nexus" : "Registro ao Nexus"}
                                </h2>
                                <p className="text-slate-400 text-[8px] font-black tracking-[0.4em] uppercase mt-3 opacity-60 italic">
                                    Sincronia_Omega_v.4
                                </p>
                            </header>

                            {/* FORMULÁRIO */}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                        <Mail size={12} className="text-step-identity" /> ID
                                    </label>
                                    {isLoginMode ? (
                                        <input
                                            type="email"
                                            required
                                            placeholder="nome@nexus.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            className="w-full bg-slate-50/50 border border-slate-100 p-5 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-step-identity outline-none transition-all shadow-inner font-semibold placeholder:text-slate-300"
                                        />
                                    ) : (
                                        <div className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-inner">
                                            <span className="text-step-identity text-xs font-black italic truncate pr-4">{generatedEmail}</span>
                                            <div className="px-2 py-0.5 bg-step-identity/10 rounded-md text-[7px] font-black text-step-identity uppercase border border-step-identity/10">Sinal_OK</div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
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
                                            <div>
                                                {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeOff size={18} strokeWidth={1.5} />}
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <motion.button
                                        whileHover={{ y: -2, scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isActivating || (isLoginMode && !loginEmail) || password.length < 4}
                                        className="w-full py-7 bg-white border border-slate-100 text-slate-900 font-black rounded-[2.5rem] flex items-center justify-center gap-4 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_-15px_var(--color-step-identity-soft)] disabled:opacity-40 transition-all group relative overflow-hidden"
                                    >
                                        {/* Camada de Refração Dinâmica (Borda Interna de Cor) */}
                                        <div className="absolute inset-y-0 left-0 w-1.5 bg-step-identity opacity-70 group-hover:opacity-100 transition-opacity" />

                                        {/* Brilho de Vidro (Varredura Linear) */}
                                        <div className="absolute inset-0 bg-linear-to-r from-step-identity/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                        <span className="relative z-10 tracking-[0.5em] uppercase text-[10px] ml-2">
                                            {isActivating ? "Sincronizando" : "Acessar Sistema"}
                                        </span>

                                        <div className="relative z-10 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-step-identity" />
                                        </div>
                                    </motion.button>
                                </div>

                                {charId && (
                                    <motion.button
                                        type="button"
                                        whileHover={{ opacity: 1 }}
                                        onClick={() => {
                                            setIsLoginMode(!isLoginMode);
                                            triggerHaptic('LIGHT');
                                        }}
                                        className="w-full flex items-center justify-center gap-6 text-[9px] text-slate-400 hover:text-step-identity transition-all uppercase font-black tracking-[0.3em] pt-6 group"
                                    >
                                        <div className="h-px flex-1 bg-slate-100 group-hover:bg-step-identity-soft transition-colors" />
                                        <span className="whitespace-nowrap flex items-center gap-2">
                                            <Zap size={10} className="group-hover:animate-pulse" />
                                            {isLoginMode ? "Novo Protocolo" : "Sinal Conhecido"}
                                        </span>
                                        <div className="h-px flex-1 bg-slate-100 group-hover:bg-step-identity-soft transition-colors" />
                                    </motion.button>
                                )}
                            </form>
                        </div>
                    </motion.div>
                ) : (
                    /* --- SUCESSO --- */
                    <motion.div
                        key="success-nexus"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-8 z-40"
                    >
                        <div className="w-32 h-32 rounded-[3rem] bg-white shadow-xl border border-slate-50 flex items-center justify-center relative">
                            <ShieldCheck className="text-step-identity" size={60} strokeWidth={1} />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-slate-950 font-black text-2xl tracking-tighter uppercase">Sinal_Estabilizado</h1>
                            <p className="text-step-identity text-[9px] font-black tracking-[0.5em] uppercase animate-pulse">Entrando no Vault</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BOTÃO VOLTAR */}
            <motion.button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-50 text-slate-400 hover:text-slate-900 transition-all shadow-sm z-50 group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform text-step-identity" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Voltar</span>
            </motion.button>
        </div>
    );
};