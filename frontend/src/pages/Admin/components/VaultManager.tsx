import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Database, Activity, Binary, Box } from 'lucide-react';

// --- INFRAESTRUTURA NEXUS ---
import { useVault } from '../../../hooks/useVault';
import { useNotification } from '../../../hooks/useNotification';
import { useConfirm } from '../../../hooks/useConfirm';

import { triggerHaptic } from '../../../utils/triggerHaptic';
import { VAULT_CONFIG, type VaultTab } from '../../../config/vault.config'; // Importando a inteligência central

// --- COMPONENTES ---
import { VaultFormModal } from './VaultFormModal';
import { VaultCard } from './VaultCard';
import { StatCard } from './StatCard';

export const VaultManager = () => {
    const {
        weapons, clubs, statusEffects, essences, archetypes, attributes,
        refreshVault, isRefreshing
    } = useVault();
    const { notifySuccess, notifyError } = useNotification();
    const { confirmDanger } = useConfirm();

    const [activeTab, setActiveTab] = useState<VaultTab>('weapons');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // 🎯 FILTRAGEM DINÂMICA (Baseada no mapeamento central)
    // 🎯 FILTRAGEM E ORDENAÇÃO DINÂMICA
    const currentData = useMemo(() => {
        const dataMap = { weapons, clubs, essences, archetypes, attributes, status: statusEffects };
        const rawData = (dataMap as any)[activeTab] || [];

        // 1. Primeiro filtramos pelo termo de busca
        const filtered = rawData.filter((item: any) =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.key?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // 2. Aplicamos a Ordenação de Prioridade (Kernel First)
        return [...filtered].sort((a, b) => {
            // Se ambos forem sistema ou ambos forem usuário, mantemos a ordem alfabética (desempate)
            if (a.isSystem === b.isSystem) {
                return (a.name || '').localeCompare(b.name || '');
            }

            // Se 'a' for sistema, ele sobe (-1). Se 'b' for sistema, 'a' desce (1).
            return a.isSystem ? -1 : 1;
        });
    }, [activeTab, searchTerm, weapons, clubs, statusEffects, essences, archetypes, attributes]);

    // 📊 TELEMETRIA
    const telemetry = useMemo(() => ({
        count: currentData.length,
        sector: VAULT_CONFIG[activeTab].label.toUpperCase(),
        health: isRefreshing ? 'Scanning' : 'Nominal'
    }), [currentData.length, isRefreshing, activeTab]);

    // 🎮 INTERAÇÕES TÁTEIS
    const changeTab = (tab: VaultTab) => {
        triggerHaptic('LIGHT');
        setActiveTab(tab);
    };

    const handleOpenModal = (item: any = null) => {
        triggerHaptic('MEDIUM');
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        // Aciona o Modal de Decisão com visual de Perigo (Rose/Red)
        const ok = await confirmDanger(
            "Expurgar dados?",
            `Você está prestes a remover permanentemente este registro de ${VAULT_CONFIG[activeTab].label}. Esta operação não pode ser revertida.`
        );

        // Se o usuário clicar em 'Abortar', a execução para aqui
        if (!ok) return;

        try {
            // Feedback tátil pesado para confirmar a intenção
            triggerHaptic("MEDIUM");

            await VAULT_CONFIG[activeTab].delete(id);

            notifySuccess("Dados expurgados.", "Informação deletada com sucesso.");
            refreshVault();
        } catch (error) {
            notifyError(error, "Erro ao deletar dados.");
            console.error(error);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* --- SEÇÃO DE TELEMETRIA --- */}
            <header className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label={`Ativos: ${telemetry.sector}`} value={telemetry.count} icon={<Database />} color="var(--color-admin-panel)" detail="Sincronia com o Core" />
                <StatCard label="Status do Vault" value={telemetry.health} icon={<Activity />} color="var(--color-emerald-500)" pulse={isRefreshing} detail="Setor de Dados Estável" />
                <StatCard label="Protocolo" value="MASTER" icon={<Binary />} color="var(--color-slate-400)" detail="Terminal_Nexus_V2" />
            </header>

            {/* --- CONSOLE DE COMANDO (DUAL LAYER) --- */}
            {/* --- CONSOLE DE COMANDO (DUAL LAYER) --- */}
            <div className="sticky top-4 z-40 flex flex-col gap-3 p-2 lg:p-4 bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl shadow-slate-200/50">

                {/* LAYER 1: NAVEGAÇÃO DE SETORES (Tabs) - Agora com preenchimento total */}
                <nav className="w-full flex items-stretch gap-1 p-1 bg-slate-100/40 rounded-[1.8rem] lg:rounded-[2.2rem]">
                    {Object.entries(VAULT_CONFIG).map(([key, config]) => (
                        <TabBtn
                            key={key}
                            active={activeTab === key}
                            onClick={() => changeTab(key as VaultTab)}
                            icon={<config.icon size={18} />}
                            label={config.label}
                        />
                    ))}
                </nav>

                {/* LAYER 2: CONTROLES DE OPERAÇÃO */}
                <div className="flex items-center gap-2 lg:gap-4 px-1">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-admin-panel transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Rastrear ativo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 lg:h-14 pl-12 lg:pl-14 pr-6 bg-white border-2 border-slate-50 rounded-2xl lg:rounded-[1.5rem] text-[10px] lg:text-xs font-bold uppercase tracking-widest outline-none focus:border-admin-panel focus:ring-8 focus:ring-admin-panel/5 transition-all placeholder:text-slate-200 shadow-sm"
                        />
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="h-12 lg:h-14 px-5 lg:px-10 bg-admin-panel text-white rounded-2xl lg:rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-admin-panel/20 hover:brightness-110 active:scale-95 transition-all shrink-0"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span className="hidden sm:inline">Novo Registro</span>
                    </button>
                </div>
            </div>

            {/* --- LISTAGEM DE REGISTROS --- */}
            <div className="relative min-h-100">
                <AnimatePresence mode="wait"> {/* 'wait' garante que a aba saia antes da outra entrar */}
                    <motion.div
                        key={activeTab} // Chave única por aba para disparar a animação de troca
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid gap-4 w-full"
                    >
                        {currentData.length > 0 ? (
                            currentData.map((item: any) => (
                                <VaultCard
                                    key={item._id}
                                    item={item}
                                    type={activeTab}
                                    onEdit={() => handleOpenModal(item)}
                                    onDelete={() => handleDelete(item._id)}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-white/20 rounded-[4rem] border border-dashed border-slate-200">
                                <Box size={48} className="text-slate-200 mb-6" />
                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em]">
                                    Nenhum_Registro_Detectado
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* --- MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <VaultFormModal
                        type={activeTab}
                        initialData={editingItem}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => { setIsModalOpen(false); refreshVault(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const TabBtn = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        // flex-1 faz com que ele cresça para ocupar o espaço; min-w-0 evita quebras de layout
        className={`flex-1 min-w-0 flex items-center justify-center gap-3 px-2 lg:px-6 py-3 lg:py-4 rounded-[1.5rem] lg:rounded-[1.8rem] font-black text-[9px] uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-300 relative ${active
            ? 'bg-white text-indigo-600 shadow-md border border-indigo-50 scale-[1.02] z-10'
            : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'
            }`}
    >
        <span className={`${active ? 'scale-110 text-indigo-600' : 'opacity-60'} transition-transform shrink-0`}>
            {icon}
        </span>

        {/* Label inteligente: some no mobile, aparece no desktop */}
        <span className="hidden lg:block whitespace-nowrap overflow-hidden text-ellipsis">
            {label}
        </span>

        {active && (
            <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white rounded-[1.5rem] lg:rounded-[1.8rem] -z-10 shadow-indigo-500/10 shadow-lg"
            />
        )}
    </button>
);