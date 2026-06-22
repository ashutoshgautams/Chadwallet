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

function sparkPoints(pts: PricePoint[], w: number, h: number): string {
  if (pts.length < 2) return "";
  const vals = pts.map((p) => p.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  return pts
    .map((p, i) => {
      const x = ((i / (pts.length - 1)) * w).toFixed(1);
      const y = (h - ((p.value - lo) / span) * (h - 2) - 1).toFixed(1);
      return `${x},${y}`;
    })
    .join(" ");
}

const PALETTES: [string, string][] = [
  ["#26ED80", "#0D3320"],
  ["#2696FF", "#0A2040"],
  ["#8EE1D1", "#0D2E2A"],
  ["#F44034", "#3A1411"],
  ["#FFC400", "#3A2E00"],
  ["#C084FC", "#2D1A4A"],
];
function palette(symbol: string): [string, string] {
  const h = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTES[h % PALETTES.length];
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function Landing() {
  const { data: tokens, source } = await getTrending(20);
  const hero = tokens[0];
  const hot = tokens.slice(0, 3);

  return (
    <main className="min-h-screen bg-bg text-ink selection:bg-green/20">
      <SiteHeader />

      {/* ══ HERO — the price IS the design ══════════════════════════════════ */}
      <section className="relative flex min-h-[88vh] flex-col justify-between overflow-hidden">
        {/* Very subtle radial vignette at top center — no gimmick, just depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-hairline to-transparent"
        />

        {/* Center content */}
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-20 sm:py-28">
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse-dot" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-faint">
              {hero?.name ?? "Trending"} · Solana · Live
            </span>
            {source === "demo" && (
              <span className="ml-2 rounded-pill border border-hairline px-2 py-0.5 font-mono text-[10px] text-faint">
                demo data
              </span>
            )}
          </div>

          {/* The number — this IS the hero */}
          <div className="overflow-hidden">
            <p className="font-mono text-6xl font-black leading-none tracking-tighter text-ink sm:text-8xl lg:text-[116px] xl:text-[140px]">
              {price(hero?.price ?? 0.0000247)}
            </p>
          </div>

          {/* Token + change on the same baseline */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {hero?.symbol ?? "BONK"}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 font-mono text-sm font-semibold ${
                (hero?.priceChange24h ?? 12.4) >= 0
                  ? "bg-green/10 text-green"
                  : "bg-red/10 text-red"
              }`}
            >
              {(hero?.priceChange24h ?? 12.4) >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(hero?.priceChange24h ?? 12.4).toFixed(1)}% today
            </span>
            {hero?.volume24h && (
              <span className="font-mono text-sm text-faint">
                {usd(hero.volume24h)} vol
              </span>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={`/trade/${hero?.mint ?? "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"}`}
              className="inline-flex items-center gap-2 rounded-pill bg-green px-7 py-3.5 font-semibold text-bg transition-all hover:scale-[1.02] hover:bg-green-press active:scale-[0.97]"
            >
              Trade {hero?.symbol ?? "BONK"}
              <ArrowRight />
            </Link>
            <Link
              href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
              className="inline-flex items-center gap-2 rounded-pill border border-hairline px-7 py-3.5 font-medium text-muted transition-all hover:border-white/20 hover:text-ink"
            >
              Open terminal
            </Link>
          </div>
        </div>

        {/* Wide chart stripe — the "atmospheric" element */}
        <HeroChart token={hero} />

        {/* Token ticker at the base of the hero */}
        <TokenBanner tokens={tokens} speed={44} />
      </section>

      {/* ══ DIVIDER ══════════════════════════════════════════════════════════ */}
      <div className="h-px bg-hairline" />

      {/* ══ HOT RIGHT NOW ════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-faint">
              Trending now
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hot right now.
            </h2>
          </div>
          <Link
            href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
            className="hidden text-sm text-muted transition-colors hover:text-ink sm:block"
          >
            All tokens →
          </Link>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          {hot.map((t) => {
            const pts = demoChart(t, 30);
            const sp = sparkPoints(pts, 100, 36);
            const up = t.priceChange24h >= 0;
            const [fg, bg] = palette(t.symbol);
            return (
              <Link
                key={t.mint}
                href={`/trade/${t.mint}`}
                className="group rounded-2xl border border-hairline bg-surface/40 p-5 transition-all hover:border-white/10 hover:bg-surface"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm font-black"
                      style={{ color: fg, background: bg }}
                    >
                      {t.symbol.slice(0, 2)}
                    </span>
                    <div>
                      <p className="font-display font-bold">{t.symbol}</p>
                      <p className="text-xs text-faint">{t.name}</p>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      up ? "text-green" : "text-red"
                    }`}
                  >
                    {pct(t.priceChange24h)}
                  </span>
                </div>

                {/* Price + sparkline */}
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="tnum text-xl font-bold">{price(t.price)}</p>
                    <p className="tnum mt-0.5 text-xs text-faint">
                      {usd(t.volume24h)} vol
                    </p>
                  </div>
                  <svg
                    width="100"
                    height="36"
                    viewBox="0 0 100 36"
                    aria-hidden
                    className="shrink-0 opacity-80"
                  >
                    <polyline
                      points={sp}
                      fill="none"
                      stroke={up ? "#26ED80" : "#F44034"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Trade button — appears on hover */}
                <div className="mt-4 h-9 overflow-hidden rounded-pill border border-hairline text-center text-sm font-semibold leading-9 text-faint transition-all group-hover:border-green/30 group-hover:bg-green/5 group-hover:text-green">
                  Trade →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-hairline" />

      {/* ══ FEATURES — Apple alternating sections ════════════════════════════ */}
      <Features />

      <div className="h-px bg-hairline" />

      {/* ══ LIVE TRADE STREAM ════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <header className="mb-12">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-faint">
            Social
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Follow the winners.
          </h2>
          <p className="mt-3 max-w-md text-muted">
            See exactly what top traders are buying and selling in real time.
            Copy their moves, find your edge.
          </p>
        </header>

        <TradeStream />
      </section>

      <div className="h-px bg-hairline" />

      {/* ══ APP DOWNLOAD ═════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-faint">
              Mobile
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your terminal.
              <br />
              In your pocket.
            </h2>
            <p className="mt-4 text-muted">
              Same live charts, same Jupiter routing, same KOL feeds — on iOS
              and Android. Positions sync instantly across all your devices.
            </p>
            <StoreButtons className="mt-8" />
          </div>

          {/* Compact app preview strip */}
          <AppPreview token={hero} />
        </div>
      </section>

      <div className="h-px bg-hairline" />

      {/* ══ FINAL CTA ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="flex flex-col items-center text-center">
          <ChadMark className="mb-7 h-12 w-12 text-ink" />
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ready to find
            <br />
            your next 100×?
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted">
            Join traders making their name on Solana every day. Start in
            seconds.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
              className="rounded-pill bg-green px-8 py-4 font-semibold text-bg transition-all hover:scale-[1.02] hover:bg-green-press"
            >
              Open the terminal
            </Link>
            <a
              href={BRAND.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill border border-hairline px-8 py-4 font-medium text-muted transition-all hover:border-white/20 hover:text-ink"
            >
              Download the app
            </a>
          </div>
        </div>
      </section>

      {/* ══ BOTTOM TICKER + FOOTER ═══════════════════════════════════════════ */}
      <TokenBanner tokens={tokens} reverse speed={54} />
      <SiteFooter />
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Wide chart stripe across the bottom of the hero — atmospheric, not decorative. */
function HeroChart({ token }: { token?: Token }) {
  const pts = token ? demoChart(token, 80) : [];
  if (pts.length < 2) return null;
  const vals = pts.map((p) => p.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  const H = 96;
  const W = 1440;

  const coords = pts.map((p, i) => ({
    x: ((i / (pts.length - 1)) * W).toFixed(1),
    y: (H - ((p.value - lo) / span) * (H - 8) - 4).toFixed(1),
  }));
  const polyline = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const polygon = `0,${H} ${polyline} ${W},${H}`;
  const up = vals[vals.length - 1] >= vals[0];
  const stroke = up ? "#26ED80" : "#F44034";

  return (
    <div className="w-full overflow-hidden opacity-30">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: H }}
        aria-hidden
      >
        <defs>
          <linearGradient id="hero-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={polygon} fill="url(#hero-chart-fill)" />
        <polyline
          points={polyline}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

const STREAM_ITEMS = [
  { name: "jijo.sol", action: "bought", token: "BONK", amt: "$12,400", time: "2m", up: true },
  { name: "Cupsey", action: "sold", token: "WIF", amt: "$8,200", time: "5m", up: false },
  { name: "Roman", action: "bought", token: "MOODENG", amt: "$6,800", time: "9m", up: true },
  { name: "0xMonk", action: "bought", token: "POPCAT", amt: "$21,000", time: "14m", up: true },
  { name: "DegenLiz", action: "sold", token: "MEW", amt: "$3,400", time: "22m", up: false },
  { name: "SolApe", action: "bought", token: "JUP", amt: "$9,100", time: "31m", up: true },
  { name: "cryptoKev", action: "bought", token: "BONK", amt: "$4,750", time: "38m", up: true },
  { name: "moon_alice", action: "sold", token: "BODEN", amt: "$2,100", time: "45m", up: false },
];

function TradeStream() {
  return (
    <div className="divide-y divide-hairline rounded-2xl border border-hairline overflow-hidden">
      {STREAM_ITEMS.map((item, i) => {
        const namehash = item.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        const colors = ["#26ED80", "#2696FF", "#8EE1D1", "#C084FC", "#F44034", "#FFC400"];
        const av = colors[namehash % colors.length];
        return (
          <div
            key={i}
            className="flex items-center justify-between bg-surface/20 px-5 py-4 transition-colors hover:bg-surface/50"
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-xs font-black text-bg"
                style={{ background: av }}
              >
                {item.name[0].toUpperCase()}
              </span>
              <div>
                <span className="text-sm font-semibold">{item.name}</span>
                <span className="mx-2 text-faint">·</span>
                <span className={`text-sm ${item.up ? "text-green" : "text-red"}`}>
                  {item.action}
                </span>
                <span className="ml-1.5 text-sm font-semibold">{item.token}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <span className="tnum text-sm font-semibold">{item.amt}</span>
              <span className="tnum w-8 text-xs text-faint">{item.time}m</span>
            </div>
          </div>
        );
      })}
      <div className="bg-surface/20 px-5 py-4 text-center">
        <Link
          href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          Open the terminal to see live trades →
        </Link>
      </div>
    </div>
  );
}

function AppPreview({ token }: { token?: Token }) {
  const sym = token?.symbol ?? "BONK";
  const px = token?.price ?? 0.0000247;
  const chg = token?.priceChange24h ?? 12.4;
  const up = chg >= 0;
  const [fg] = palette(sym);

  return (
    <div className="relative shrink-0">
      {/* App chrome */}
      <div className="w-[240px] overflow-hidden rounded-[2rem] border border-hairline bg-surface shadow-2xl">
        {/* Mini status bar */}
        <div className="flex items-center justify-between border-b border-hairline px-5 py-2.5">
          <span className="font-mono text-[10px] text-faint">9:41</span>
          <ChadMark className="h-4 w-4 text-ink" />
          <span className="font-mono text-[10px] text-faint">●●●</span>
        </div>

        <div className="p-5">
          {/* Token row */}
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold">{sym}</span>
            <span
              className={`rounded-pill px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                up ? "text-green" : "text-red"
              }`}
            >
              {up ? "+" : ""}{chg.toFixed(1)}%
            </span>
          </div>

          {/* Price */}
          <p className="tnum mt-3 text-2xl font-black" style={{ color: fg }}>
            {price(px)}
          </p>

          {/* Tiny chart */}
          <svg viewBox="0 0 200 60" className="mt-3 w-full" aria-hidden>
            <defs>
              <linearGradient id="app-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#26ED80" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#26ED80" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points="0,60 0,54 30,48 60,52 90,34 120,40 150,22 170,28 200,14 200,60"
              fill="url(#app-fill)"
            />
            <polyline
              points="0,54 30,48 60,52 90,34 120,40 150,22 170,28 200,14"
              fill="none"
              stroke="#26ED80"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Buy/sell tabs */}
          <div className="mt-3 flex gap-1 rounded-pill bg-bg p-0.5 text-xs">
            <span className="flex-1 rounded-pill bg-green py-2 text-center font-semibold text-bg">
              Buy
            </span>
            <span className="flex-1 py-2 text-center text-faint">Sell</span>
          </div>

          {/* Amount */}
          <div className="mt-2 rounded-xl border border-hairline bg-bg px-3 py-2 font-mono text-sm text-ink">
            0.5 SOL
          </div>

          <button type="button" className="mt-2 w-full rounded-pill bg-green py-2.5 text-sm font-semibold text-bg">
            Buy {sym}
          </button>
        </div>
      </div>

      {/* Floating trade confirmation badge */}
      <div className="absolute -right-4 bottom-20 rounded-2xl border border-hairline bg-bg px-3 py-2.5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-green/15 text-center font-mono text-[10px] leading-5 text-green">
            ✓
          </span>
          <div>
            <p className="text-xs font-semibold">Trade simulated</p>
            <p className="tnum text-[10px] text-faint">Jupiter · 0.001% impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-10 sm:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <ChadMark className="h-5 w-5 text-muted" />
          <span className="font-display text-sm font-bold text-muted">ChadWallet</span>
        </Link>
        <p className="text-xs text-faint">
          Not financial advice. Self-custodial. You hold your keys.
        </p>
        <div className="flex gap-5 text-xs text-muted">
          <a href={BRAND.twitter} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
            X / Twitter
          </a>
          <a href={BRAND.site} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
            Website
          </a>
          <Link href="/trade/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" className="transition-colors hover:text-ink">
            Terminal
          </Link>
        </div>
      </div>
    </footer>
  );
}
