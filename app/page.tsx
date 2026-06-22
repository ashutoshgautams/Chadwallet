import Link from "next/link";
import { ChadMark } from "@/components/ChadMark";
import { SiteHeader } from "@/components/SiteHeader";
import { TokenBanner } from "@/components/TokenBanner";
import { Features } from "@/components/Features";
import { StoreButtons } from "@/components/StoreButtons";
import { getTrending } from "@/lib/birdeye";
import { demoChart } from "@/lib/demo-data";
import { BRAND } from "@/lib/brand";
import { price, pct, usd } from "@/lib/format";
import type { Token, PricePoint } from "@/lib/types";

export const revalidate = 30;

// Build a compact polyline points string for mini sparklines (server-side, no deps).
function sparkPoints(pts: PricePoint[], w: number, h: number): string {
  if (pts.length < 2) return "";
  const vals = pts.map((p) => p.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  return pts
    .map((p, i) => {
      const x = ((i / (pts.length - 1)) * w).toFixed(1);
      const y = (h - ((p.value - lo) / span) * (h - 4) - 2).toFixed(1);
      return `${x},${y}`;
    })
    .join(" ");
}

// ────────────────────────────────────────────────────────────────────────────

export default async function Landing() {
  const { data: tokens, source } = await getTrending(20);
  const hot = tokens.slice(0, 3);

  return (
    <main className="min-h-screen bg-bg text-ink">
      <SiteHeader />
      <TokenBanner tokens={tokens} speed={42} />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Grid pattern backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-pattern" />

        {/* Ambient glow orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-48 -top-32 h-[700px] w-[700px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(38,237,128,0.18) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-8 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(38,150,255,0.10) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-16 sm:pt-24">
          <div className="text-center">
            {/* Live badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-pill border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-green">
              <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse-dot" />
              LIVE · Trending tokens updated every 30s
            </div>

            <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-[1.0] tracking-tight sm:text-7xl lg:text-[88px]">
              Find the next{" "}
              <span className="text-gradient-green">100×</span>
              <br />
              memecoin.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              Trade trending Solana tokens in seconds. Follow KOL traders who win
              consistently. Never miss the next breakout.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
                className="glow-green animate-glow rounded-pill bg-green px-8 py-4 text-base font-bold text-bg transition-all hover:scale-[1.03] hover:bg-green-press active:scale-[0.97]"
              >
                Open the terminal →
              </Link>
              <a
                href={BRAND.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill border border-hairline px-8 py-4 text-base font-medium text-ink transition-all hover:border-green/40 hover:bg-surface active:scale-[0.97]"
              >
                Download the app
              </a>
            </div>

            {source === "demo" && (
              <p className="mt-5 inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface px-3 py-1 font-mono text-[11px] text-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                preview data · add a BirdEye key for live prices
              </p>
            )}
          </div>

          {/* Dashboard preview strip */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border border-hairline bg-surface/60 p-1 shadow-2xl ring-1 ring-black/30 backdrop-blur-sm">
              {/* Terminal bar */}
              <div className="flex items-center gap-1.5 rounded-xl border-b border-hairline px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green/60" />
                <span className="ml-3 font-mono text-[11px] text-faint">
                  chadwallet.xyz/trade
                </span>
                <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse-dot" />
                  LIVE
                </span>
              </div>

              {/* Mini trade preview */}
              <div className="grid grid-cols-3 divide-x divide-hairline overflow-hidden rounded-xl">
                {/* Left: Trending */}
                <div className="hidden py-3 sm:block">
                  <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                    Trending
                  </div>
                  {hot.map((t) => (
                    <div key={t.mint} className="flex items-center justify-between px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <MiniAvatar symbol={t.symbol} />
                        <span className="text-xs font-semibold">{t.symbol}</span>
                      </div>
                      <span className={`tnum text-[10px] font-semibold ${t.priceChange24h >= 0 ? "text-green" : "text-red"}`}>
                        {pct(t.priceChange24h)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Middle: Chart */}
                <div className="col-span-2 p-4 sm:col-span-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-display text-sm font-bold">{hot[0]?.symbol ?? "BONK"}</span>
                    <span className="tnum text-[11px] text-green">
                      {pct(hot[0]?.priceChange24h ?? 12.4)}
                    </span>
                  </div>
                  <div className="tnum text-xs font-semibold">{price(hot[0]?.price ?? 0.0000247)}</div>
                  <svg
                    viewBox="0 0 200 60"
                    className="mt-2 w-full"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#26ED80" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#26ED80" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {hot[0] && (() => {
                      const pts = demoChart(hot[0], 24);
                      const sp = sparkPoints(pts, 200, 60);
                      const last = sp.split(" ").pop()?.split(",") ?? ["200", "20"];
                      return (
                        <>
                          <polygon
                            points={`0,60 ${sp} ${last[0]},60`}
                            fill="url(#hero-fill)"
                          />
                          <polyline
                            points={sp}
                            fill="none"
                            stroke="#26ED80"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx={last[0]} cy={last[1]} r="2.5" fill="#26ED80" />
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Right: Buy panel */}
                <div className="hidden p-4 sm:block">
                  <div className="mb-3 flex gap-1 rounded-pill bg-bg p-0.5 text-xs">
                    <span className="flex-1 rounded-pill bg-green py-1.5 text-center font-bold text-bg">
                      Buy
                    </span>
                    <span className="flex-1 py-1.5 text-center text-muted">Sell</span>
                  </div>
                  <div className="rounded-xl border border-hairline bg-bg px-3 py-2 font-mono text-sm text-ink">
                    0.5 SOL
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    {["0.1", "0.5", "1"].map((v) => (
                      <div key={v} className="rounded-lg border border-hairline bg-bg py-1 text-center font-mono text-[10px] text-muted">
                        {v}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl bg-green py-2 text-center text-xs font-bold text-bg">
                    Buy {hot[0]?.symbol ?? "BONK"}
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom blur fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent" />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────── */}
      <section className="border-y border-hairline bg-surface/30">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-hairline sm:grid-cols-4 sm:divide-x">
          {[
            { label: "Total volume traded", value: "$2.4B" },
            { label: "Active traders", value: "94,200+" },
            { label: "Tokens tracked", value: "8,400+" },
            { label: "Best token this week", value: "+2,847%", green: true },
          ].map(({ label, value, green }) => (
            <div
              key={label}
              className="flex flex-col items-center py-8 px-4 text-center"
            >
              <span
                className={`font-display text-2xl font-extrabold sm:text-3xl ${
                  green ? "text-green" : "text-ink"
                }`}
              >
                {value}
              </span>
              <span className="mt-1.5 text-[11px] text-faint">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOT RIGHT NOW ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">
              Trending now
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hot right now 🔥
            </h2>
          </div>
          <Link
            href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
            className="hidden rounded-pill border border-hairline px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-green/40 hover:text-ink sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {hot.map((token) => {
            const pts = demoChart(token, 28);
            const sp = sparkPoints(pts, 120, 44);
            const up = token.priceChange24h >= 0;
            return (
              <HotTokenCard key={token.mint} token={token} sp={sp} up={up} />
            );
          })}
        </div>
      </section>

      {/* ── KOL ACTIVITY FEED ─────────────────────────────────────────── */}
      <section className="border-y border-hairline bg-surface/20">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">
                Social
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Follow the winners
              </h2>
            </div>
            <div className="hidden items-center gap-1.5 rounded-pill border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-green sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse-dot" />
              Live
            </div>
          </div>
          <KolGrid />
        </div>
      </section>

      {/* ── BRIGHT PROMO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-promo">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-mono text-sm font-semibold uppercase tracking-[0.15em] text-bg/60">
                #1 Solana trading app
              </p>
              <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight text-bg sm:text-5xl">
                Trade from anywhere.
                <br />
                Never lose a beat.
              </h2>
              <p className="mt-5 max-w-md text-lg text-bg/70">
                Open a trade on your phone, close it on your desktop. Your
                positions, holdings, and rewards — always in sync.
              </p>
              <StoreButtons className="mt-9" />
            </div>
            <div className="flex justify-center">
              <PhonePeek token={hot[0]} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <Features />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">
            Simple
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Trading that just works
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Connect in one tap",
              body: "Sign in with Apple or Google. ChadWallet creates a self-custodial Solana wallet for you — no seed phrases required.",
            },
            {
              n: "02",
              title: "Find trending tokens",
              body: "Browse the live trending feed powered by real on-chain data. See price charts, holders, and live trades before you commit.",
            },
            {
              n: "03",
              title: "Trade in seconds",
              body: "Jupiter-routed swaps give you the best price across all Solana DEXes. Review your quote, then confirm with one tap.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="group rounded-3xl border border-hairline bg-surface/60 p-7 transition-all hover:border-green/30 hover:bg-surface"
            >
              <span className="font-mono text-4xl font-extrabold text-green/20 group-hover:text-green/40 transition-colors">
                {step.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-green/15 bg-surface/50 px-6 py-20 text-center">
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="h-[320px] w-[320px] rounded-full blur-[80px]"
              style={{ background: "rgba(38,237,128,0.08)" }}
            />
          </div>
          <ChadMark className="relative mx-auto mb-7 h-16 w-16 text-green" />
          <h2 className="relative font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Get ChadWallet today.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-muted">
            Join thousands of traders making their name on Solana. Never miss
            the next breakout.
          </p>
          <StoreButtons className="relative mt-9 justify-center" />
        </div>
      </section>

      <TokenBanner tokens={tokens} reverse speed={52} />
      <SiteFooter />
    </main>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function MiniAvatar({ symbol }: { symbol: string }) {
  const hash = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = ["#26ED80", "#2696FF", "#8EE1D1", "#F44034", "#FFC400"][hash % 5];
  return (
    <span
      className="grid h-5 w-5 place-items-center rounded-full text-[8px] font-black text-bg"
      style={{ background: bg }}
    >
      {symbol.slice(0, 2)}
    </span>
  );
}

function TokenAvatar({
  symbol,
  size = 44,
}: {
  symbol: string;
  size?: number;
}) {
  const hash = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const palettes: [string, string][] = [
    ["#26ED80", "#0E3D27"],
    ["#2696FF", "#0A2040"],
    ["#8EE1D1", "#0D2E2A"],
    ["#F44034", "#3A1411"],
    ["#FFC400", "#3A2E00"],
    ["#C084FC", "#2D1A4A"],
  ];
  const [fg, bg] = palettes[hash % palettes.length];
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-full font-display font-black"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        color: fg,
        background: bg,
      }}
    >
      {symbol.slice(0, 2)}
    </span>
  );
}

function HotTokenCard({
  token,
  sp,
  up,
}: {
  token: Token;
  sp: string;
  up: boolean;
}) {
  const stroke = up ? "#26ED80" : "#F44034";
  return (
    <Link
      href={`/trade/${token.mint}`}
      className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface p-5 transition-all hover:border-green/30 hover:bg-surface-2 hover:shadow-[0_0_32px_rgba(38,237,128,0.06)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TokenAvatar symbol={token.symbol} size={44} />
          <div>
            <div className="font-display text-base font-bold">{token.symbol}</div>
            <div className="text-xs text-faint">{token.name}</div>
          </div>
        </div>
        <span
          className={`rounded-pill px-2.5 py-1 text-xs font-bold ${
            up ? "bg-green/10 text-green" : "bg-red/10 text-red"
          }`}
        >
          {pct(token.priceChange24h)}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <div className="tnum text-xl font-bold">{price(token.price)}</div>
          <div className="tnum mt-1 text-xs text-faint">
            {usd(token.volume24h)} vol 24h
          </div>
        </div>
        <svg
          width="120"
          height="44"
          viewBox="0 0 120 44"
          aria-hidden
          className="shrink-0"
        >
          <polyline
            points={sp}
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-5 rounded-pill border border-hairline bg-bg py-2.5 text-center text-sm font-semibold text-muted transition-all group-hover:border-green group-hover:bg-green group-hover:text-bg">
        Trade →
      </div>
    </Link>
  );
}

const KOL_FEED = [
  { name: "jijo.sol", handle: "@jijo", action: "bought", token: "BONK", amount: "$12,400", time: "2m ago", up: true },
  { name: "Cupsey", handle: "@cups", action: "sold", token: "WIF", amount: "$8,200", time: "5m ago", up: false },
  { name: "Roman", handle: "@roman", action: "bought", token: "MOODENG", amount: "$6,800", time: "9m ago", up: true },
  { name: "0xMonk", handle: "@monk", action: "bought", token: "POPCAT", amount: "$21,000", time: "14m ago", up: true },
  { name: "DegenLiz", handle: "@liz", action: "sold", token: "MEW", amount: "$3,400", time: "22m ago", up: false },
  { name: "SolApe", handle: "@ape", action: "bought", token: "JUP", amount: "$9,100", time: "31m ago", up: true },
];

function KolGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {KOL_FEED.map((t, i) => {
        const hash = t.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        const avatarColors = ["#26ED80", "#2696FF", "#8EE1D1", "#C084FC", "#F44034", "#FFC400"];
        const av = avatarColors[hash % avatarColors.length];
        return (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl border border-hairline bg-surface px-4 py-4 transition-colors hover:border-green/20 hover:bg-surface-2"
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm font-black text-bg"
                style={{ background: av }}
              >
                {t.name[0]}
              </span>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-[11px] text-faint">{t.handle}</div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-sm font-bold ${
                  t.up ? "text-green" : "text-red"
                }`}
              >
                {t.action} {t.token}
              </div>
              <div className="tnum text-[11px] text-faint">
                {t.amount} · {t.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PhonePeek({ token }: { token?: Token }) {
  const sym = token?.symbol ?? "BONK";
  const tok = token?.price ?? 0.0000247;
  const chg = token?.priceChange24h ?? 12.4;
  const up = chg >= 0;

  return (
    <div className="relative animate-float">
      {/* Phone shell */}
      <div className="w-[268px] rounded-[2.4rem] border-[6px] border-bg bg-bg shadow-2xl ring-1 ring-black/30">
        <div className="overflow-hidden rounded-[1.9rem] bg-bg">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <span className="font-mono text-[10px] text-faint">9:41</span>
            <ChadMark className="h-4 w-4 text-ink" />
            <span className="font-mono text-[10px] text-faint">●●●</span>
          </div>

          <div className="px-5 pb-5 pt-2">
            {/* Token chip */}
            <div className="flex items-center gap-2.5">
              <TokenAvatar symbol={sym} size={36} />
              <div>
                <div className="font-display text-sm font-bold">{sym}</div>
                <div className="text-[10px] text-faint">{token?.name ?? "Bonk"}</div>
              </div>
            </div>

            {/* Price */}
            <div className="mt-4">
              <div className="tnum text-2xl font-bold">{price(tok)}</div>
              <div className={`tnum text-xs ${up ? "text-green" : "text-red"}`}>
                {up ? "▲" : "▼"} {Math.abs(chg).toFixed(1)}% today
              </div>
            </div>

            {/* Sparkline */}
            <svg viewBox="0 0 230 80" className="mt-4 w-full" aria-hidden>
              <defs>
                <linearGradient id="ph-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#26ED80" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#26ED80" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="0,80 0,72 20,66 40,70 60,42 80,54 100,32 120,46 140,20 160,30 180,10 200,22 230,14 230,80"
                fill="url(#ph-fill)"
              />
              <polyline
                points="0,72 20,66 40,70 60,42 80,54 100,32 120,46 140,20 160,30 180,10 200,22 230,14"
                fill="none"
                stroke="#26ED80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="230" cy="14" r="3" fill="#26ED80" />
            </svg>

            {/* Buy bar */}
            <div className="mt-4 flex gap-1.5 rounded-pill bg-surface p-1 text-xs">
              <span className="flex-1 rounded-pill bg-green py-2 text-center font-bold text-bg">
                Buy
              </span>
              <span className="flex-1 py-2 text-center text-muted">Sell</span>
            </div>
            <div className="mt-2 rounded-xl border border-hairline bg-surface px-3 py-2 font-mono text-sm">
              0.5 SOL
            </div>
            <div className="mt-2 rounded-pill bg-green py-2.5 text-center text-sm font-bold text-bg">
              Buy {sym}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div
        className="absolute -right-6 top-20 animate-float rounded-2xl border border-hairline bg-surface px-3 py-2 text-xs shadow-xl ring-1 ring-black/20"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="font-bold text-green">+2,847%</div>
        <div className="text-[10px] text-faint">SLERF last week</div>
      </div>

      {/* Floating badge 2 */}
      <div
        className="absolute -left-8 bottom-28 animate-float rounded-2xl border border-hairline bg-surface px-3 py-2 text-xs shadow-xl ring-1 ring-black/20"
        style={{ animationDelay: "2.4s" }}
      >
        <div className="font-bold text-ink">KOL just bought</div>
        <div className="tnum text-[10px] text-green">$14,200 BONK</div>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <ChadMark className="h-6 w-6 text-muted" />
          <span className="font-display text-sm font-bold text-muted">
            ChadWallet
          </span>
        </Link>
        <p className="text-xs text-faint">
          The #1 meme coin trading app on Solana. You own your crypto.
        </p>
        <div className="flex gap-5 text-xs text-muted">
          <a
            href={BRAND.twitter}
            className="hover-underline transition-colors hover:text-ink"
          >
            X / Twitter
          </a>
          <a
            href={BRAND.site}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-underline transition-colors hover:text-ink"
          >
            Website
          </a>
          <Link
            href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
            className="hover-underline transition-colors hover:text-ink"
          >
            Trade
          </Link>
        </div>
      </div>
      <div className="mt-8 border-t border-hairline pt-6 text-center font-mono text-[10px] text-faint">
        Not financial advice. Trade responsibly. Self-custodial — you hold your
        keys.
      </div>
    </footer>
  );
}
