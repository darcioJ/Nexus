import { motion, AnimatePresence } from 'framer-motion';
import { NexusIcon } from '../common/NexusIcon'; // Ajuste o caminho conforme seu projeto
import { NexusSignalVisor } from './NexusSignalVisor';

interface StatusSelectorProps {
    statusEffects: any[];
    watch: any;
    setValue: any;
    register: any;
}

export const StatusSelector = ({ statusEffects, watch, setValue, register }: StatusSelectorProps) => {
    const selectedId = watch('statusId');
    const selectedStatus = statusEffects.find(s => s._id === selectedId);

    return (
        <div className="space-y-4">
            {/* GRID DE MÓDULOS: CHIPS DE STATUS DINÂMICOS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {statusEffects.map((status: any) => {
                    const isSelected = selectedId === status._id;
                    const color = status.colorVar || "#3b82f6";

                    return (
                        <motion.button
                            key={status._id}
                            type="button"
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setValue('statusId', status._id, { shouldValidate: true })}
                            style={{
                                borderColor: isSelected ? color : undefined,
                                boxShadow: isSelected ? `0 15px 30px -10px ${color}40` : undefined
                            } as any}
                            className={`
                relative flex flex-col items-start p-4 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden
                ${isSelected
                                    ? 'bg-white scale-[1.02]'
                                    : 'bg-white/40 border-white/80 text-slate-400 hover:border-slate-200 hover:bg-white'}
              `}
                        >
                            {/* LED DE VÍNCULO ESPECÍFICO */}
                            <div
                                className={`absolute top-4 right-5 w-1.5 h-1.5 rounded-full transition-all duration-500 ${isSelected ? 'animate-pulse shadow-[0_0_8px]' : 'bg-slate-200'}`}
                                style={{
                                    backgroundColor: isSelected ? color : undefined,
                                    color: color
                                } as any}
                            />

                            {/* ÍCONE COM SLOT DE CERÂMICA */}
                            <div
                                className={`mb-2 p-2 rounded-2xl transition-all duration-500 ${isSelected ? 'bg-slate-50 shadow-inner' : 'bg-transparent'}`}
                                style={{ color: isSelected ? color : '#CBD5E1' }}
                            >
                                <NexusIcon name={status.iconName || 'Activity'} size={18} strokeWidth={1.5} />
                            </div>

                            <div className="text-left">
                                <span className={`block text-[10px] font-bold tracking-tight leading-none ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {status.name}
                                </span>
                                <span className="text-[7px] font-black font-mono opacity-40 uppercase tracking-widest mt-1 block">
                                    {status.category || 'Standard'}
                                </span>
                            </div>

                            {/* REFRAÇÃO DE SINAL (BLOOM COLORIDO) */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.06 }}
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

            {/* VISOR DE CONEXÃO ATIVA (SINAL CONSOLIDADO) */}
            <NexusSignalVisor
                register={register}
                fieldName="statusId"
                value={selectedId}
                displayValue={selectedStatus?.name}
                maxSlots={1}
                accentColor={selectedStatus?.colorVar}
                placeholder="Indexando efeito de status..."
            />
        </div>
    );
};