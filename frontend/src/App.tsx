import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ForgerPage } from './pages/ForgerPage';
import { Nexuspedia } from './pages/Nexuspedia';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthPage } from './pages/AuthPage';
import { WelcomePage } from './pages/WelcomePage';
import { MasterPanelPage } from './pages/Master/MasterPanelPage';
import { AdminPanelPage } from './pages/Admin/AdminPanelPage';

import { VaultProvider } from './contexts/vault/VaultProvider';
import { NexusProvider } from './contexts/nexus/NexusProvider';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { NotificationProvider } from './contexts/notification/NotificationProvider';
import { SocketProvider } from './contexts/socket/SocketProvider';
import { ConfirmProvider } from './contexts/confirm/ConfirmProvider';

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("@Nexus:Token");

  // Se o sinal for detectado, redireciona direto para o Dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const MasterGuard = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem("@Nexus:User") || "{}");

  // Se o usuário não for Mestre, ele é "expulso" para o dashboard comum
  if (user.role !== 'MASTER') {
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
                  <Routes>
                    {/* 🚫 ACESSO APENAS DESLOGADO */}
                    <Route path="/" element={<GuestGuard><ForgerPage /></GuestGuard>} />
                    <Route path="/auth" element={<GuestGuard><AuthPage /></GuestGuard>} />

                    {/* 🔐 DASHBOARD E SUB-PÁGINAS */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                      <Route index element={<WelcomePage />} />

                      {/* Acesso Público Logado */}
                      <Route path="wiki" element={<Nexuspedia />} />
                      <Route path="profile" element={<ProfilePage />} />

                      {/* 👑 ACESSO EXCLUSIVO: ARQUITETO (MASTER) */}
                      <Route path="master-panel" element={
                        <MasterGuard>
                          <MasterPanelPage />
                        </MasterGuard>
                      } />

                      <Route path='admin-panel' element={
                        <MasterGuard>
                          <AdminPanelPage />
                        </MasterGuard>
                      } />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </NexusProvider>
              </VaultProvider>
            </NotificationProvider>
          </ConfirmProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}