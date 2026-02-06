import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  detail?: string;
  color?: string;
  pulse?: boolean;
  trend?: 'up' | 'down' | 'stable';
}

export const StatCard = React.memo(({ 
  label, 
  value, 
  icon, 
  detail, 
  color = "var(--color-admin-panel)", 
  pulse,
  trend 
}: StatCardProps) => {
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group bg-white/50 backdrop-blur-xl border border-white rounded-[2rem] p-4 lg:p-5 flex items-center gap-4 overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]"
      style={{ 
        boxShadow: `0 10px 20px -10px ${color}20` 
      }}
    >
      {/* --- REFRAÇÃO LATERAL (Sutil) --- */}
      <div 
        className="absolute left-0 top-1/4 w-1 h-1/2 rounded-r-full opacity-40 group-hover:opacity-100 transition-all duration-500"
        style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
      />

      {/* --- ICON CONTAINER (Miniaturizado) --- */}
      <div 
        className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-slate-50 border border-white flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105"
        style={{ color: color }}
      >
        <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: color }} />
        <div className="relative z-10">
          {React.cloneElement(icon as React.ReactElement, { size: 22, strokeWidth: 2.5 })}
        </div>
      </div>

      {/* --- DATA CONTENT (Compact Stack) --- */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[8px] lg:text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none truncate">
            {label}
          </p>
          {pulse && (
            <span className="flex h-1 w-1 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
              <span className="relative inline-flex rounded-full h-1 w-1" style={{ backgroundColor: color }} />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span 
            className="text-xl lg:text-2xl font-black italic tracking-tighter leading-none"
            style={{ color: color }}
          >
            {value}
          </span>
          
          {trend && (
            <span className={`text-[10px] ${
              trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-slate-300'
            }`}>
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'}
            </span>
          )}
        </div>

        {detail && (
          <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest italic mt-1 group-hover:text-slate-400 transition-colors truncate">
            {detail}
          </span>
        )}
      </div>

      {/* --- MARCA D'ÁGUA (Subliminar) --- */}
      <div className="absolute top-2 right-4 opacity-[0.03] pointer-events-none select-none">
        <span className="font-mono text-[8px] font-bold text-slate-900 italic tracking-tighter uppercase">Nexus_Data</span>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';