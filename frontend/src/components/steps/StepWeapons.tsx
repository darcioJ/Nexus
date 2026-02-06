import { triggerHaptic } from '../../utils/triggerHaptic';

import { useFormContext } from 'react-hook-form';
import type { CharacterData } from '../../models/character';

import { HeaderStep } from '../shared/HeaderStep';
import { WeaponCard } from './StepWeapons/WeaponCard';

import { useVault } from '../../hooks/useVault';
import { LoadingScreen } from '../common/LoadingScreen';

export const StepWeapons = () => {
    const { vault, isLoading } = useVault(); // Sinal do DB
    const { register, watch, setValue } = useFormContext<CharacterData>();
    const selected = watch('weapons.primary');

    if (isLoading || !vault) return <LoadingScreen message="Escaneando Arsenal..." />;

    return (
        <div className="grid grid-cols-1 gap-8 space-y-8 md:space-y-12">
            <HeaderStep
                icon="Sword"
                label="Módulo 4"
                title="Arsenal de"
                highlight="Armas"
                description="Selecione o armamento principal para sincronização tática."
                accentColor="var(--color-step-weapons)"
                secondaryColor="var(--color-step-weapons-soft)"
            />

            {vault.weapons.map((weapon) => (
                <WeaponCard
                    key={weapon._id} // ID real do Banco
                    weapon={weapon}
                    isSelected={selected === weapon._id} // Match por ID
                    onSelect={(id) => {
                        setValue('weapons.primary', id); // Salva o _id no form
                        triggerHaptic('MEDIUM');
                    }}
                    register={register('weapons.primary')}
                />
            ))}
        </div>
    );
};