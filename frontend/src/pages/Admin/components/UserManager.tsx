import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, ShieldCheck, UserMinus, Search,
    Activity, Fingerprint, Mail, Calendar,
    UserCog, Loader2
} from 'lucide-react';

// --- INFRAESTRUTURA NEXUS ---
import { userService } from '../../../services/userService'; // Certifique-se de criar este service
import { triggerHaptic } from '../../../utils/triggerHaptic';
import { useNotification } from '../../../hooks/useNotification';
import { StatCard } from './StatCard';

export const UserManager = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { notifySuccess, notifyError } = useNotification();

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
        if (!confirm(`Confirmar alteração de privilégios para [${user.name}]?`)) return;

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
        if (!confirm("⚠️ ATENÇÃO: A purgação de usuário removerá permanentemente a ficha e o acesso. Confirmar?")) return;

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

// --- COMPONENTE: USER CARD (Refração Nexus) ---

const UserCard = ({ user, onToggleRole, onDelete }: any) => {
    const isMaster = user.role === 'MASTER';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-white/60 backdrop-blur-2xl border border-white p-6 rounded-[3rem] flex items-center justify-between transition-all hover:bg-white hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
        >
            {/* Prisma Aura (Somente para Mestres) */}
            {isMaster && (
                <div className="absolute left-0 top-0 w-1.5 h-full bg-admin-panel shadow-[0_0_20px_var(--color-admin-panel)]" />
            )}

            <div className="flex items-center gap-8 relative z-10">
                {/* Avatar / Bio-Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isMaster ? 'bg-indigo-50 border-indigo-100 text-admin-panel rotate-3' : 'bg-slate-50 border-slate-100 text-slate-300'
                    }`}>
                    {isMaster ? <ShieldCheck size={32} /> : <Fingerprint size={32} />}
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                        <h4 className="font-black text-slate-900 text-xl italic tracking-tighter uppercase leading-none">
                            {user.name}
                        </h4>
                        <span className={`px-2.5 py-0.5 text-[7px] font-black uppercase rounded-md tracking-[0.2em] ${isMaster ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                            {user.role}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Mail size={10} className="text-slate-300" />
                            <span>{user.email}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                            <Calendar size={10} className="text-slate-300" />
                            <span>Desde {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comandos de Moderação */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <button
                    onClick={onToggleRole}
                    title={isMaster ? "Rebaixar para Player" : "Promover a Mestre"}
                    className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-2xl hover:text-admin-panel hover:border-admin-panel/30 transition-all shadow-sm"
                >
                    <UserCog size={20} />
                </button>
                <button
                    onClick={onDelete}
                    title="Remover Acesso"
                    className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 rounded-2xl hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                >
                    <UserMinus size={20} />
                </button>
            </div>
        </motion.div>
    );
};