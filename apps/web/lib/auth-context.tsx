"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "AGENT" | "ADMIN";
};

type LoginResponse = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: AuthUser;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  async function login(email: string, password: string) {
    const result = await api<LoginResponse>("/auth/login", {
      method: "POST",
      body: {
        email: email.trim().toLowerCase(),
        password,
      },
    });

    setToken(result.accessToken);
    setUser(result.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}