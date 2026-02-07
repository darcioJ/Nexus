import { motion } from 'framer-motion';
import { 
  ShieldCheck, Fingerprint, Mail, 
  Calendar, UserCog, UserMinus
} from 'lucide-react';

export const UserCard = ({ user, onToggleRole, onDelete }: any) => {
    const isMaster = user.role === 'MASTER';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-white/70 backdrop-blur-2xl border border-white p-4 sm:p-6 rounded-[2.5rem] sm:rounded-[3.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden"
        >
            {/* 🌈 Prisma Aura (Indicador de Rank) */}
            <div className={`absolute left-0 top-0 w-1.5 sm:w-2 h-full transition-all duration-500 ${
                isMaster 
                ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                : 'bg-slate-200 opacity-50'
            }`} />

            {/* --- SEÇÃO DE IDENTIDADE --- */}
            <div className="flex items-center gap-4 sm:gap-8 relative z-10">
                {/* Bio-Icon: Tamanho adaptativo */}
                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center border-2 transition-all duration-700 shrink-0 ${
                    isMaster 
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-600 rotate-3 shadow-inner' 
                    : 'bg-slate-50 border-slate-100 text-slate-300'
                }`}>
                    {isMaster ? <ShieldCheck size={32} className="sm:size-10" /> : <Fingerprint size={32} className="sm:size-10" />}
                </div>

                <div className="flex flex-col min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-black text-slate-900 text-lg sm:text-2xl italic tracking-tighter uppercase leading-none truncate">
                            {user.name}
                        </h4>
                        <span className={`px-2 py-0.5 text-[6px] sm:text-[8px] font-black uppercase rounded-full tracking-[0.2em] ${
                            isMaster ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                            {user.role}
                        </span>
                    </div>

                    {/* Metadados: Empilhados no mobile, linha no desktop */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-1.5 truncate">
                            <Mail size={12} className="text-slate-300 shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </div>
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-300 shrink-0" />
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- COMANDOS DE MODERAÇÃO (DOCK) --- */}
            <div className="flex items-center gap-3 sm:gap-2 self-end sm:self-auto border-t sm:border-t-0 border-slate-50 pt-4 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                    onClick={onToggleRole}
                    className="flex-1 sm:flex-none h-12 px-4 sm:px-0 sm:w-14 flex items-center justify-center gap-2 bg-slate-50 sm:bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all active:scale-95"
                >
                    <UserCog size={20} />
                    <span className="sm:hidden text-[9px] font-black uppercase tracking-widest">Cargo</span>
                </button>
                
                <button
                    onClick={onDelete}
                    className="flex-1 sm:flex-none h-12 px-4 sm:px-0 sm:w-14 flex items-center justify-center gap-2 bg-rose-50/50 sm:bg-white border border-rose-100 sm:border-slate-100 text-rose-400 sm:text-slate-400 rounded-2xl hover:text-rose-600 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/10 transition-all active:scale-95"
                >
                    <UserMinus size={20} />
                    <span className="sm:hidden text-[9px] font-black uppercase tracking-widest">Remover</span>
                </button>
            </div>

            {/* Marca d'água de segurança (Decorativa) */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none select-none">
              <span className="text-6xl font-black italic tracking-tighter uppercase">Nexus</span>
            </div>
        </motion.div>
    );
};