"use client";

import type { Token } from "@/lib/types";
import { price, pct, usd } from "@/lib/format";

const AVATAR_PALETTES: [string, string][] = [
  ["#26ED80", "#0D3320"],
  ["#2696FF", "#0A2040"],
  ["#8EE1D1", "#0D2E2A"],
  ["#F44034", "#3A1411"],
  ["#FFC400", "#3A2E00"],
  ["#C084FC", "#2D1A4A"],
];

function tokenColor(symbol: string): [string, string] {
  const hash = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

export function TokenHeader({ token }: { token: Token }) {
  const up = token.priceChange24h >= 0;
  const [fg, bg] = tokenColor(token.symbol);

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {token.logoURI ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={token.logoURI}
              alt={token.symbol}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span
              className="inline-grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-lg font-black"
              style={{ color: fg, background: bg }}
            >
              {token.symbol.slice(0, 2)}
            </span>
          )}
          <div>
            <div className="font-display text-xl font-bold">{token.symbol}</div>
            <div className="text-xs text-faint">{token.name}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="tnum text-2xl font-bold">{price(token.price)}</div>
          <div
            className={`tnum mt-0.5 inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-sm font-semibold ${
              up
                ? "bg-green/10 text-green"
                : "bg-red/10 text-red"
            }`}
          >
            {up ? "▲" : "▼"} {pct(token.priceChange24h)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <Stat label="Market cap" value={usd(token.marketCap)} />
        <Stat label="24h volume" value={usd(token.volume24h)} />
        <Stat label="Liquidity" value={usd(token.liquidity)} />
        <Stat
          label="Holders"
          value={token.holders ? token.holders.toLocaleString() : "—"}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-faint">{label}</div>
      <div className="tnum mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}
