import { useContext } from "react";
import { AuthContext } from "../contexts/auth/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser consumido dentro de um AuthProvider");
  }

  return context;
};