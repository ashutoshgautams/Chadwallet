"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Token } from "@/lib/types";
import { price, pct } from "@/lib/format";

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

function TokenLogo({
  token,
  fg,
  bg,
}: {
  token: Token;
  fg: string;
  bg: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  if (token.logoURI && !imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={token.logoURI}
        alt={token.symbol}
        width={28}
        height={28}
        className="h-7 w-7 rounded-full object-cover"
        onError={() => setImgFailed(true)}
      />
    );
  }
  return (
    <span
      className="grid h-7 w-7 place-items-center rounded-full text-[9px] font-black"
      style={{ color: fg, background: bg }}
    >
      {token.symbol.slice(0, 2)}
    </span>
  );
}

export function TrendingList({
  tokens: initial,
  activeMint,
}: {
  tokens: Token[];
  activeMint: string;
}) {
  const [tokens, setTokens] = useState(initial);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/trending")
        .then((r) => r.json())
        .then((d) => alive && d?.tokens?.length && setTokens(d.tokens))
        .catch(() => {});
    load();
    const id = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-hairline bg-surface">
      <div className="border-b border-hairline px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
          Trending
        </span>
      </div>
      <div className="max-h-[70vh] overflow-y-auto no-scrollbar divide-y divide-hairline">
        {tokens.map((t) => {
          const active = t.mint === activeMint;
          const up = t.priceChange24h >= 0;
          const [fg, bg] = tokenColor(t.symbol);
          return (
            <Link
              key={t.mint}
              href={`/trade/${t.mint}`}
              className={`flex items-center justify-between px-4 py-3 transition-colors last:border-0 ${
                active
                  ? "bg-green/10"
                  : "hover:bg-surface-2"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TokenLogo token={t} fg={fg} bg={bg} />

                <div>
                  <div
                    className={`text-sm font-semibold ${
                      active ? "text-green" : "text-ink"
                    }`}
                  >
                    {t.symbol}
                  </div>
                  <div className="tnum text-[11px] text-faint">
                    {price(t.price)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-0.5">
                <span
                  className={`tnum text-xs font-semibold ${
                    up ? "text-green" : "text-red"
                  }`}
                >
                  {pct(t.priceChange24h)}
                </span>
                {active && (
                  <span className="h-1 w-1 rounded-full bg-green animate-pulse-dot" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
