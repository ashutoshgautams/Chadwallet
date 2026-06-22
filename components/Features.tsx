import type { ReactNode } from "react";

function Feature({
  icon,
  title,
  body,
  visual,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  visual: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-hairline bg-surface/60 p-6 transition-all duration-300 hover:border-green/25 hover:bg-surface hover:shadow-[0_0_40px_rgba(38,237,128,0.05)]">
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green/5 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-bg">
        {visual}
      </div>

      <div className="flex items-center gap-2.5">
        <span className="text-green">{icon}</span>
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">
        Why ChadWallet
      </p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        The edge serious traders use.
      </h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Feature
          icon={<KolIcon />}
          title="Follow KOL traders"
          body="See what top traders are buying in real time. Follow winning strategies and grow your profit with confidence."
          visual={<KolVisual />}
        />
        <Feature
          icon={<TrendIcon />}
          title="Catch early trends"
          body="Monitor large trades and momentum as it happens. Access tokens before they hit everyone else's radar."
          visual={<TrendVisual />}
        />
        <Feature
          icon={<TradeIcon />}
          title="Trade in seconds"
          body="Buy trending tokens 24/7 with a tap. Live Jupiter quotes, real routes, and price impact shown before you commit."
          visual={<TradeVisual />}
        />
      </div>
    </section>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────

function KolIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function TradeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ── Feature visuals ──────────────────────────────────────────────────────────

function KolVisual() {
  const rows = [
    { n: "jijo.sol", a: "bought", v: "$12,400", up: true, pct: "+184%" },
    { n: "Cupsey", a: "sold", v: "$8,200", up: false, pct: "-12%" },
    { n: "Roman", a: "bought", v: "$6,800", up: true, pct: "+340%" },
  ];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2.5 px-5">
      {rows.map((r) => (
        <div key={r.n} className="flex items-center justify-between rounded-xl bg-surface/70 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-[9px] font-black text-muted">
              {r.n[0]}
            </span>
            <div>
              <div className="text-[11px] font-semibold">{r.n}</div>
              <div className={`text-[10px] ${r.up ? "text-green" : "text-red"}`}>
                {r.a} · {r.pct}
              </div>
            </div>
          </div>
          <span className="tnum text-[11px] font-semibold">{r.v}</span>
        </div>
      ))}
    </div>
  );
}

function TrendVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <svg viewBox="0 0 200 80" className="w-full" aria-hidden>
        <defs>
          <linearGradient id="feat-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26ED80" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#26ED80" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points="0,80 0,70 25,60 50,64 75,40 100,46 125,24 150,30 175,10 200,16 200,80"
          fill="url(#feat-fill)"
        />
        <polyline
          points="0,70 25,60 50,64 75,40 100,46 125,24 150,30 175,10 200,16"
          fill="none"
          stroke="#26ED80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="200" cy="16" r="3.5" fill="#26ED80" />
        {/* Volume bars */}
        {[10, 25, 30, 14, 22, 38, 18, 42].map((h, i) => (
          <rect
            key={i}
            x={i * 26}
            y={80 - h * 0.4}
            width="14"
            height={h * 0.4}
            fill="rgba(38,237,128,0.08)"
            rx="2"
          />
        ))}
      </svg>
    </div>
  );
}

function TradeVisual() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 px-5">
      <div className="flex gap-1.5 rounded-pill bg-bg p-1">
        <span className="flex-1 rounded-pill bg-green py-2 text-center text-xs font-bold text-bg">
          Buy
        </span>
        <span className="flex-1 py-2 text-center text-xs text-muted">Sell</span>
      </div>
      <div className="rounded-xl border border-hairline bg-bg px-3 py-2.5 font-mono text-sm text-ink">
        0.5 SOL
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {["0.1 SOL", "0.5 SOL", "1 SOL"].map((v) => (
          <div
            key={v}
            className="rounded-lg border border-hairline bg-bg py-1.5 text-center font-mono text-[10px] text-muted"
          >
            {v}
          </div>
        ))}
      </div>
      <div className="rounded-pill bg-green py-2.5 text-center text-xs font-bold text-bg">
        Review trade
      </div>
    </div>
  );
}
