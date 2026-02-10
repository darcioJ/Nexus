import { motion, AnimatePresence } from 'framer-motion';
import { NexusIcon } from '../common/NexusIcon';
import { NexusSignalVisor } from './NexusSignalVisor';

interface EssenceSelectorProps {
    essences: any[];
    watch: any;
    setValue: any;
    register: any;
}

export const EssenceSelector = ({ essences, watch, setValue, register }: EssenceSelectorProps) => {
    const selectedId = watch('essenceId');
    const selectedEssence = essences.find(e => e._id === selectedId);

    return (
        <div className="col-span-2 space-y-4">
            {/* GRID DE MÓDULOS: CORES DE ESSÊNCIA */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {essences.map((essence: any) => {
                    const isSelected = selectedId === essence._id;
                    const color = essence.colorVar || "#6366f1";

                    return (
                        <motion.button
                            key={essence._id}
                            type="button"
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setValue('essenceId', essence._id, { shouldValidate: true })}
                            style={{
                                borderColor: isSelected ? color : undefined,
                                boxShadow: isSelected ? `0 20px 40px -10px ${color}40` : undefined
                            } as any}
                            className={`
                                relative flex flex-col items-center justify-center p-5 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden
                                ${isSelected
                                    ? 'bg-white scale-[1.05]'
                                    : 'bg-white/40 border-white/80 text-slate-400 hover:border-white hover:bg-white'}
                            `}
                        >
                            {/* LED DE ATIVIDADE ELEMENTAL */}
                            <div
                                className={`absolute top-4 right-5 w-1.5 h-1.5 rounded-full transition-all duration-700 ${isSelected ? 'animate-pulse shadow-[0_0_10px]' : 'bg-slate-100'}`}
                                style={{ backgroundColor: isSelected ? color : undefined, color: color } as any}
                            />

                            {/* ÍCONE COM SLOT DE CERÂMICA */}
                            <div
                                className={`mb-2 p-2 rounded-2xl transition-all duration-500 ${isSelected ? 'bg-slate-50 shadow-inner scale-110' : 'bg-transparent'}`}
                                style={{ color: isSelected ? color : '#CBD5E1' }}
                            >
                                <NexusIcon name={essence.iconName || 'Zap'} size={22} strokeWidth={1.5} />
                            </div>

                            <div className="text-center">
                                <span className={`block text-[10px] font-bold tracking-tight leading-none ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {essence.name}
                                </span>
                                <span className="text-[6px] font-black font-mono opacity-40 uppercase tracking-[0.2em] mt-1.5 block">
                                    {essence.category || 'Elemental'}
                                </span>
                            </div>

                            {/* BLOOM DE REFRAÇÃO (FUNDAÇÃO PRISMA) */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.08 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ backgroundColor: color }}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            {/* VISOR DE INDEXAÇÃO DO NÚCLEO (SINAL TRADUZIDO) */}
            <NexusSignalVisor
                register={register}
                fieldName="essenceId"
                value={selectedId}
                displayValue={selectedEssence?.name} // Exibe o Nome amigável no visor
                accentColor={selectedEssence?.colorVar}
                placeholder="Aguardando conexão com núcleo elemental..."
                maxSlots={1}
            />
        </div>
    );
};