
import { HeaderStep } from '../shared/HeaderStep';
import { IdentityCard } from '../shared/IdentityCard';
import { VitalTelemetry } from '../shared/VitalTelemetry';
import { WeaponCardReview } from '../shared/WeaponCardReview';
import { AttributesCard } from '../shared/AttributesCard';
import { BackgroundCard } from '../shared/BackgroundCard';

import type { CharacterData } from '../../models/character';
import { useFormContext } from 'react-hook-form';

import { useVault } from '../../hooks/useVault';
import { LoadingScreen } from '../common/LoadingScreen';

interface SectionHeaderProps {
    id: string | number;
    title: string;
    subtitle?: string;
    accentColor?: string;
}
/**
 * Componente para rotular as seções com precisão.
 * Declarado fora do StepReview para evitar reset de estado e erros de renderização.
 */
const SectionHeader = ({ id, title, subtitle, accentColor = "var(--color-step-review)" }: SectionHeaderProps) => {
    return (
        <div className="relative flex flex-col items-center mb-12 group">

            {/* 1. INDICADOR DE STATUS (ESTÁTICO) */}
            <div className="flex flex-col items-center mb-3">
                <div
                    className="w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] opacity-80"
                    style={{ color: accentColor, backgroundColor: 'currentColor' }}
                />
            </div>

            {/* 2. METADADOS TÉCNICOS COM LINHAS DE EQUILÍBRIO */}
            <div className="w-full flex items-center justify-center gap-6 mb-2">
                <div className="h-px flex-1 max-w-25 bg-linear-to-r from-transparent to-slate-200" />

                <span className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">
                    Protocol_
                    <span className="text-slate-400">0{id}</span>
                </span>

                <div className="h-px flex-1 max-w-25 bg-grbg-linear-to-l-transparent to-slate-200" />
            </div>

            {/* 3. TÍTULO E SUBTÍTULO CENTRALIZADOS */}
            <div className="flex flex-col items-center gap-1">
                <h3 className="text-sm md:text-base font-black text-slate-600 uppercase tracking-[0.2em] text-center">
                    {title}
                </h3>

                {subtitle && (
                    <span className="text-[8px] font-bold text-slate-400 uppercase italic tracking-[0.15em] opacity-70">
                        {subtitle}
                    </span>
                )}
            </div>

            {/* 4. DECORAÇÃO DE PRECISÃO INFERIOR */}
            <div className="flex gap-1.5 mt-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-slate-100"
                    />
                ))}
            </div>
        </div>
    );
};

export const StepReview = () => {
    const { watch } = useFormContext<CharacterData>();
    const data = watch();
    const { vault, isLoading } = useVault();

    if (isLoading || !vault) {
        return <LoadingScreen message="Sincronizando Dossiê com o Vault..." />;
    }

    return (
        <div className="space-y-16 md:space-y-24 w-full pb-20">
            <HeaderStep
                icon="ClipboardCheck"
                label="Módulo 5"
                title="Revisão do"
                highlight="Dossiê"
                description="Verificando integridade dos dados e alocações..."
                accentColor="var(--color-step-review)"
                secondaryColor="var(--color-step-review-soft)"
            />

            <div className="max-w-6xl mx-auto space-y-20">

                {/* SEÇÃO 01: IDENTIDADE */}
                <section className="relative">
                    <SectionHeader id="01" title="Identificação de Sujeito" />
                    <div className="bg-white/30 rounded-[3rem] p-2 border border-white/50 backdrop-blur-sm">
                        <IdentityCard data={data} />
                    </div>
                </section>

                {/* SEÇÃO 02: ORIGEM */}
                <section className="relative">
                    <SectionHeader id="02" title="Matriz de Antecedentes" />
                    <div className="bg-white/30 rounded-[3rem] p-2 border border-white/50 backdrop-blur-sm">
                        <BackgroundCard data={data} vault={vault} />
                    </div>
                </section>

                {/* SEÇÃO 03: TELEMETRIA E ATRIBUTOS */}
                <section className="relative">
                    <SectionHeader id="03" title="Sincronia de Atributos" />
                    <div className="bg-white/30 rounded-[3rem] p-2 border border-white/50 backdrop-blur-sm space-y-8">
                        <VitalTelemetry attributes={data.attributes} />
                        <AttributesCard data={data} vault={vault} />
                    </div>
                </section>

                {/* SEÇÃO 04: ARSENAL */}
                <section className="relative">
                    <SectionHeader id="04" title="Configuração de Equipamento" />
                    <div className="bg-white/30 rounded-[3rem] p-2 border border-white/50 backdrop-blur-sm">
                        <WeaponCardReview data={data} />
                    </div>
                </section>

            </div>
        </div>
    );
};