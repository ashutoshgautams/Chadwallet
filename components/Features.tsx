import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Apple-style alternating feature panels.
 * Each one owns a full section of the page with one clear visual + one clear claim.
 * No card grids, no bullet lists — just bold statements and precise visuals.
 */
export function Features() {
  return (
    <div>
      <FeaturePanel
        eyebrow="Terminal"
        headline="Every Solana token. Live. In one place."
        body="Real-time price data from BirdEye, routed through Jupiter for the best swap price across every DEX on Solana. No extra tabs, no browser extensions, no compromises."
        cta={{ label: "Open terminal", href: "/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" }}
        visual={<TerminalVisual />}
        flip={false}
      />
      <div className="mx-auto max-w-6xl">
        <div className="h-px bg-hairline" />
      </div>
      <FeaturePanel
        eyebrow="Social"
        headline="See who's winning before you trade."
        body="ChadWallet surfaces the traders with the best track records. Watch their moves unfold in real time, follow their wallets, and understand the conviction behind each trade."
        cta={{ label: "See top traders", href: "/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" }}
        visual={<SocialVisual />}
        flip={true}
      />
      <div className="mx-auto max-w-6xl">
        <div className="h-px bg-hairline" />
      </div>
      <FeaturePanel
        eyebrow="Self-custodial"
        headline="Your keys. Your crypto. Always."
        body="Privy embeds a real Solana wallet directly in the app — no seed phrases to write down, no exchange accounts. Sign in with Apple or Google and you own your tokens from the first second."
        cta={{ label: "Learn more", href: "https://privy.io", external: true }}
        visual={<CustodyVisual />}
        flip={false}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function FeaturePanel({
  eyebrow,
  headline,
  body,
  cta,
  visual,
  flip,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  cta: { label: string; href: string; external?: boolean };
  visual: ReactNode;
  flip: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div
        className={`grid items-center gap-12 lg:grid-cols-2 ${
          flip ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Text column */}
        <div className="max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{body}</p>
          <div className="mt-8">
            {cta.external ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
              >
                {cta.label} →
              </a>
            ) : (
              <Link
                href={cta.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
              >
                {cta.label} →
              </Link>
            )}
          </div>
        </div>

        {/* Visual column */}
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface/40">
          {visual}
        </div>
      </div>
    </section>
  );
}

// ─── Feature visuals ─────────────────────────────────────────────────────────

function TerminalVisual() {
  const tokens = [
    { sym: "BONK", price: "$0.0₃247", chg: "+12.4%", up: true },
    { sym: "WIF",  price: "$1.84",    chg: "-3.1%",  up: false },
    { sym: "JUP",  price: "$0.62",    chg: "+5.8%",  up: true },
    { sym: "POPCAT", price: "$0.41",  chg: "+8.0%",  up: true },
  ];
  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
          Trending · Solana
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-green">
          <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse-dot" />
          Live
        </span>
      </div>

      {/* Token rows */}
      <div className="divide-y divide-hairline">
        {tokens.map((t) => (
          <div key={t.sym} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <TokenDot symbol={t.sym} />
              <span className="font-semibold">{t.sym}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="tnum text-sm font-semibold">{t.price}</span>
              <span
                className={`tnum w-16 text-right text-sm font-semibold ${
                  t.up ? "text-green" : "text-red"
                }`}
              >
                {t.chg}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini chart underneath */}
      <div className="mt-4 rounded-xl border border-hairline bg-bg p-4">
        <p className="mb-2 text-xs text-faint">BONK · 15m</p>
        <svg viewBox="0 0 300 80" className="w-full" aria-hidden>
          <defs>
            <linearGradient id="feat-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#26ED80" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#26ED80" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points="0,80 0,68 40,58 80,64 120,38 160,46 200,26 240,34 280,12 300,16 300,80"
            fill="url(#feat-fill)"
          />
          <polyline
            points="0,68 40,58 80,64 120,38 160,46 200,26 240,34 280,12 300,16"
            fill="none"
            stroke="#26ED80"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="300" cy="16" r="3" fill="#26ED80" />
        </svg>
      </div>
    </div>
  );
}

function SocialVisual() {
  const traders = [
    { name: "jijo.sol",   roi: "+2,847%", trades: 142, badge: "🏆" },
    { name: "0xMonk",     roi: "+1,204%", trades: 89,  badge: "🥈" },
    { name: "DegenLiz",   roi: "+891%",   trades: 216, badge: "🥉" },
    { name: "SolApe",     roi: "+634%",   trades: 55,  badge: "·" },
  ];
  const activity = [
    { name: "jijo.sol", action: "bought", token: "BONK", amt: "$12.4K", up: true },
    { name: "0xMonk",   action: "bought", token: "POPCAT", amt: "$21K", up: true },
    { name: "Cupsey",   action: "sold",   token: "WIF",  amt: "$8.2K", up: false },
  ];
  const colors = ["#26ED80", "#2696FF", "#8EE1D1", "#C084FC"];

  return (
    <div className="p-6">
      {/* Leaderboard */}
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-faint">
        Top traders · 30 days
      </p>
      <div className="mb-5 divide-y divide-hairline">
        {traders.map((t, i) => (
          <div key={t.name} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">{t.badge}</span>
              <span
                className="grid h-7 w-7 place-items-center rounded-full font-display text-[10px] font-black text-bg"
                style={{ background: colors[i % colors.length] }}
              >
                {t.name[0].toUpperCase()}
              </span>
              <span className="text-sm font-semibold">{t.name}</span>
            </div>
            <span className="tnum text-sm font-semibold text-green">{t.roi}</span>
          </div>
        ))}
      </div>

      {/* Live activity */}
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-faint">
        Live activity
      </p>
      <div className="space-y-2">
        {activity.map((a, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-bg px-3 py-2">
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full font-display text-[8px] font-black text-bg"
              style={{ background: colors[i % colors.length] }}
            >
              {a.name[0].toUpperCase()}
            </span>
            <span className="text-xs text-muted">{a.name}</span>
            <span className={`text-xs ${a.up ? "text-green" : "text-red"}`}>
              {a.action}
            </span>
            <span className="text-xs font-semibold">{a.token}</span>
            <span className="ml-auto tnum text-xs text-faint">{a.amt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustodyVisual() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-10 text-center">
      {/* Lock icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-bg">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <p className="font-display text-xl font-bold">Non-custodial</p>
      <p className="mt-2 max-w-xs text-sm text-muted">
        Your private key is generated on your device, encrypted by Privy, and
        never held by ChadWallet or anyone else.
      </p>

      {/* Steps */}
      <div className="mt-8 w-full space-y-3 text-left">
        {[
          { step: "Sign in", detail: "Apple or Google — one tap" },
          { step: "Wallet created", detail: "Self-custodial Solana address" },
          { step: "Trade", detail: "Your keys sign every transaction" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-bg px-4 py-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green/10 font-mono text-[10px] font-bold text-green">
              {i + 1}
            </span>
            <div>
              <span className="text-sm font-semibold">{s.step}</span>
              <span className="ml-2 text-xs text-faint">{s.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenDot({ symbol }: { symbol: string }) {
  const PALETTES: [string, string][] = [
    ["#26ED80", "#0D3320"],
    ["#2696FF", "#0A2040"],
    ["#8EE1D1", "#0D2E2A"],
    ["#F44034", "#3A1411"],
    ["#FFC400", "#3A2E00"],
    ["#C084FC", "#2D1A4A"],
  ];
  const h = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const [fg, bg] = PALETTES[h % PALETTES.length];
  return (
    <span
      className="grid h-6 w-6 place-items-center rounded-full font-display text-[8px] font-black"
      style={{ color: fg, background: bg }}
    >
      {symbol.slice(0, 2)}
    </span>
  );
}
