import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Book, Shield, User, 
  Activity, Zap, WifiOff 
} from 'lucide-react';

interface MobileDockProps {
  isMaster: boolean;
  isConnected: boolean;
  activePath: string;
}

// --- SUB-COMPONENTE: ITEM DE NAVEGAÇÃO MOBILE ---
const MobileNavItem = ({ to, icon, active, color }: unknown) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(to)}
      whileTap={{ scale: 0.8 }}
      className="relative flex flex-col items-center justify-center py-2 transition-all duration-500"
    >
      <div
        className={`
          p-3 rounded-2xl transition-all duration-700 relative z-10
          ${active ? 'bg-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.1)]' : 'text-slate-400'}
        `}
        style={{ color: active ? color : undefined }}
      >
        {React.cloneElement(icon, {
          size: 20,
          strokeWidth: active ? 2.5 : 2
        })}
      </div>

      {active && (
        <motion.div
          layoutId="activeMobileNav"
          className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        />
      )}
    </motion.button>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const MobileDock: React.FC<MobileDockProps> = ({ isMaster, isConnected, activePath }) => {
  const systemColor = 'var(--system-color)';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 px-6 pb-6 pt-2 z-50">
      <div className="bg-white/90 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] h-20 flex items-center justify-around relative px-4">
        
        {/* LADO ESQUERDO */}
        <MobileNavItem 
          to="/dashboard" 
          icon={<LayoutDashboard />} 
          active={activePath === '/dashboard'} 
          color={systemColor} 
        />
        <MobileNavItem 
          to="/dashboard/wiki" 
          icon={<Book />} 
          active={activePath.includes('/wiki')} 
          color={systemColor} 
        />

        {/* BOTÃO CENTRAL DE STATUS (NÚCLEO) */}
        <div className="relative -top-8">
          <motion.div
            initial={false}
            animate={{ 
              backgroundColor: isConnected ? systemColor : '#94a3b8',
              boxShadow: isConnected 
                ? `0 15px 30px -5px ${isConnected ? 'rgba(var(--system-color-rgb), 0.4)' : 'transparent'}`
                : '0 10px 20px -5px rgba(0,0,0,0.1)'
            }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white transition-colors duration-500"
          >
            {isConnected ? (
              <Zap size={28} fill="white" className="animate-pulse" />
            ) : (
              <WifiOff size={28} />
            )}
            
            {/* Anel de Pulso Estático */}
            {isConnected && (
              <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-40" />
            )}
          </motion.div>
        </div>

        {/* LADO DIREITO */}
        <MobileNavItem 
          to="/dashboard/attributes" 
          icon={<Shield />} 
          active={activePath.includes('/attributes')} 
          color={systemColor} 
        />

        {isMaster ? (
          <MobileNavItem 
            to="/dashboard/master-panel" 
            icon={<Activity />} 
            active={activePath.includes('/master-panel')} 
            color={systemColor} 
          />
        ) : (
          <MobileNavItem 
            to="/dashboard/profile" 
            icon={<User />} 
            active={activePath.includes('/profile')} 
            color={systemColor} 
          />
        )}
      </div>
    </div>
  );
};