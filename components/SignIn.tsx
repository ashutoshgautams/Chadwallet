"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./AuthProvider";

export function SignIn() {
  const { ready, authenticated, email, login, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!ready) {
    return <div className="h-9 w-20 animate-pulse rounded-pill bg-surface" />;
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-pill bg-green px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-green-press"
      >
        Sign in
      </button>

      {open &&
        createPortal(
          /* Rendered into document.body — escapes sticky header's stacking context */
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-title"
            className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative w-full max-w-sm rounded-3xl border border-hairline bg-surface p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close sign in dialog"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {/* Header */}
              <h2 id="signin-title" className="font-display text-xl font-bold">
                Sign in to trade
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Your wallet is created for you instantly. You own your
                crypto — it stays yours.
              </p>

              {/* Auth buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => { login(); setOpen(false); }}
                  className="flex items-center justify-center gap-2.5 rounded-pill bg-ink px-4 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.01] active:scale-[0.98]"
                >
                  <AppleGlyph />
                  Continue with Apple
                </button>
                <button
                  type="button"
                  onClick={() => { login(); setOpen(false); }}
                  className="flex items-center justify-center gap-2.5 rounded-pill border border-hairline bg-surface-2 px-4 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.01] active:scale-[0.98]"
                >
                  <GoogleGlyph />
                  Continue with Google
                </button>
              </div>

              <p className="mt-5 text-center text-[11px] text-faint">
                Secured by Privy · self-custodial · no seed phrase
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function AppleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.89-1.75.03-3.37 1.02-4.27 2.59-1.82 3.16-.47 7.84 1.31 10.41.87 1.26 1.9 2.67 3.26 2.62 1.31-.05 1.8-.85 3.38-.85 1.58 0 2.02.85 3.4.82 1.4-.02 2.29-1.28 3.15-2.55.99-1.46 1.4-2.88 1.42-2.95-.03-.01-2.72-1.04-2.75-4.14M14.5 4.4c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.32-.58 3.04-1.45" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
