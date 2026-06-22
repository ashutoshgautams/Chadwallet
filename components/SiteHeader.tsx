"use client";

import Link from "next/link";
import { ChadMark } from "./ChadMark";
import { SignIn } from "./SignIn";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header
      className={`sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-bg/80 px-5 backdrop-blur-md ${
        compact ? "py-3" : "py-4"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
        <ChadMark className="h-7 w-7 text-ink" />
        <span className="font-display text-lg font-bold tracking-tight">
          ChadWallet
        </span>
      </Link>

      <nav className="flex items-center gap-1">
        <Link
          href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
          className="hidden rounded-pill px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink sm:block"
        >
          Terminal
        </Link>
        <a
          href="https://apps.apple.com/us/app/chadwallet/id6757367474"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-pill px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink md:block"
        >
          Get app
        </a>
        <SignIn />
      </nav>
    </header>
  );
}
