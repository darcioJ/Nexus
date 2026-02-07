import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    Users, ShieldCheck, Search,
    Activity, Fingerprint, Loader2
} from 'lucide-react';

// --- INFRAESTRUTURA NEXUS ---
import { userService } from '../../../services/userService'; // Certifique-se de criar este service
import { triggerHaptic } from '../../../utils/triggerHaptic';

import { useNotification } from '../../../hooks/useNotification';
import { useConfirm } from '../../../hooks/useConfirm';

import { StatCard } from './StatCard';
import { UserCard } from './UserCard';

export const UserManager = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { notifySuccess, notifyError } = useNotification();
    const { confirmDanger, confirmWarning } = useConfirm();

    // 📡 FETCH: Carregamento de Sinais
    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await userService.getUsers();
            setUsers(data.users);
        } catch (error) {
            notifyError(error, "Falha na varredura de usuários");
            console.error("❌ Erro na varredura de usuários:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    // 🎯 FILTRAGEM DINÂMICA
    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    // 📊 TELEMETRIA HUMANA
    const stats = useMemo(() => ({
        total: users.length,
        masters: users.filter(u => u.role === 'MASTER').length,
        players: users.filter(u => u.role === 'PLAYER').length
    }), [users]);

    // 🎮 COMANDOS ADMINISTRATIVOS
    const handleToggleRole = async (user: any) => {
        const newRole = user.role === 'MASTER' ? 'PLAYER' : 'MASTER';
        const ok = await confirmWarning(
            "Alterar privilégios?",
            `Confirmar alteração de privilégios para [${user.name}]?. Esta operação não pode ser revertida.`
        );

        if (!ok) return;

        try {
            triggerHaptic('MEDIUM');
            await userService.updateUser(user._id, { role: newRole });
            notifySuccess("Sucesso", "Nível alterado");
            loadUsers();
        } catch (error) {
            notifyError(error, "Falha ao alterar privilégio");
        }
    };

    const handleDeleteUser = async (id: string) => {
        const ok = await confirmDanger(
            "Deletar usuário?",
            `A purgação de usuário removerá permanentemente o acesso. Esta operação não pode ser revertida.`
        );

        if (!ok) return;

        try {
            await userService.deleteUser(id);
            notifySuccess("Sucesso", "Usuário removido com sucesso");
            loadUsers();
        } catch (error) {
            notifyError(error, "Falha ao remover usuário");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* --- TELEMETRIA DE SINAIS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Cérebros Conectados" value={stats.total} icon={<Users />} color="var(--color-admin-panel)" />
                <StatCard label="Mestres Ativos" value={stats.masters} icon={<ShieldCheck />} color="var(--color-indigo-500)" />
                <StatCard label="Sinais Civis" value={stats.players} icon={<Fingerprint />} color="var(--color-slate-400)" />
            </div>

            {/* --- BARRA DE BUSCA --- */}
            <div className="bg-white/40 backdrop-blur-3xl border border-white p-2 rounded-[2.5rem] shadow-xl shadow-admin-panel/5 flex items-center justify-between gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-admin-panel transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rastrear bio-assinatura ou e-mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 pl-16 pr-8 bg-white/60 border border-white rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] outline-none focus:ring-4 ring-admin-panel/10 focus:bg-white transition-all"
                    />
                </div>
                <button
                    onClick={loadUsers}
                    className="w-14 h-14 bg-white border border-white rounded-3xl flex items-center justify-center text-slate-400 hover:text-admin-panel hover:shadow-lg transition-all active:scale-95"
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Activity size={20} />}
                </button>
            </div>

            {/* --- LISTAGEM DE USUÁRIOS --- */}
            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            onToggleRole={() => handleToggleRole(user)}
                            onDelete={() => handleDeleteUser(user._id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};