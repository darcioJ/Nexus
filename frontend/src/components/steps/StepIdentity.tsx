import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, QrCode, UserCircle2,
    CalendarDays, Barcode, History, AlertCircle, Zap, Upload
} from 'lucide-react';
import type { CharacterData } from '../../models/character';

import { HeaderStep } from '../shared/HeaderStep';
import { getSchoolGrade } from '../../utils/getSchoolGrade';
import { IdentityInput, MetadataChip } from './StepIdentity/IdentityInput';

import { useForger } from '../../hooks/useForger';


export const StepIdentity = () => {
    const { register, watch, setValue, formState: { errors } } = useFormContext<CharacterData>();
    const selectedAge = watch('identity.age') || 14;
    const nameValue = watch('identity.name') || "";

    // 1. Pegamos a função de upload do nosso Contexto
    const { handleAvatarChange } = useForger();

    // 2. Monitoramos o campo do avatar para mostrar a preview
    const avatarPreview = watch('identity.avatar');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [birthDate, setBirthDate] = React.useState({ day: '15', month: '05' });

    const birthYear = 2026 - selectedAge;
    const serialNumber = `NX-${birthYear}-${(nameValue.length * 137).toString().padStart(4, '0')}`;
    const schoolGrade = getSchoolGrade(selectedAge);

    React.useEffect(() => {
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const randomMonth = Math.floor(Math.random() * 12) + 1;
        setBirthDate({
            day: randomDay.toString().padStart(2, '0'),
            month: randomMonth.toString().padStart(2, '0')
        });
    }, [selectedAge]);

    return (
        <div className="w-full mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

            <HeaderStep
                icon="Fingerprint"
                label="Módulo 1"
                title="Dossiê de"
                highlight="Identidade"
                description="Aguardando entrada de dados biométricos..."
                accentColor="var(--color-step-identity)"
                secondaryColor="var(--color-step-identity-soft)"
            />

            {/* --- CARTÃO DE IDENTIDADE INTERATIVO (NEXUS CRYSTAL ID) --- */}
            <div className="relative">
                <div
                    className="relative overflow-hidden bg-step-identity/10 backdrop-blur-2xl border-[3px] border-step-identity/10 rounded-[2.5rem] md:rounded-[3.5rem] p-5 md:p-8 shadow-[0_30px_60px_-15px_var(--color-step-identity)]/30 group"
                >
                    {/* 1. TEXTURA DE SEGURANÇA (MICRO-GRID ESMERALDA) */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(90deg,#059669_1px,transparent_1px),linear-gradient(0deg,#059669_1px,transparent_1px)] bg-size-[32px:32px]" />

                    {/* 3. MARCA D'ÁGUA CENTRAL (ESCUDO CRISTALINO) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                        <Shield size={380} strokeWidth={0.5} className="text-step-identity" />
                    </div>

                    {/* --- HEADER: NEXUS HUD CRYSTAL (MOBILE OPTIMIZED) --- */}
                    <div className="relative z-20 flex items-center justify-between gap-2 md:gap-3 mb-6 md:mb-8 px-0.5">
                        <div className="flex items-center gap-2.5 md:gap-4">

                            {/* NÚCLEO BIOMÉTRICO (Escalado para Mobile) */}
                            <div className="relative shrink-0">
                                {/* Glow de fundo mais contido no mobile */}
                                <div className="absolute inset-0 bg-step-identity/15 blur-lg rounded-2xl animate-pulse" />

                                <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-step-identity-soft rounded-2xl flex items-center justify-center shadow-sm overflow-hidden">
                                    <div className="absolute inset-0 bg-linear-to-tr from-step-identity-soft to-transparent" />
                                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-step-identity relative z-20 drop-shadow-sm" strokeWidth={2.5} />

                                    {/* Micro-LED de Hardware */}
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-step-identity rounded-full border border-white animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
                                </div>
                            </div>

                            {/* INFO CLUSTER: Espaçamento reduzido */}
                            <div className="flex flex-col gap-0.5 md:gap-1">
                                <div className="flex items-center gap-1.5">
                                    <h2 className="text-[9px] md:text-[12px] font-black text-step-identity uppercase tracking-[0.15em] md:tracking-[0.2em] leading-none">
                                        Nexus_Core
                                    </h2>
                                    <span className="text-[6px] md:text-[7px] font-mono font-black text-step-identity px-1 md:px-1.5 py-0.5 bg-step-identity-soft border border-step-identity-soft rounded-md leading-none">
                                        V.4
                                    </span>
                                </div>

                                {/* Status Pills: Mais compactas no mobile */}
                                <div className="flex items-center gap-1.5 md:gap-2 font-mono">
                                    <div className="flex items-center gap-1 bg-white border border-step-identity-soft px-2 md:px-2.5 py-0.5 rounded-full shadow-sm">
                                        <span className="w-1 h-1 rounded-full bg-step-identity animate-pulse" />
                                        <span className="text-[6px] md:text-[7px] font-black text-step-identity uppercase">Live</span>
                                    </div>

                                    <div className="h-2 w-px-step-identity-soft/50" />

                                    <span className="text-[7px] md:text-[8px] text-step-identity/50 font-bold uppercase tracking-tight md:tracking-widest truncate max-w-15 md:max-w-none">
                                        <span className="opacity-40">ID:</span> {serialNumber.split('-')[2]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* MÓDULO QR (Escala Proporcional) */}
                        <div className="relative shrink-0 group">
                            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-step-identity" />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-step-identity" />

                            <div className="bg-white p-1 md:p-1.5 rounded-xl border border-step-identity-soft shadow-sm relative overflow-hidden active:scale-95 transition-transform">
                                <QrCode className="w-5.5 h-5.5 md:w-6.5 md:h-6.5 text-step-identity" strokeWidth={2} />

                                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-step-identity-soft/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </div>
                    </div>

                    {/* Adicionado um detalhe inferior de "Hardware Line" para equilíbrio visual */}
                    <div className="relative z-20 flex justify-between items-center mt-4 opacity-20">
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-4 h-px bg-step-identity" />
                            ))}
                        </div>
                        <span className="text-[5px] font-mono font-black text-step-identity uppercase tracking-widest">Doc_Registry_NX_026</span>
                    </div>


                    <div className="relative z-10 space-y-8 px-1">
                        {/* --- ÁREA BIOMÉTRICA E NOME: INTEGRADOS --- */}
                        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                            {/* MÓDULO FOTO-VITAL (LADO ESQUERDO) */}
                            <div className="flex flex-col items-center gap-5 shrink-0 group/photo">
                                <div className="relative">
                                    <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-step-identity rounded-tl-lg z-30" />
                                    <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-step-identity rounded-br-lg z-30" />

                                    {/* Input Escondido */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />

                                    {/* Moldura da Foto Interativa */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative w-40 h-52 md:w-44 md:h-56 grid place-items-center bg-step-identity-soft rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl transition-all duration-500 hover:scale-[1.02] active:scale-95 group/btn"
                                    >
                                        {avatarPreview ? (
                                            <>
                                                <img
                                                    src={avatarPreview}
                                                    className="w-full h-full object-cover"
                                                    alt="Biometria"
                                                />
                                                {/* Overlay de Varredura */}
                                                <div className="absolute inset-0 bg-linear-to-t from-step-identity/40 to-transparent" />
                                                <motion.div
                                                    animate={{ y: [-20, 220, -20] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-x-0 h-0.5 bg-white/60 z-10 shadow-[0_0_10px_white]"
                                                />
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <UserCircle2 size={80} strokeWidth={0.5} className="text-step-identity/40" />
                                                <span className="text-[7px] font-black uppercase tracking-widest text-step-identity">Capturar_Sinal</span>
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute rounded-3xl inset-0 bg-step-identity/20 opacity-0 group-hover/btn:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <Upload className="text-white animate-pulse" size={24} />
                                        </div>
                                    </button>
                                </div>

                                {/* Botão de Reset (Opcional) */}
                                {avatarPreview && (
                                    <button
                                        onClick={() => setValue('identity.avatar', '')}
                                        className="text-[7px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                                    >
                                        [ Excluir_Registro ]
                                    </button>
                                )}
                            </div>

                            {/* TERMINAL DE DADOS NOMINAIS (LADO DIREITO) */}
                            <div className="flex-1 flex flex-col gap-5 w-full">

                                <IdentityInput
                                    label="Cidadão_Nexus_ID"
                                    placeholder="IDENTIFIQUE-SE..."
                                    // ADICIONE AS REGRAS AQUI:
                                    register={register('identity.name', {
                                        required: "Identificação nominal obrigatória.",
                                        minLength: {
                                            value: 3,
                                            message: "Sinal muito curto. Mínimo de 3 caracteres para sincronia."
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Sinal muito longo. Limite de 20 caracteres."
                                        }
                                    })}
                                    error={errors.identity?.name}
                                    value={nameValue}
                                    maxLength={20}
                                />

                                {/* 2. GRID DE METADADOS: DESIGN DE HARDWARE COMPACTO */}
                                <div className="grid grid-cols-2 gap-3 md:gap-4">

                                    <MetadataChip
                                        icon={CalendarDays}
                                        label="Cycle_Origin"
                                        value={`${birthDate.day}.${birthDate.month}.${birthYear}`}
                                        status="UTC-SYNC"
                                    />

                                    <MetadataChip
                                        icon={Barcode}
                                        label="Nexus_Serial"
                                        value={serialNumber}
                                        status="ENCRYPTED"
                                        isLongValue // Ativa a fonte menor e truncate para o Serial
                                    />

                                </div>
                            </div>
                        </div>

                        {/* --- BARRAMENTO TEMPORAL: SELETOR DE MATURAÇÃO --- */}
                        <div className="space-y-6 pt-8 border-t border-slate-50">
                            <div className="flex items-center justify-between px-2 mb-4">
                                <div className="flex items-center gap-3">
                                    {/* ÍCONE: Escala reduzida para Mobile (w-9) */}
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-step-identity/10 blur-md rounded-xl animate-pulse" />

                                        <div className="relative w-9 h-9 bg-white border-2 border-step-identity-soft rounded-xl flex items-center justify-center text-step-identity shadow-sm">
                                            <History size={18} strokeWidth={2.5} className="drop-shadow-sm" />
                                            <div className="absolute top-1 right-1 w-1 h-1 bg-step-identity rounded-full border border-white" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        {/* Título e Versão em uma única linha */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                                Temporal_Sync
                                            </label>
                                            <span className="text-[6px] font-mono font-bold text-step-identity/50 uppercase">
                                                v.2.0.6
                                            </span>
                                        </div>

                                        {/* Badge de Protocolo: Mais "slim" para mobile */}
                                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-step-identity-soft/50 border border-step-identity-soft/50 rounded-md w-fit">
                                            <Zap size={7} className="text-step-identity fill-step-identity" />
                                            <span className="text-[7px] font-mono font-bold text-step-identity uppercase tracking-tighter leading-none">
                                                {schoolGrade}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* LADO DIREITO: Telemetria simplificada para mobile (opcional) */}
                                <div className="flex flex-col items-end opacity-20">
                                    <span className="text-[5px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Stability</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-1.5 h-0.5 rounded-full bg-step-identity-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 md:gap-4">
                                {[12, 13, 14, 15, 16, 17, 18, 19].map((age) => {
                                    const isSelected = selectedAge === age;
                                    return (
                                        <button
                                            key={age}
                                            type="button"
                                            onClick={() => {
                                                setValue('identity.age', age, { shouldValidate: true });
                                                if (navigator.vibrate) navigator.vibrate(12);
                                            }}
                                            className={`
                                                    group relative h-16 md:h-20 rounded-3xl flex flex-col items-center justify-center 
                                                    transition-all duration-500 border-2
                                                    ${isSelected
                                                    ? 'bg-white border-step-identity shadow-[0_15px_35px_-10px_step-identity/25%] z-10 scale-[1.05]'
                                                    : 'bg-white/60 backdrop-blur-md border-slate-100/80 text-slate-400 hover:border-step-identity-soft hover:bg-white active:scale-95'
                                                }
                                            `}
                                        >
                                            {/* 1. FIBRA ÓPTICA (LED SUPERIOR) */}
                                            <div className={`
                    absolute top-2 w-5 h-1 rounded-full transition-all duration-700 
                    ${isSelected
                                                    ? 'bg-step-identity shadow-[0_0_12px_step-identity]'
                                                    : 'bg-slate-200 opacity-50 group-hover:bg-step-identity-soft'}
                `} />

                                            {/* 2. VALOR NOMINAL (Tipografia Nexus) */}
                                            <span className={`
                    text-xl md:text-2xl font-black transition-all duration-500 tracking-tighter
                    ${isSelected ? 'text-step-identity scale-110' : 'text-slate-600'}
                `}>
                                                {age}
                                            </span>

                                            {/* 3. MICRO-LABEL TÉCNICO */}
                                            <span className={`
                    text-[7px] font-black uppercase tracking-[0.25em] mt-1 transition-colors duration-500 
                    ${isSelected ? 'text-step-identity' : 'text-slate-300'}
                `}>
                                                Anos
                                            </span>

                                            {/* 4. BERÇO DE ENERGIA (Efeito Ativo) */}
                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="activeCradle"
                                                        className="absolute inset-0 rounded-[1.7rem] overflow-hidden pointer-events-none"
                                                    >
                                                        {/* Rim Light Interna */}
                                                        <div className="absolute inset-0 border border-step-identity/10 shadow-[inset_0_0_15px_step-identity/5%]" />

                                                        {/* Cantoneiras de Precisão (Hardware Style) */}
                                                        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t-2 border-l-2 border-step-identity" />
                                                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b-2 border-r-2 border-step-identity" />

                                                        {/* Shimmer de Ativação */}
                                                        <motion.div
                                                            animate={{ x: ['-100%', '200%'] }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-0 bg-linear-to-r from-transparent via-step-identity/5 to-transparent skew-x-[-20deg]"
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* FOOTER: TERMINAL DE LOGS */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-0.5">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} className="w-1 h-3 bg-step-identity/20 rounded-full" />
                                    ))}
                                </div>
                                <span className="text-[7px] font-mono text-slate-400 font-bold uppercase tracking-[0.4em]">Nexus_Identity_System_v2.26</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest leading-none">Security_Stamp</span>
                                    <span className="text-[8px] font-mono font-black text-step-identity uppercase mt-1">Verified_Operative</span>
                                </div>
                                <QrCode size={24} className="text-slate-200" strokeWidth={1} />
                            </div>
                        </div>
                    </div>

                    {/* Efeitos de Canto (Hardware) */}
                    <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-slate-100 shadow-inner" />
                    <div className="absolute bottom-6 right-6 w-2 h-2 rounded-full bg-slate-100 shadow-inner" />
                </div>
            </div>

            {/* Micro-Dica de Navegação (Mobile Only) */}
            <div className="md:hidden flex items-center justify-center gap-2 text-slate-400 animate-pulse">
                <AlertCircle size={10} />
                <span className="text-[8px] font-bold uppercase tracking-widest">Toque nos campos para editar o chip</span>
            </div>
        </div>
    );
};