import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
    Sparkles, 
    ShieldCheck, 
    Fingerprint, 
    Zap,
    Cpu,
    Shield,
    Database,
    Crown
} from 'lucide-react';

export function WelcomePage() {
    const { character } = useOutletContext();
    const navigate = useNavigate();

    // --- PROTOCOLO DE IDENTIFICAÇÃO ---
    const user = useMemo(() => JSON.parse(localStorage.getItem("@Nexus:User") || "{}"), []);
    const isMaster = user.role === 'MASTER';
    
    // Define o nome de exibição (Prioridade para o nome real do Mestre ou nome da ficha)
    const displayName = isMaster 
        ? user.name?.split(' ')[0] 
        : (character?.identity?.name?.split(' ')[0] || "Operador");

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center font-sans"
        >
            {/* --- I. REATOR DE BOAS-VINDAS (DINÂMICO) --- */}
            <div className="relative mb-8">
                <motion.div 
                    animate={{ rotate: isMaster ? -360 : 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className={`absolute -inset-10 border border-dashed rounded-full opacity-40 ${isMaster ? 'border-amber-400' : 'border-slate-200'}`}
                />
                
                <div className={`
                    w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl flex items-center justify-center border-2 relative z-10 transition-colors duration-700
                    ${isMaster ? 'border-amber-50' : 'border-slate-50'}
                `}>
                    {isMaster ? (
                        <Shield size={48} className="text-amber-500" />
                    ) : (
                        <Fingerprint size={48} className="text-step-identity animate-pulse" />
                    )}
                </div>
                
                {isMaster && (
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-white"
                    >
                        <Crown size={14} />
                    </motion.div>
                )}
            </div>

            {/* --- II. MENSAGEM DE SINCRONIA --- */}
            <div className="space-y-4 mb-12">
                <div className="flex items-center justify-center gap-3">
                    <span className={`h-px w-10 ${isMaster ? 'bg-amber-200' : 'bg-slate-200'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.6em] ${isMaster ? 'text-amber-600' : 'text-slate-400'}`}>
                        {isMaster ? 'Architect_Access_Granted' : 'Link_Neural_Estabilizado'}
                    </span>
                    <span className={`h-px w-10 ${isMaster ? 'bg-amber-200' : 'bg-slate-200'}`} />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                    {isMaster ? 'SALVE, ' : 'BEM-VINDO, '} <br/>
                    <span className={`italic ${isMaster ? 'text-amber-500' : 'text-step-identity'}`}>
                        {displayName}
                    </span>
                </h1>
                
                <p className="max-w-md mx-auto text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                    {isMaster 
                        ? "O Nexus Vault está sob sua jurisdição. Todas as realidades e fichas biológicas estão prontas para sua modulação."
                        : "Seu perfil biológico foi indexado ao mainframe. O sistema está pronto para mediar sua jornada."
                    }
                </p>
            </div>

            {/* --- III. CHASSIS DE ATALHOS RÁPIDOS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
                <button 
                    onClick={() => navigate(isMaster ? '/dashboard/master-panel' : 'profile')}
                    className="group p-6 bg-white/60 backdrop-blur-xl border-2 border-white rounded-[2.5rem] flex items-center gap-6 transition-all hover:scale-[1.03] hover:shadow-xl text-left"
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isMaster ? 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-step-identity group-hover:text-white'}`}>
                        {isMaster ? <Database size={24} /> : <Cpu size={24} />}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                            {isMaster ? "Painel de Controle" : "Acessar Perfil"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {isMaster ? "Gerenciar Campanha" : "Calibração de Atributos"}
                        </p>
                    </div>
                </button>

                <button 
                    onClick={() => navigate('wiki')}
                    className="group p-6 bg-white/60 backdrop-blur-xl border-2 border-white rounded-[2.5rem] flex items-center gap-6 transition-all hover:scale-[1.03] hover:shadow-xl text-left"
                >
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Nexuspedia</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Banco de Dados</p>
                    </div>
                </button>
            </div>

            {/* --- IV. FOOTER DE STATUS --- */}
            <footer className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className={isMaster ? 'text-amber-500' : 'text-slate-400'} />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                        {isMaster ? 'AUTORIDADE_NIVEL_MAX' : 'Protocolo_Ativo'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className={isMaster ? 'text-amber-500' : 'text-slate-400'} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Sinc_Nominal</span>
                </div>
            </footer>
        </motion.div>
    );
}