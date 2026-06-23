import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TokenBanner } from "@/components/TokenBanner";
import { getTrending } from "@/lib/birdeye";
import { BRAND } from "@/lib/brand";
import { price, pct } from "@/lib/format";
import { demoChart } from "@/lib/demo-data";
import type { Token } from "@/lib/types";

export const revalidate = 30;

function sparkPoints(token: Token, w: number, h: number): string {
  const pts = demoChart(token, 20);
  if (pts.length < 2) return "";
  const vals = pts.map((p) => p.value);
  const lo = Math.min(...vals);
  const span = Math.max(...vals) - lo || 1;
  return pts
    .map((p, i) => {
      const x = ((i / (pts.length - 1)) * w).toFixed(1);
      const y = (h - ((p.value - lo) / span) * (h - 4) - 2).toFixed(1);
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

export default async function Landing() {
  const { data: tokens } = await getTrending(20);
  const hot = tokens.slice(0, 3);
  const tradeLink = `/trade/${tokens[0]?.mint ?? "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-bg text-ink">
      {/* Header + hero share the same space background so header is truly transparent */}
      <div
        className="relative"
        style={{
          backgroundImage: "url(https://fomo.family/images/landing/space-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Dark overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-bg/55" />
        <SiteHeader />

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex min-h-[calc(100vh-72px)] flex-col items-center overflow-hidden"
      >
        {/* (background comes from parent div above) */}

        {/* Hero text */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/6 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-green" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
              Live on Solana
            </span>
          </div>

          <h1
            className="select-none font-display font-extrabold leading-[0.88] tracking-tighter text-white"
            style={{ fontSize: "clamp(90px, 21vw, 230px)" }}
          >
            chad.
          </h1>

          <p className="mt-5 font-display text-2xl font-bold text-white/90 sm:text-3xl">
            where legends trade solana.
          </p>
          <p className="mt-3 max-w-[420px] text-base leading-relaxed text-white/55 sm:text-lg">
            From memecoins to viral tokens — any Solana token in seconds.
            Self-custodial. No seed phrase.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={tradeLink}
              className="rounded-xl bg-green px-8 py-3.5 font-bold text-bg transition-all hover:scale-[1.02] hover:bg-green-press active:scale-[0.97]"
            >
              Start trading
            </Link>
            <a
              href={BRAND.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/15 bg-white/8 px-8 py-3.5 font-bold text-white backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/12"
            >
              Download app
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { v: "1,000+", l: "tokens" },
              { v: "0.25%", l: "fee" },
              { v: "< 400ms", l: "swaps" },
              { v: "Self-custodial", l: "your keys" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-lg border border-white/8 bg-white/5 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
              >
                <span className="font-semibold text-white">{s.v}</span>
                <span className="ml-1.5 text-white/45">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Astronaut — animated float, bigger */}
        <div className="relative z-0 w-full max-w-[640px] px-4 sm:max-w-[700px]">
          <div
            aria-hidden
            className="absolute bottom-6 left-1/2 h-10 w-56 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: "rgba(38,237,128,0.15)" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://fomo.family/images/landing/astronaut-mobile.webp"
            alt="Astronaut trading on Solana"
            className="relative z-10 w-full animate-float object-contain"
            style={{ animationDelay: "0.3s" }}
            loading="eager"
          />
        </div>
      </section>
      </div>{/* end space-bg wrapper */}

      {/* Scrolling ticker */}
      <TokenBanner tokens={tokens} speed={44} />

      {/* ══ PRODUCT SECTION ═════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32" style={{ background: "#060D1A" }}>
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-14 text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-green/25 bg-green/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-green">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-green" />
              Now available on web
            </p>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl xl:text-6xl">
              trade from anywhere.
              <br />
              never lose a beat.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted sm:text-lg">
              Open a trade on your phone, close it on your desktop — all synced instantly.
            </p>
          </div>

          {/* Mobile screens: single mobile app screenshot, centered */}
          <div className="mx-auto max-w-xs md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://fomo.family/images/landing/fomo-mobile-app.webp"
              alt="ChadWallet mobile app"
              className="w-full"
              loading="lazy"
            />
          </div>

          {/* Desktop screens: desktop screenshot with phone floating on top */}
          <div className="relative hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://fomo.family/images/landing/fomo-desktop.webp"
              alt="ChadWallet trading terminal"
              className="w-full rounded-2xl"
              loading="lazy"
            />
            {/* Phone overlay — floats on top of desktop, no bleed */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://fomo.family/images/landing/fomo-desktop-phone.webp"
              alt="ChadWallet mobile app"
              className="absolute bottom-4 right-4 w-[22%] animate-float xl:right-8 xl:w-[24%]"
              style={{ animationDelay: "1.2s" }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ══ HOT TOKENS ══════════════════════════════════════════════════════ */}
      <section className="bg-bg py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                Trending now
              </p>
              <h2 className="font-display text-2xl font-extrabold tracking-tight">
                Hot right now.
              </h2>
            </div>
            <Link href={tradeLink} className="text-sm text-faint transition-colors hover:text-ink">
              All tokens →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {hot.map((t) => {
              const sp = sparkPoints(t, 96, 32);
              const up = t.priceChange24h >= 0;
              const [fg, bg] = palette(t.symbol);
              return (
                <Link
                  key={t.mint}
                  href={`/trade/${t.mint}`}
                  className="group flex items-center justify-between rounded-2xl border border-hairline bg-surface/40 px-4 py-4 transition-all hover:scale-[1.01] hover:border-white/10 hover:bg-surface"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm font-black"
                      style={{ color: fg, background: bg }}
                    >
                      {t.symbol.slice(0, 2)}
                    </span>
                    <div>
                      <p className="font-bold">{t.symbol}</p>
                      <p className="tnum text-xs text-faint">{price(t.price)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`font-mono text-sm font-semibold ${up ? "text-green" : "text-red"}`}>
                      {pct(t.priceChange24h)}
                    </span>
                    <svg width="96" height="32" viewBox="0 0 96 32" aria-hidden>
                      <polyline points={sp} fill="none" stroke={up ? "#26ED80" : "#F44034"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ BENTO GRID ══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28" style={{ background: "#060D1A" }}>
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-faint">Why ChadWallet</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl">
              never miss out again
            </h2>
            <p className="mt-3 text-lg text-muted">the only social-first Solana trading app</p>
          </div>

          {/* Row 1: 2-col social card + 1-col alerts */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2"><BentoSocial /></div>
            <BentoAlerts />
          </div>
          {/* Row 2: 3 utility cards */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <BentoOnboarding />
            <BentoCustody />
            <BentoSpeed />
          </div>
        </div>
      </section>

      {/* ══ COMMUNITY ORBITAL ═══════════════════════════════════════════════ */}
      <OrbitalSection tradeLink={tradeLink} />

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <TokenBanner tokens={tokens} reverse speed={54} />
      <SiteFooter />
    </main>
  );
}

// ─── BentoCard — fomo.family style: clean dark card, zooms on hover ──────────
function BentoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl p-7 transition-transform duration-300 hover:scale-[1.025] ${className}`}
      style={{ background: "#0B1120" }}
    >
      {children}
    </div>
  );
}

// ─── BENTO SOCIAL (wide 2-col: leaderboard + feed side by side) ──────────────
const LEADERS = [
  { name: "jijo.sol", pnl: "+$1.72M", rank: 1, color: "#FFC400" },
  { name: "Cupsey", pnl: "+$1.23M", rank: 2, color: "#C0C0C0" },
  { name: "0xMonk", pnl: "+$810K", rank: 3, color: "#CD7F32" },
  { name: "DegenLiz", pnl: "+$685K", rank: 4, color: "#26ED80" },
];

const FEED_ITEMS = [
  { user: "threaddpay", badge: "Thesis", ago: "2m", text: "we're so back", meta: "$242.6K · +$23.2K" },
  { user: "collectible", badge: "Buy", ago: "8m", text: "BONK $34.3K @ 642M MC", meta: null },
  { user: "lesabre", badge: "Sell", ago: "23h", text: "SOL $4.5K @ 415B MC", meta: null },
];

function BentoSocial() {
  return (
    <BentoCard>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-blue">Social Trading</p>
          <h3 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">follow the best,<br />beat the rest.</h3>
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-1.5 rounded-pill border border-red/20 bg-red/8 px-2.5 py-1">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-red" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-red">Live</span>
        </div>
      </div>

      {/* Two-panel split */}
      <div className="grid flex-1 grid-cols-2 gap-4">
        {/* Leaderboard side */}
        <div className="flex flex-col gap-2">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Leaderboard · 30d</p>
          {LEADERS.map((l) => (
            <div key={l.name} className="group flex items-center gap-2.5 rounded-xl border border-white/4 bg-white/3 px-3 py-2.5 transition-colors hover:border-white/8 hover:bg-white/5">
              <div
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px] font-black"
                style={{ color: l.color, background: `${l.color}18` }}
              >
                {l.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-white/85">{l.name}</p>
              </div>
              <span className="tnum shrink-0 font-mono text-xs font-bold text-green">{l.pnl}</span>
            </div>
          ))}
        </div>

        {/* Feed side */}
        <div className="flex flex-col gap-2">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Live Feed</p>
          {FEED_ITEMS.map((f) => (
            <div key={f.user + f.ago} className="rounded-xl border border-white/4 bg-white/3 px-3 py-2.5">
              <div className="mb-1 flex items-center gap-1.5">
                <div
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[8px] font-bold"
                  style={{ background: "rgba(38,150,255,0.15)", color: "#2696FF" }}
                >
                  {f.user.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[11px] font-semibold text-white/80">{f.user}</span>
                <span
                  className="rounded px-1 py-px font-mono text-[8px] font-bold"
                  style={{
                    background: f.badge === "Buy" ? "rgba(38,237,128,0.1)" : f.badge === "Sell" ? "rgba(244,64,52,0.1)" : "rgba(255,255,255,0.07)",
                    color: f.badge === "Buy" ? "#26ED80" : f.badge === "Sell" ? "#F44034" : "#8A93A6",
                  }}
                >
                  {f.badge}
                </span>
                <span className="ml-auto text-[9px] text-faint">{f.ago}</span>
              </div>
              <p className="text-[11px] text-muted">{f.text}</p>
              {f.meta && <p className="mt-0.5 text-[10px] font-semibold text-green">{f.meta}</p>}
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

// ─── BENTO ALERTS ────────────────────────────────────────────────────────────
const ALERTS = [
  { token: "BONK", pct: "+12.4%", msg: "47 top traders bought $88.2K", time: "9:41", color: "#FFC400", dim: false },
  { token: "WIF", pct: "+8.7%", msg: "23 whales entered last hour", time: "9:38", color: "#26ED80", dim: true },
  { token: "POPCAT", pct: "+21.3%", msg: "Viral moment detected", time: "9:31", color: "#C084FC", dim: true },
];

function BentoAlerts() {
  return (
    <BentoCard>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#C084FC]">Smart Alerts</p>
      <h3 className="mb-5 font-display text-3xl font-extrabold leading-tight tracking-tight">
        real time notifications<br />for what&apos;s moving.
      </h3>

      {/* Phone notification mockup */}
      <div className="flex-1 rounded-xl border border-white/6 bg-white/3 p-3">
        {/* Fake iOS status bar */}
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[8px] text-faint">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-px">
              {[3, 4, 4, 3].map((h, i) => (
                <div key={i} className="w-[2px] rounded-sm bg-white/30" style={{ height: h }} />
              ))}
            </div>
            <div className="ml-1 h-2 w-3 rounded-sm border border-white/30">
              <div className="m-px h-full w-2/3 rounded-[1px] bg-white/40" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {ALERTS.map((a) => (
            <div
              key={a.token}
              className="rounded-xl border bg-white/3 p-2.5 transition-opacity"
              style={{
                opacity: a.dim ? 0.45 : 1,
                borderColor: a.dim ? "rgba(255,255,255,0.04)" : `${a.color}30`,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg" style={{ background: `${a.color}15` }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold" style={{ color: a.color }}>{a.token} {a.pct}</p>
                    <span className="text-[9px] text-faint">{a.time}</span>
                  </div>
                  <p className="text-[10px] text-faint">{a.msg}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

// ─── BENTO ONBOARDING ────────────────────────────────────────────────────────
function BentoOnboarding() {
  return (
    <BentoCard>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-blue">Easy Onboarding</p>
      <h3 className="font-display text-2xl font-extrabold tracking-tight leading-tight">create an account in an instant.</h3>
      <p className="mt-2 text-sm text-muted">No seed phrase. No wallet setup. Just sign in.</p>

      {/* Mock sign-in UI */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3 py-2.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-faint" aria-hidden>
            <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 8.586 6.414a2 2 0 002.828 0L22 7" />
          </svg>
          <span className="text-xs text-faint">your@email.com</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3 py-2.5">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.06H2.18a11 11 0 000 9.88z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
          </svg>
          <span className="text-xs text-white/70">Continue with Google</span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center gap-1.5 text-[10px] text-faint">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Protected by Privy · self-custodial · no seed phrase
        </div>
      </div>
    </BentoCard>
  );
}

// ─── BENTO CUSTODY ────────────────────────────────────────────────────────────
function BentoCustody() {
  return (
    <BentoCard>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-green">Zero Complexity</p>
      <h3 className="font-display text-2xl font-extrabold tracking-tight leading-tight">your keys,<br />your coins. always.</h3>

      {/* Visual: shield + key art */}
      <div className="my-4 flex items-center justify-center">
        <div className="relative">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-green/20 bg-green/8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#26ED80" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" fill="#26ED80" />
            </svg>
          </div>
          <div className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-green">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#020817" strokeWidth="3" aria-hidden>
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted">Privy MPC splits your key — we never hold it. No third party can access your wallet.</p>

      <div className="mt-auto pt-4">
        {[
          { label: "Non-custodial", ok: true },
          { label: "No seed phrase", ok: true },
          { label: "Privy MPC secured", ok: true },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-2 py-1">
            <div className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-green/15">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#26ED80" strokeWidth="3" aria-hidden>
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-muted">{row.label}</span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

// ─── BENTO SPEED ─────────────────────────────────────────────────────────────
function BentoSpeed() {
  return (
    <BentoCard>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#FFC400]">Instant Swaps</p>
      <h3 className="font-display text-2xl font-extrabold tracking-tight leading-tight">best price,<br />every time.</h3>

      {/* Big speed number */}
      <div className="my-5 text-center">
        <p className="font-display text-5xl font-black tracking-tighter" style={{ color: "#FFC400" }}>&lt;400ms</p>
        <p className="mt-1 font-mono text-[10px] text-faint uppercase tracking-widest">avg swap time</p>
      </div>

      {/* Mock swap flow */}
      <div className="rounded-xl border border-white/6 bg-white/3 p-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-white/6 bg-white/4 p-2">
            <span className="font-mono text-[9px] text-faint">You pay</span>
            <span className="font-bold text-sm text-white">1 SOL</span>
          </div>
          <div className="grid h-7 w-7 place-items-center rounded-full bg-green/10 text-green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-green/15 bg-green/5 p-2">
            <span className="font-mono text-[9px] text-green/60">You get</span>
            <span className="font-bold text-sm text-green">BONK</span>
          </div>
        </div>
        <p className="mt-2 text-center font-mono text-[9px] text-faint">Powered by Jupiter · best rate guaranteed</p>
      </div>
    </BentoCard>
  );
}

// ─── ORBITAL SECTION ─────────────────────────────────────────────────────────
// Two rings orbiting in opposite directions.
// Outer ring: CW 45s. Inner ring: CCW 30s.
// Avatar text counter-spins at the same rate so it stays upright.

const OUTER_TRADERS = [
  { initials: "JJ", color: "#26ED80", angle: 0 },
  { initials: "CP", color: "#2696FF", angle: 60 },
  { initials: "RM", color: "#C084FC", angle: 120 },
  { initials: "0X", color: "#FFC400", angle: 180 },
  { initials: "DL", color: "#F44034", angle: 240 },
  { initials: "SA", color: "#8EE1D1", angle: 300 },
];
const INNER_TRADERS = [
  { initials: "CK", color: "#26ED80", angle: 30 },
  { initials: "MA", color: "#C084FC", angle: 150 },
  { initials: "WL", color: "#FFC400", angle: 270 },
];

function OrbitalSection({ tradeLink }: { tradeLink: string }) {
  // Radii big enough that the inner ring clears the center text block
  const OUTER_R = 340;
  const INNER_R = 260;
  const SZ = 760;
  const C = SZ / 2; // 380

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-36"
      style={{
        background: "#04060F",
        backgroundImage: "url(https://fomo.family/images/landing/legends.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay to keep ChadWallet brand colors dominant */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(4,6,15,0.82)" }}
      />
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(38,150,255,0.07) 0%, rgba(38,237,128,0.04) 50%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5">
        {/* Orbital rings + animated avatar containers */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: SZ, height: SZ }}
        >
          {/* Static dashed rings */}
          <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`} className="absolute inset-0">
            <circle cx={C} cy={C} r={OUTER_R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="7 14" />
            <circle cx={C} cy={C} r={INNER_R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5 10" />
          </svg>

          {/* Outer ring — rotates CW; text counter-rotates to stay upright */}
          <div className="absolute inset-0" style={{ animation: "orbit-spin 45s linear infinite" }}>
            {OUTER_TRADERS.map((t) => {
              const rad = (t.angle * Math.PI) / 180;
              return (
                <div
                  key={t.initials + t.angle}
                  className="absolute grid h-12 w-12 place-items-center rounded-full border border-white/10"
                  style={{
                    left: C + OUTER_R * Math.cos(rad) - 24,
                    top: C + OUTER_R * Math.sin(rad) - 24,
                    background: `${t.color}14`,
                  }}
                >
                  <span
                    className="font-mono text-[11px] font-bold"
                    style={{ color: t.color, animation: "orbit-counter 45s linear infinite" }}
                  >
                    {t.initials}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Inner ring — rotates CCW; text counter-rotates CW */}
          <div className="absolute inset-0" style={{ animation: "orbit-counter 30s linear infinite" }}>
            {INNER_TRADERS.map((t) => {
              const rad = (t.angle * Math.PI) / 180;
              return (
                <div
                  key={t.initials + t.angle}
                  className="absolute grid h-9 w-9 place-items-center rounded-full border border-white/8"
                  style={{
                    left: C + INNER_R * Math.cos(rad) - 18,
                    top: C + INNER_R * Math.sin(rad) - 18,
                    background: `${t.color}10`,
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: t.color, animation: "orbit-spin 30s linear infinite" }}
                  >
                    {t.initials}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center copy — py keeps it clear of the inner ring vertically */}
        <div className="relative z-10 flex flex-col items-center gap-4 py-48 text-center sm:py-60">
          <h2 className="max-w-[360px] font-display text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl xl:text-[51px]">
            a trading app
            <br />
            for the rest of us
          </h2>
          <p className="text-base text-muted sm:text-lg">
            join 50,000 traders making their name on Solana
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link
              href={tradeLink}
              className="rounded-xl bg-green px-8 py-3.5 font-bold text-bg backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-green-press"
            >
              Start trading
            </Link>
            <a
              href={BRAND.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/12 bg-white/8 px-8 py-3.5 font-bold text-ink backdrop-blur-md transition-all hover:bg-white/12"
            >
              Download app
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

