import { motion, AnimatePresence } from 'framer-motion';
import { RANGE_CONFIG } from '../../config/vault.config';
import { NexusSignalVisor } from './NexusSignalVisor';

interface RangeSelectorProps {
    register: any;
    watch: any;
    setValue: any;
}

export const RangeSelector = ({ register, watch, setValue }: RangeSelectorProps) => {
    const currentRange = watch('range');
    const config = RANGE_CONFIG[currentRange];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                {Object.entries(RANGE_CONFIG).map(([key, item]) => {
                    const isSelected = currentRange === key;
                    const Icon = item.icon;

                    return (
                        <motion.button
                            key={key}
                            type="button"
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setValue('range', key, { shouldValidate: true })}
                            className={`
                relative flex flex-col items-center justify-center p-5 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden
                ${isSelected
                                    ? 'bg-white border-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] scale-[1.05]'
                                    : 'bg-white/40 border-white/80 text-slate-400 hover:border-white hover:bg-white/80'}
              `}
                        >
                            {/* LED DE CALIBRAÇÃO */}
                            <div
                                className={`absolute top-4 right-5 w-1.5 h-1.5 rounded-full transition-all duration-700 ${isSelected ? 'animate-pulse shadow-[0_0_10px]' : 'bg-slate-200'}`}
                                style={{
                                    backgroundColor: isSelected ? item.color : undefined,
                                    boxShadow: isSelected ? `0 0 10px ${item.color}` : 'none'
                                } as any}
                            />

                            {/* ÍCONE TÁTICO */}
                            <div
                                className={`mb-3 p-2.5 rounded-2xl transition-all duration-500 ${isSelected ? 'bg-slate-50 shadow-inner scale-110' : 'bg-transparent'}`}
                                style={{ color: isSelected ? item.color : '#CBD5E1' }}
                            >
                                <Icon size={22} strokeWidth={1.5} />
                            </div>

                            {/* LABELS DE IDENTIFICAÇÃO */}
                            <div className="text-center">
                                <span className={`block text-[10px] font-bold tracking-tight leading-none ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {key}
                                </span>
                                <span className="text-[6px] font-black font-mono opacity-40 uppercase tracking-[0.2em] mt-1.5 block">
                                    {item.label}
                                </span>
                            </div>

                            {/* BLOOM DE REFRAÇÃO (DIVERSIDADE CROMÁTICA) */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.08 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ backgroundColor: item.color }}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            {/* VISOR DE CONFIRMAÇÃO DO SINAL */}
            <NexusSignalVisor
                register={register}
                fieldName="range"
                value={currentRange}
                placeholder="Calibrando distância de engajamento..."
                accentColor={config?.color}
                maxSlots={1}
            />
        </div>
    );
};