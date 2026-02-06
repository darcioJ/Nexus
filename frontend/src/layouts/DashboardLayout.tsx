import React, { useMemo, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout & UI
import { Sidebar } from '../components/layout/Sidebar';
import { MobileDock } from '../components/layout/MobileDock';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { DossierAtmosphere } from '../components/shared/DossierAtmosphere';

// Hooks de Contexto (Nexus Core)
import { useNexus } from '../hooks/useNexus';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // 1. SINCRONIZAÇÃO DE CANAIS
  // O useNexus agora é o seu "Hub Central" de dados prontos
  const {
    character,
    equippedWeapon,
    isConnected,
    isSyncing,
    lastPulse
  } = useNexus();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Monitor de Redimensionamento (Hardware Check)
  useEffect(() => {
    const handleResize = () => {
      const large = window.innerWidth >= 1024;
      setIsDesktop(large);
      if (large) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMaster = user?.role === 'MASTER';

  // 2. CONSOLIDAÇÃO DO ESTADO (PRISMA READY)
  // O isSyncing já engloba: Loading da Ficha + Loading do Vault + Conexão Socket
  const isSystemReady = !isSyncing && (isMaster || !!character);

  // 3. CALIBRAGEM ESTÉTICA DINÂMICA
  const systemColors = useMemo(() => {
    // Frequência de Comando (Mestre)
    if (isMaster) return { color: '#f59e0b' }; // Amber

    // Frequência de Operação (Jogador)
    // Se a arma está populada pelo useNexus, a essência já está no 'essenceId'
    const activeColor = equippedWeapon?.essenceId?.colorVar || '#06b6d4';

    return { color: activeColor };
  }, [equippedWeapon, isMaster]);

  // 3. TRAVA DE SEGURANÇA: Se não estiver pronto, LoadingScreen Total
  if (!isSystemReady) {
    return <LoadingScreen message="Sincronizando Link Neural com o Vault..." />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-dvh w-full flex flex-col lg:flex-row overflow-hidden bg-slate-50/30 antialiased relative"
        style={{
          '--system-color': systemColors.color,
          '--system-color-alpha': `${systemColors.color}20`
        } as React.CSSProperties}
      >
        <DossierAtmosphere step={5} />

        {/* 2. SIDEBAR HÍBRIDA: Agora ela recebe o controle de abertura */}
        <Sidebar
          isMaster={isMaster}
          character={character}
          isConnected={isConnected}
          activePath={location.pathname}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isDesktop={isDesktop}
        />

        <main className="flex-1 flex flex-col relative z-20 overflow-hidden">

          {/* 3. HEADER: Adicionado gatilho onMenuClick */}
          <DashboardHeader
            character={character}
            isConnected={isConnected}
            currentPath={location.pathname}
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />

            <div className="p-4 md:p-10 lg:p-16 relative z-10 max-w-7xl mx-auto w-full">
              <Outlet context={{ character, isConnected, lastPulse }} />
            </div>
          </div>

          <div className="lg:hidden">
            <MobileDock
              isMaster={isMaster}
              isConnected={isConnected}
              activePath={location.pathname}
            />
          </div>
        </main>

        <div className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-(--system-color) to-transparent opacity-[0.05] pointer-events-none top-0 animate-scan z-50" />
      </motion.div>
    </AnimatePresence>
  );
};