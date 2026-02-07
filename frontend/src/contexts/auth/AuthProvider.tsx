import React, { useState, useCallback } from "react";
import { AuthContext, type User } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import { triggerHaptic } from "../../utils/triggerHaptic";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Inicialização segura: tenta recuperar o usuário do storage
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("@Nexus:User");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback((data: { token: string; user: User }) => {
    localStorage.setItem("@Nexus:Token", data.token);
    localStorage.setItem("@Nexus:User", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    // Limpeza seletiva para não afetar outras possíveis configs do app
    localStorage.removeItem("@Nexus:Token");
    localStorage.removeItem("@Nexus:User");
    setUser(null);

    triggerHaptic("MEDIUM")

    navigate('/auth', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signed: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};