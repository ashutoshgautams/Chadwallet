"use client";

import Link from "next/link";
import { ChadMark } from "./ChadMark";
import { SignIn } from "./SignIn";
import { BRAND } from "@/lib/brand";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header
      className={`relative z-40 flex items-center justify-between px-8 ${
        compact ? "py-3.5" : "py-5"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <ChadMark className="h-7 w-7 text-ink" />
        <span className="font-display text-xl font-bold tracking-tight">
          ChadWallet
        </span>
      </Link>

      {/* Right nav */}
      <nav className="flex items-center gap-2.5">
        {/* App Store */}
        <a
          href={BRAND.appStore}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on the App Store"
          className="hidden items-center gap-2 rounded-lg border border-white/15 bg-white/6 px-4 py-2 text-sm font-semibold text-ink/80 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10 hover:text-ink sm:flex"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.89-1.75.03-3.37 1.02-4.27 2.59-1.82 3.16-.47 7.84 1.31 10.41.87 1.26 1.9 2.67 3.26 2.62 1.31-.05 1.8-.85 3.38-.85 1.58 0 2.02.85 3.4.82 1.4-.02 2.29-1.28 3.15-2.55.99-1.46 1.4-2.88 1.42-2.95-.03-.01-2.72-1.04-2.75-4.14M14.5 4.4c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.32-.58 3.04-1.45" />
          </svg>
          App Store
        </a>

        {/* Google Play */}
        <a
          href={BRAND.playStore}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play"
          className="hidden items-center gap-2 rounded-lg border border-white/15 bg-white/6 px-4 py-2 text-sm font-semibold text-ink/80 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10 hover:text-ink md:flex"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
            <path fill="#00D9FF" d="M3.6 2.2c-.3.3-.5.7-.5 1.3v17c0 .6.2 1 .5 1.3l.1.1L13 12.6v-.2L3.7 2.1z" />
            <path fill="#00F076" d="M16.4 15.8 13 12.4v-.2l3.4-3.4.1.1 4 2.3c1.2.6 1.2 1.7 0 2.4z" />
            <path fill="#FF3A44" d="M16.5 15.7 13 12.3 3.6 21.8c.4.4 1 .5 1.8.1z" />
            <path fill="#FFC400" d="M16.5 8.9 5.4 2.1c-.8-.4-1.4-.4-1.8.1l9.4 9.4z" />
          </svg>
          Google Play
        </a>

        {/* Terminal link */}
        <Link
          href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
          className="hidden rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink lg:block"
        >
          Terminal
        </Link>

        <SignIn />
      </nav>
    </header>
  );
}
