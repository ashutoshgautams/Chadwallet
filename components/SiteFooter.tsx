import Link from "next/link";
import { ChadMark } from "./ChadMark";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="bg-bg px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-12 lg:gap-20">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-70">
              <ChadMark className="h-8 w-8 text-ink" />
              <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
                ChadWallet
              </span>
            </Link>
            <p className="mt-3 text-base text-faint">where legends trade solana.</p>
            <p className="mt-10 text-sm text-faint/50">
              © {new Date().getFullYear()} ChadWallet Inc.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-faint/60">
              About
            </h4>
            <ul className="space-y-4">
              {["Blog", "FAQ", "Affiliates"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-base text-muted/60 transition-colors hover:text-ink">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-faint/60">
              Social
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Discord", href: "https://discord.gg/chadwallet" },
                { label: "X/Twitter", href: BRAND.twitter },
                { label: "Instagram", href: "#" },
                { label: "YouTube", href: "#" },
                { label: "LinkedIn", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-muted/60 transition-colors hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-faint/60">
              Legal
            </h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-base text-muted/60 transition-colors hover:text-ink">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
