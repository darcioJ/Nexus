import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

// --- Módulos Nexus ---
import { api } from '../api';
import { triggerHaptic } from '../utils/triggerHaptic';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

// --- Componentes Refatorados ---
import { AuthBackground } from './Auth/components/AuthBackground';
import { AuthHeader } from './Auth/components/AuthHeader';
import { AuthTelemetry } from './Auth/components/AuthTelemetry';
import { LoginForm } from './Auth/LoginForm';
import { RegisterForm } from './Auth/RegisterForm';
import { AuthSuccess } from './Auth/AuthSuccess';

export const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { notifyError, notifySuccess } = useNotification();

    // --- RECUPERAÇÃO DE SINAL ---
    const charId = localStorage.getItem("@Nexus:PendingCharId");
    const charName = localStorage.getItem("@Nexus:PendingCharName") || "OPERADOR_ANONIMO";

    // --- ESTADOS ---
    const [isLoginMode, setIsLoginMode] = useState(!charId);
    const [isActivating, setIsActivating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

    // --- LÓGICA: GERAÇÃO DE ID ---
    const generatedEmail = useMemo(() => {
        const prefix = charName.trim().split(/\s+/)[0].normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        return `${prefix}@nexus.com`;
    }, [charName]);

    // --- TELEMETRIA: CLEAN BOOT ---
    useEffect(() => {
        const coreLogs = [
            `Sinal_Detectado: ${charName}`,
            "Interface: PRISMA_CERAMIC_V4",
            isLoginMode ? "Status: Modo_Acesso_Cofre" : "Status: Modo_Vinculo_Novo",
            "Criptografia: RSA_4096_OMEGA",
            "Hardware: Neural_Link_Stable"
        ];

        setTerminalLogs(["> Inicializando_Protocolo_Nexus..."]);
        coreLogs.forEach((log, i) => {
            setTimeout(() => {
                setTerminalLogs(prev => [...prev.slice(-4), `> ${log}`]);
            }, i * 300);
        });
    }, [isLoginMode, charName]);

    // --- HANDLER: LOGIN ---
    const handleLogin = async ({ email, pass }: { email: string; pass: string }) => {
        setIsActivating(true);
        triggerHaptic('MEDIUM');
        try {
            const response = await api.post("/auth/login", { email, password: pass });
            executeSuccessProtocol(response.data);
        } catch (error: any) {
            notifyError(error, "As credenciais não coincidem com o Vault.");
        } finally {
            setIsActivating(false);
        }
    };

    // --- HANDLER: REGISTRO (VÍNCULO) ---
    const handleRegister = async (password: string) => {
        setIsActivating(true);
        triggerHaptic('MEDIUM');
        try {
            const response = await api.post("/auth/finalize", {
                characterId: charId,
                name: charName,
                password
            });
            executeSuccessProtocol(response.data);
        } catch (error) {
            notifyError(error, "Erro ao imortalizar sinal no banco de dados.");
        } finally {
            setIsActivating(false);
        }
    };

    // --- PROTOCOLO DE SUCESSO ---
    const executeSuccessProtocol = (data: any) => {
        login({ token: data.token, user: data.user });
        localStorage.removeItem("@Nexus:PendingCharId");
        localStorage.removeItem("@Nexus:PendingCharName");

        setShowSuccess(true);
        triggerHaptic('SUCCESS');

        setTimeout(() => navigate('/dashboard', { replace: true }), 2200);
    };

    return (
        <div className="fixed inset-0 h-dvh w-full flex items-center justify-center p-5 overflow-hidden">
            <AuthBackground />
            <AuthTelemetry logs={terminalLogs} />

            {/* BOTÃO VOLTAR */}
            <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-50 text-slate-400 hover:text-slate-900 transition-all shadow-sm z-50 group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform text-step-identity" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Voltar</span>
            </motion.button>

            <AnimatePresence mode="wait">
                {!showSuccess ? (
                    <motion.div
                        key="auth-card"
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                        className="relative z-30 w-full max-w-110"
                    >
                        <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] p-8 sm:p-12 relative overflow-hidden">
                            <AuthHeader isLoginMode={isLoginMode} />

                            <AnimatePresence mode="wait">
                                {isLoginMode ? (
                                    <LoginForm key="login" onSubmit={handleLogin} isLoading={isActivating} />
                                ) : (
                                    <RegisterForm
                                        key="register"
                                        charName={charName}
                                        generatedEmail={generatedEmail}
                                        onSubmit={handleRegister}
                                        isLoading={isActivating}
                                    />
                                )}
                            </AnimatePresence>

                            {/* TOGGLE MODO */}
                            {charId && (
                                <button
                                    onClick={() => { setIsLoginMode(!isLoginMode); triggerHaptic('LIGHT'); }}
                                    className="w-full text-center text-[9px] text-slate-400 hover:text-step-identity transition-all uppercase font-black tracking-[0.3em] mt-8"
                                >
                                    {isLoginMode ? "— Criar Novo Protocolo —" : "— Já possuo uma Chave —"}
                                </button>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <AuthSuccess />
                )}
            </AnimatePresence>
        </div>
    );
};