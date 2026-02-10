import React, { useMemo } from 'react';
import { Swords, Cpu, Info, Zap, Package } from 'lucide-react';
import { NexusIcon } from '../../../components/common/NexusIcon';
import { InventoryDisplay } from '../../../components/shared/InventoryDisplay';
import { useNexus } from '../../../hooks/useNexus';

export const DetailedScan = ({ character, vault }) => {
    const { inventorySave, inventoryDelete } = useNexus();
    // 1. SINCRONIA DE ARSENAL
    const equippedWeapon = useMemo(() => {
        return vault?.weapons?.find((w: any) => String(w._id) === String(character.weapons?.primary));
    }, [vault, character.weapons?.primary]);

    const weaponEssence = useMemo(() => {
        const rawEssence = equippedWeapon?.essenceId;
        if (!rawEssence) return null;
        if (typeof rawEssence === 'object' && rawEssence._id) return rawEssence;
        return vault?.essences?.find((e: any) => String(e._id) === String(rawEssence));
    }, [equippedWeapon, vault]);

    // 2. SINCRONIA DE KIT (ARQUÉTIPO)
    const archetypeDetails = useMemo(() => {
        return vault?.archetypes?.find((c: any) => String(c._id) === String(character.background?.archetype));
    }, [vault, character.background?.archetype]);

    return (
        <div className="pt-6 mt-6 border-t border-slate-100/50 space-y-8">

            {/* --- GRID SUPERIOR: ARSENAL E ARQUÉTIPO --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">

                {/* --- COLUNA 1: ARSENAL DETALHADO --- */}
                <div className="space-y-3">
                    <SectionHeader icon={<Swords size={10} />} label="Hardware_Arsenal" />

                    <div className="relative p-6 rounded-[2.5rem] bg-white border border-white shadow-xs overflow-hidden h-full">
                        <div
                            className="absolute -top-12 -right-12 w-64 h-64 blur-[80px] opacity-[0.12]"
                            style={{ backgroundColor: weaponEssence?.colorVar || '#cbd5e1' }}
                        />

                        <div className="relative z-10 space-y-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-50 text-slate-900" style={{ color: weaponEssence?.colorVar }}>
                                        <NexusIcon name={weaponEssence?.iconName || 'Target'} size={28} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Arsenal</span>
                                        <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                                            {equippedWeapon?.name || "Desarmado"}
                                        </h4>
                                        <span className="mt-1.5 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border self-start"
                                            style={{ backgroundColor: `${weaponEssence?.colorVar}10`, color: weaponEssence?.colorVar, borderColor: `${weaponEssence?.colorVar}20` }}>
                                            {equippedWeapon?.typeLabel || "Standard"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-1 space-y-2">
                                <label className="text-[7px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Info size={10} className="opacity-50" />
                                    <span>Dossiê_Operacional</span>
                                </label>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                    "{equippedWeapon?.description || "Aguardando sincronia..."}"
                                </p>
                            </div>

                            {/* MAP DE NOTAS ESPECIAIS (CORREÇÃO DE ARRAY) */}
                            <div className="space-y-2">
                                {equippedWeapon?.specialNotes?.map((note: any) => (
                                    <div key={note._id} className="p-3 rounded-2xl bg-slate-50/50 border border-white flex items-start gap-3">
                                        <div className="p-1 rounded bg-white shadow-xs" style={{ color: weaponEssence?.colorVar }}>
                                            <Zap size={10} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">{note.category}</span>
                                            <p className="text-[9px] text-slate-600 font-bold leading-tight">{note.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLUNA 2: ARQUÉTIPO --- */}
                <div className="space-y-3">
                    <SectionHeader icon={<Cpu size={10} />} label="Starter_Kit_Protocol" />
                    <div className="relative p-6 rounded-[2.5rem] bg-slate-50/50 border border-white shadow-inner h-full">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-white">
                                    <NexusIcon name={archetypeDetails?.iconName || 'Box'} size={24} />
                                </div>
                                <div>
                                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest block">Arquétipo</span>
                                    <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                                        {archetypeDetails?.name || "NEXUS_GHOST"}
                                    </h4>
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold italic leading-relaxed">
                                {archetypeDetails?.description}
                            </p>

                            {/* Tags de Itens Iniciais (Mapeando o Array do Arquétipo) */}
                            <div className="flex flex-wrap gap-1.5">
                                {archetypeDetails?.items?.map((item: any) => (
                                    <span key={item._id} className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[7px] font-black text-slate-400 uppercase tracking-widest shadow-xs">
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SEÇÃO INFERIOR: INVENTÁRIO COMPLETO (SINAL INTEGRADO) --- */}
            <div className="space-y-4 pt-4">
                <SectionHeader icon={<Package size={10} />} label="Full_Inventory_Manifest" />
                <div className="bg-slate-50/30 rounded-[3rem] p-4 border border-slate-100/50">
                    <InventoryDisplay
                        items={character.inventory || []}
                        onSave={inventorySave}
                        onDelete={inventoryDelete}
                    />
                </div>
            </div>
        </div>
    );
};

function SectionHeader({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-2 text-slate-300 ml-4">
            <div className="p-1 rounded-md bg-white border border-slate-50 shadow-xs">{icon}</div>
            <span className="text-[7px] font-black uppercase tracking-[0.4em]">{label}</span>
        </div>
    );
}