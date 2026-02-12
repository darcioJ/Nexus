import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_CONFIG } from '../../config/vault.config'; // Ajuste o path
import { NexusSignalVisor } from './NexusSignalVisor';

interface CategorySelectorProps {
    register: any;
    watch: any;
    setValue: any;
}

export const CategorySelector = ({
    register,
    watch,
    setValue
}: CategorySelectorProps) => {
    const currentCategory = watch('category');

    return (
        <div className="space-y-4">
            {/* GRID DE MÓDULOS IRIDESCENTES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                    const isSelected = currentCategory === key;
                    const Icon = config.icon;

                    return (
                        <motion.button
                            key={key}
                            type="button"
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setValue('category', key, { shouldValidate: true })}
                            className={`
                    relative flex flex-col items-center justify-center p-5 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden
                    ${isSelected
                                    ? 'bg-white border-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] scale-[1.03]'
                                    : 'bg-white/40 border-white/80 text-slate-400 hover:border-white hover:bg-white/80'}
                  `}
                        >
                            {/* LED DE ESTADO DINÂMICO */}
                            <div
                                className={`absolute top-4 right-5 w-1.5 h-1.5 rounded-full transition-all duration-700 ${isSelected ? 'animate-pulse shadow-[0_0_10px]' : 'bg-slate-200'}`}
                                style={{
                                    backgroundColor: isSelected ? config.color : undefined,
                                    boxShadow: isSelected ? `0 0 10px ${config.color}` : 'none'
                                }}
                            />

                            {/* ÍCONE TÁTICO COM SLOT DE CERÂMICA */}
                            <div
                                className={`mb-3 p-2.5 rounded-2xl transition-all duration-500 ${isSelected ? 'bg-slate-50 shadow-inner scale-110' : 'bg-transparent'}`}
                                style={{ color: isSelected ? config.color : '#CBD5E1' }}
                            >
                                <Icon size={20} strokeWidth={1.5} />
                            </div>

                            {/* LABELS DE IDENTIFICAÇÃO */}
                            <div className="text-center">
                                <span className={`block text-[10px] font-bold tracking-tight leading-none ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {key}
                                </span>
                                <span className="text-[6px] font-black font-mono opacity-40 uppercase tracking-[0.2em] mt-1.5 block">
                                    {config.label || `TYPE_${key.slice(0, 3)}`}
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
                                        style={{ backgroundColor: config.color }}
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
                fieldName="category"
                value={watch('category')}
                placeholder='Aguardando categoria...'
                maxSlots={1}
                accentColor={CATEGORY_CONFIG[watch('category')]?.color}
            />
        </div>
    );
};