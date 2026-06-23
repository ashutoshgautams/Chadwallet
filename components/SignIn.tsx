"use client";

import { useLogin } from "@privy-io/react-auth";
import { useAuth } from "./AuthProvider";

export function SignIn() {
  const { ready, authenticated, email, logout } = useAuth();

  const { login } = useLogin({
    onComplete: () => {},
    onError: () => {},
  });

  if (!ready) {
    return <div className="h-9 w-24 animate-pulse rounded-pill bg-surface" />;
  }

  if (authenticated) {
    return (
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2 rounded-pill border border-hairline bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-green/40"
      >
        <span className="h-2 w-2 rounded-full bg-green" />
        {email?.split("@")[0] ?? "account"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => login()}
      className="rounded-pill bg-green px-7 py-2.5 text-sm font-bold text-bg transition-all hover:scale-[1.02] hover:bg-green-press active:scale-[0.97]"
    >
      Login
    </button>
  );
}
