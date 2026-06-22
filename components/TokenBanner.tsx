"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Token } from "@/lib/types";
import { price, pct } from "@/lib/format";
import { DEMO_TOKENS } from "@/lib/demo-data";

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

/**
 * Infinite horizontal token rail. Tapping a token opens its trade page.
 * The track is duplicated so the marquee loops seamlessly; `reverse` runs
 * the bottom rail the other way for a subtle counter-scroll.
 */
export function TokenBanner({
  tokens: initial,
  reverse = false,
  speed = 40,
}: {
  tokens?: Token[];
  reverse?: boolean;
  speed?: number;
}) {
  const [tokens, setTokens] = useState<Token[]>(initial ?? DEMO_TOKENS);

  useEffect(() => {
    let alive = true;
    fetch("/api/trending")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.tokens?.length) setTokens(d.tokens);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const row = [...tokens, ...tokens];

  return (
    <div className="relative overflow-hidden border-y border-hairline bg-surface/30 py-2">
      <div
        className="flex w-max gap-2 animate-marquee no-scrollbar"
        style={
          {
            "--marquee-duration": `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {row.map((t, i) => {
          const [fg, bg] = tokenColor(t.symbol);
          const up = t.priceChange24h >= 0;
          return (
            <Link
              key={`${t.mint}-${i}`}
              href={`/trade/${t.mint}`}
              className="group flex shrink-0 items-center gap-2 rounded-pill border border-hairline bg-surface px-3 py-1.5 transition-all hover:border-green/40 hover:bg-surface-2"
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[8px] font-black"
                style={{ background: bg, color: fg }}
              >
                {t.symbol.slice(0, 2)}
              </span>
              <span className="text-xs font-semibold text-ink">{t.symbol}</span>
              <span className="tnum text-xs text-muted">{price(t.price)}</span>
              <span
                className={`tnum text-xs font-semibold ${
                  up ? "text-green" : "text-red"
                }`}
              >
                {pct(t.priceChange24h)}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
