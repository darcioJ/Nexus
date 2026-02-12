import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ForgerPage } from './pages/ForgerPage';
import { Nexuspedia } from './pages/Nexuspedia/Nexuspedia';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthPage } from './pages/AuthPage';
import { WelcomePage } from './pages/WelcomePage';
import { MasterPanelPage } from './pages/Master/MasterPanelPage';
import { AdminPanelPage } from './pages/Admin/AdminPanelPage';
import { GameOverviewPage } from './pages/GameOverviewPage';

import { VaultProvider } from './contexts/vault/VaultProvider';
import { NexusProvider } from './contexts/nexus/NexusProvider';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { NotificationProvider } from './contexts/notification/NotificationProvider';
import { SocketProvider } from './contexts/socket/SocketProvider';
import { ConfirmProvider } from './contexts/confirm/ConfirmProvider';
import { ForgerProvider } from './contexts/forger/ForgerProvider';
import { ArchiveProvider } from "./contexts/archive/ArchiveProvider";

import { LoadingScreen } from './components/common/LoadingScreen';

import { useAuth } from './hooks/useAuth';
import { useNotification } from './hooks/useNotification';

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { signed, loading } = useAuth();

  // 📡 Enquanto o link neural não estabiliza, mostramos o loading
  if (loading) return <LoadingScreen message="Autenticando Sinal..." />;

  // Se já está logado, não faz sentido estar no Login/Forger
  if (signed) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { signed, loading } = useAuth();

  if (loading) return <LoadingScreen message="Verificando Credenciais..." />;

  // 🚫 Se o sinal cair (logout), expulsa imediatamente
  if (!signed) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

const MasterGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { notifyError } = useNotification(); // Opcional

  if (loading) return <LoadingScreen message="Acessando Nível Master..." />;

  if (user?.role !== 'MASTER') {
    notifyError(null, "Acesso Negado: Nível de autorização insuficiente.");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ConfirmProvider>
            <NotificationProvider>
              <VaultProvider>
                <NexusProvider>
                  <ForgerProvider>
                    <ArchiveProvider>
                      <Routes>
                        {/* 🚫 ZONA PÚBLICA (Apenas deslogados) */}
                        <Route path="/" element={<GuestGuard><ForgerPage /></GuestGuard>} />
                        <Route path="/auth" element={<GuestGuard><AuthPage /></GuestGuard>} />
                        <Route path="/game-overview" element={<AuthGuard><GameOverviewPage /></AuthGuard>} />

                        {/* 🔐 ZONA PROTEGIDA (Apenas logados) */}
                        <Route
                          path="/dashboard"
                          element={
                            <AuthGuard>
                              <DashboardLayout />
                            </AuthGuard>
                          }
                        >
                          <Route index element={<WelcomePage />} />
                          <Route path="wiki" element={<Nexuspedia />} />
                          <Route path="profile" element={<ProfilePage />} />
                          {/* 👑 SUBSSETOR MASTER */}
                          <Route path="master-panel" element={<MasterGuard><MasterPanelPage /></MasterGuard>} />
                          <Route path='admin-panel' element={<MasterGuard><AdminPanelPage /></MasterGuard>} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </ArchiveProvider>
                  </ForgerProvider>
                </NexusProvider>
              </VaultProvider>
            </NotificationProvider>
          </ConfirmProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}