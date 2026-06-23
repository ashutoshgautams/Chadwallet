"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface AuthState {
  ready: boolean;
  authenticated: boolean;
  email: string | null;
  logout: () => void;
  /** Only used by legacy callers — prefer useLogin() from @privy-io/react-auth for new code. */
  login: () => void;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const email =
    user?.email?.address ??
    user?.google?.email ??
    user?.apple?.email ??
    null;

  return (
    <Ctx.Provider value={{ ready, authenticated, email, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
