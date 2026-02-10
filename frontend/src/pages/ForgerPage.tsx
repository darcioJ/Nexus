import { useState, useEffect, useRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Metadata de UI (Permanece no cliente)
import { STEPS_DATA } from '../config/steps.config';

// Componentes de Step
import { StepIdentity } from '../components/steps/StepIdentity';
import { StepBackground } from '../components/steps/StepBackground';
import { StepAttributes } from '../components/steps/StepAttributes';
import { StepWeapons } from '../components/steps/StepWeapons';
import { StepReview } from '../components/steps/StepReview';

// Componentes Compartilhados
import { DossierHeader } from '../components/shared/DossierHeader';
import { DossierFooter } from '../components/shared/DossierFooter';
import { DossierAtmosphere } from '../components/shared/DossierAtmosphere';
import { ImageCropperModal } from '../components/common/ImageCropperModal';

// Contexto e Hooks
import { useVault } from '../hooks/useVault';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { useForger } from '../hooks/useForger';
import { useNotification } from '../hooks/useNotification';
import { api } from "../api";

// Utils
import { triggerHaptic } from '../utils/triggerHaptic';

/**
 * CONTEÚDO LÓGICO DA PÁGINA
 */


export function ForgerPage() {
    const navigate = useNavigate();
    const { vault, isLoading: vaultLoading } = useVault();

    // Consumindo tudo do nosso novo Cérebro (Provider)
    const {
        methods,
        step,
        nextStep,
        prevStep,
        hasError,
        setHasError,
        canProceed,
        isLastStep,
        isCropperOpen,
        tempImageSrc,
        closeCropper,
        processCroppedImage
    } = useForger();

    const { notifyError } = useNotification();

    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const mainRef = useRef<HTMLElement>(null);

    // Sincronizar Scroll
    useEffect(() => {
        mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    useEffect(() => {
        return scrollY.on("change", (latest) => setIsScrolled(latest > 30));
    }, [scrollY]);

    // Debug Tools (Apenas Dev)
    useEffect(() => {
        if (import.meta.env.DEV) {
            (window).nexus = {
                methods,
                vault,
                // AGORA DISPARA A NOTIFICAÇÃO TAMBÉM:
                triggerError: () => {
                    setHasError(true);
                    notifyError("Debug_Alert", "Teste manual de inconsistência de sinal.")
                }
            };
        }
    }, [methods, vault, setHasError, notifyError]);

    const getErrorMessage = () => {
        const { errors } = methods.formState;
        switch (step) {
            case 0:
                if (errors.identity?.name) return "Protocolo Nominal incompleto. Identifique-se para o Nexus.";
                if (errors.identity?.age) return "Frequência Etária fora dos parâmetros permitidos.";
                break;
            case 1:
                if (errors.background?.club) return "Clube não detectado. Selecione um Clube.";
                if (errors.background?.archetype) return "Arsenal inicial não definido.";
                break;
            case 2:
                if (!canProceed) return "Sincronia Energética insuficiente. Aloque 30 pontos NX.";
                break;
            case 3:
                if (errors.weapons?.primary) return "Vínculo de combate não estabelecido.";
                break;
            default:
                return "Inconsistência de dados detectada.";
        }
    };

    const handleNextOrFinish = async () => {
        // 1. VALIDAÇÃO DE FLUXO: Se o usuário não puder prosseguir, avisamos agora.
        if (!canProceed) {
            setHasError(true); // Mantemos para a animação de "shake" no formulário
            triggerHaptic('HEAVY');

            notifyError("Sincronia Interrompida", getErrorMessage() || "Dados insuficientes para avançar.");
            return;
        }

        // 2. LÓGICA DE FINALIZAÇÃO (ÚLTIMO STEP)
        if (isLastStep) {
            setIsSyncing(true);
            setHasError(false);
            triggerHaptic('MEDIUM');

            try {
                const characterData = methods.getValues();
                const response = await api.post("/characters", characterData);

                const { _id } = response.data.character;
                const { name } = characterData.identity;

                triggerHaptic('SUCCESS');

                localStorage.setItem("@Nexus:PendingCharId", _id);
                localStorage.setItem("@Nexus:PendingCharName", name);
                localStorage.removeItem("nexus_character");

                setTimeout(() => {
                    navigate('/auth', { replace: true });
                }, 2500);

            } catch (error) {
                console.error("❌ Erro de Sincronia:", error);
                setIsSyncing(false);
                setHasError(true);

                // USO DO HELPER: Ele já extrai a mensagem do erro do seu backend
                notifyError(error, "Falha na Imortalização");
            }
        } else {
            // 3. AVANÇO DE STEP COMUM
            setHasError(false); // Limpa o erro ao avançar
            nextStep();
        }
    };

    if (vaultLoading) return <LoadingScreen message="Establishing_Vault_Connection..." />;

    return (
        <div className="h-dvh flex items-center justify-center p-0 md:p-8 overflow-hidden relative antialiased selection:bg-blue-500/30">

            <DossierAtmosphere step={step} accentColor={STEPS_DATA[step].color} opacity={0.2} />

            <AnimatePresence>
                {isCropperOpen && tempImageSrc && (
                    <ImageCropperModal
                        imageSrc={tempImageSrc}
                        onCancel={closeCropper}
                        onComplete={processCroppedImage}
                    />
                )}
            </AnimatePresence>

            {/* OVERLAY DE SINCRONIA FINAL - VERSÃO NEXUS */}
            <AnimatePresence>
                {isSyncing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/60 backdrop-blur-3xl flex flex-col items-center justify-center"
                    >
                        <div className="relative">
                            {/* Anéis de Pulso */}
                            <div className="absolute inset-0 -m-4 border border-blue-500/20 rounded-full animate-ping" />
                            <div className="absolute inset-0 -m-8 border border-blue-500/10 rounded-full animate-ping [animation-delay:500ms]" />

                            <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border border-slate-100">
                                <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
                                <div className="text-center">
                                    <h3 className="text-slate-900 font-black uppercase tracking-tighter text-xl">Imortalizando Sinal</h3>
                                    <p className="text-[8px] font-mono font-black uppercase tracking-[0.4em] text-slate-400 mt-2">
                                        Salvando_Dados_No_Vault...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`
                w-full max-w-7xl h-dvh md:h-[92vh] z-10 
                flex flex-col relative overflow-hidden transition-all duration-1000
                bg-white/10 backdrop-blur-[10px] 
                md:rounded-[3.5rem] md:border-2 border-white/60
                shadow-[0_40px_100px_-20px_rgba(15,23,42,0.1)]
                ${isSyncing ? 'scale-95 opacity-0 blur-2xl' : 'scale-100 opacity-100'}
            `}>

                <DossierHeader step={step} isScrolled={isScrolled} steps={STEPS_DATA} />

                <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                    <motion.div
                        animate={hasError ? { x: [-2, 2, -2, 2, 0] } : { x: 0 }}
                        className="relative z-10 p-3 pb-28 md:pb-36 max-w-5xl mx-auto"
                    >
                        <FormProvider {...methods}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="w-full"
                                >
                                    {step === 0 && <StepIdentity />}
                                    {step === 1 && <StepBackground />}
                                    {step === 2 && <StepAttributes />}
                                    {step === 3 && <StepWeapons />}
                                    {step === 4 && <StepReview />}
                                </motion.div>
                            </AnimatePresence>
                        </FormProvider>
                    </motion.div>
                </main>

                <DossierFooter
                    step={step}
                    nextStep={handleNextOrFinish}
                    prevStep={prevStep}
                    steps={STEPS_DATA}
                    canProceed={canProceed}
                />

                <div className="absolute bottom-1 right-8 hidden md:block opacity-10 select-none">
                    <span className="text-[6px] font-mono font-bold text-slate-900 tracking-[0.5em] uppercase">
                        Protocol_Status: DB_CONNECTED
                    </span>
                </div>
            </div>
        </div>
    );
}