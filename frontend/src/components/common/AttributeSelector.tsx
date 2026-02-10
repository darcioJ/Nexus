import { motion, AnimatePresence } from 'framer-motion';
import { NexusIcon } from '../common/NexusIcon';
import { NexusSignalVisor } from './NexusSignalVisor';

interface AttributeSelectorProps {
    attributes: any[];
    watch: any;
    setValue: any;
    register: any;
    name?: string; // O caminho do campo no form (ex: "resistance" ou "bonus.attributeId")
    max?: number;  // Limite de seleção (1 ou 2)
}

export const AttributeSelector = ({
    attributes,
    watch,
    setValue,
    register,
    name = "resistance", // Default para não quebrar onde já existe
    max = 2
}: AttributeSelectorProps) => {

    const currentValue = watch(name) || "";

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {attributes?.filter(attr => !attr.isSystem).map((attr) => {
                    const color = attr.colorVar || "#cbd5e1";
                    // Padrão de string: Nome (ABR)
                    const attrLabel = `${attr.name} (${attr.name.slice(0, 3).toUpperCase()})`;
                    const isSelected = currentValue.includes(attrLabel);

                    return (
                        <motion.button
                            key={attr._id}
                            type="button"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                const selectedArray = currentValue ? currentValue.split(' e ') : [];

                                if (isSelected) {
                                    const filtered = selectedArray.filter((item: string) => item !== attrLabel);
                                    setValue(name, filtered.join(' e '), { shouldValidate: true });
                                } else {
                                    // Lógica de limite dinâmico (max)
                                    if (max === 1) {
                                        setValue(name, attrLabel, { shouldValidate: true });
                                    } else if (selectedArray.length < max) {
                                        const updated = [...selectedArray, attrLabel];
                                        setValue(name, updated.join(' e '), { shouldValidate: true });
                                    }
                                }
                            }}
                            style={{
                                borderColor: isSelected ? color : undefined,
                                boxShadow: isSelected ? `0 15px 30px -10px ${color}40` : undefined
                            } as any}
                            className={`
                                relative flex flex-col items-center justify-center p-5 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden
                                ${isSelected
                                    ? 'bg-white'
                                    : 'bg-white/40 border-white/80 text-slate-400 hover:border-slate-200 hover:bg-white'}
                            `}
                        >
                            <div
                                className={`absolute top-4 right-5 w-1.5 h-1.5 rounded-full transition-all duration-500 ${isSelected ? 'animate-pulse shadow-[0_0_8px]' : 'bg-slate-200'}`}
                                style={{ backgroundColor: isSelected ? color : undefined, color: color } as any}
                            />

                            <div
                                className={`mb-2.5 p-2 rounded-2xl transition-all duration-500 ${isSelected ? 'bg-slate-50 shadow-inner' : 'bg-transparent'}`}
                                style={{ color: isSelected ? color : '#CBD5E1' }}
                            >
                                <NexusIcon name={attr.iconName} size={20} strokeWidth={1.5} />
                            </div>

                            <div className="text-center">
                                <span className={`block text-[10px] font-bold tracking-tight leading-none ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {attr.name}
                                </span>
                                <span className="text-[7px] font-black font-mono opacity-40 uppercase tracking-[0.2em] mt-1.5 block">
                                    {attr.name.slice(0, 3)}
                                </span>
                            </div>

                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} exit={{ opacity: 0 }}
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ backgroundColor: color }}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            <NexusSignalVisor
                register={register}
                fieldName={name}
                value={currentValue}
                maxSlots={max}
                placeholder={max === 1 ? "Selecionar atributo de vínculo..." : "Selecionar módulos de defesa..."}
            />
        </div>
    );
};