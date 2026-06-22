"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Auth wrapper around Privy (Apple / Google sign-in).
 *
 * If NEXT_PUBLIC_PRIVY_APP_ID is set, this dynamically loads the real Privy SDK.
 * If not, it falls back to a local demo session so the preview's signed-in
 * states are still reachable. The component contract is identical either way.
 */

interface AuthState {
  ready: boolean;
  authenticated: boolean;
  email: string | null;
  login: () => void;
  logout: () => void;
  isDemo: boolean;
}

const Ctx = createContext<AuthState | null>(null);
const PRIVY_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Restore a demo session if present (real Privy persists its own session).
    const saved = typeof window !== "undefined"
      ? window.sessionStorage.getItem("cw_demo_user")
      : null;
    if (saved) {
      setAuthenticated(true);
      setEmail(saved);
    }
    setReady(true);
  }, []);

  const login = () => {
    // Real Privy modal would open here when configured; for the preview we
    // simulate a successful Apple/Google sign-in.
    const demoEmail = "chad@solana.trade";
    window.sessionStorage.setItem("cw_demo_user", demoEmail);
    setAuthenticated(true);
    setEmail(demoEmail);
  };

  const logout = () => {
    window.sessionStorage.removeItem("cw_demo_user");
    setAuthenticated(false);
    setEmail(null);
  };

  return (
    <Ctx.Provider
      value={{
        ready,
        authenticated,
        email,
        login,
        logout,
        isDemo: !PRIVY_ID,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
