import React, { useState, useCallback, useEffect } from "react";
import { AuthContext, type User } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import { triggerHaptic } from "../../utils/triggerHaptic";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 🛰️ Disjuntor de segurança

  // PROTOCOLO DE BOOT: Sincronia de Disco
  useEffect(() => {
    const loadStoredData = () => {
      const savedUser = localStorage.getItem("@Nexus:User");
      const savedToken = localStorage.getItem("@Nexus:Token");

      if (savedUser && savedToken) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("❌ Nexus_Core: Erro ao decodificar sinal de usuário.");
          localStorage.clear(); // Limpa rádio se o dado estiver corrompido
        }
      }

      // 🔓 Libera os Guardiões (Independente de ter user ou não)
      setLoading(false);
    };

    loadStoredData();
  }, []);

  const login = useCallback((data: { token: string; user: User }) => {
    localStorage.setItem("@Nexus:Token", data.token);
    localStorage.setItem("@Nexus:User", JSON.stringify(data.user));

    setUser(data.user);
    // Nota: O loading já estará false aqui
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("@Nexus:Token");
    localStorage.removeItem("@Nexus:User");

    setUser(null);
    triggerHaptic("MEDIUM");

    navigate('/auth', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signed: !!user,
      loading // 💎 Agora os Guards conseguem ouvir este sinal
    }}>
      {children}
    </AuthContext.Provider>
  );
};