import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PLAYER' | 'MASTER';
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);