"use client";

import { useMemo, useState } from "react";
import type { PricePoint } from "@/lib/types";
import { price } from "@/lib/format";

const TIMEFRAMES = ["5m", "15m", "1h", "4h", "1D"] as const;
type TF = (typeof TIMEFRAMES)[number];

/**
 * ChadWallet price chart: single price line, green/red based on direction,
 * with a gradient area fill and hover tooltip. Timeframe selector included.
 */
export function PriceChart({
  points,
  height = 260,
}: {
  points: PricePoint[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [tf, setTf] = useState<TF>("15m");

  const W = 760;
  const H = height;
  const pad = 8;

  const { path, area, lo, hi, up, coords } = useMemo(() => {
    const vals = points.map((p) => p.value);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const span = hi - lo || 1;
    const dx = (W - pad * 2) / Math.max(1, points.length - 1);
    const coords = points.map((p, i) => ({
      x: pad + i * dx,
      y: pad + (H - pad * 2) * (1 - (p.value - lo) / span),
      v: p.value,
      t: p.unixTime,
    }));
    const path = coords
      .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(" ");
    const area =
      `M${coords[0].x.toFixed(1)} ${H - pad} ` +
      coords.map((c) => `L${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ") +
      ` L${coords[coords.length - 1].x.toFixed(1)} ${H - pad} Z`;
    const up = vals[vals.length - 1] >= vals[0];
    return { path, area, lo, hi, up, coords };
  }, [points, H]);

  const stroke = up ? "#26ED80" : "#F44034";
  const hoverPt = hover != null ? coords[hover] : null;

  return (
    <div className="relative w-full">
      {/* Timeframe tabs */}
      <div className="mb-4 flex items-center gap-1">
        {TIMEFRAMES.map((t) => (
          <button type="button"
            key={t}
            onClick={() => setTf(t)}
            className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors ${
              tf === t
                ? "bg-green/15 text-green"
                : "text-faint hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse-dot" />
          Live
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Price chart"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.target as SVGElement)
            .closest("svg")!
            .getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * W;
          const idx = Math.round(
            ((rel - pad) / (W - pad * 2)) * (coords.length - 1),
          );
          setHover(Math.max(0, Math.min(coords.length - 1, idx)));
        }}
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#chart-fill)" />
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {hoverPt && (
          <>
            <line
              x1={hoverPt.x}
              y1={pad}
              x2={hoverPt.x}
              y2={H - pad}
              stroke="#8A93A6"
              strokeWidth="1"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={hoverPt.x} cy={hoverPt.y} r="5" fill={stroke} opacity="0.3" />
            <circle cx={hoverPt.x} cy={hoverPt.y} r="3" fill={stroke} />
          </>
        )}
        {/* Live end dot */}
        <circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="4"
          fill={stroke}
        />
        <circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="8"
          fill={stroke}
          opacity="0.15"
        />
      </svg>

      {/* High / low rail */}
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="tnum text-green">{price(hi)}</span>
        <div className="mx-3 h-px flex-1 bg-gradient-to-r from-green/50 via-hairline to-red/50" />
        <span className="tnum text-red">{price(lo)}</span>
      </div>

      {/* Hover tooltip */}
      {hoverPt && (
        <div className="pointer-events-none absolute left-2 top-10 rounded-xl border border-hairline bg-surface px-3 py-2 shadow-lg">
          <div className="tnum text-sm font-bold">{price(hoverPt.v)}</div>
          <div className="tnum mt-0.5 text-[10px] text-faint">
            {new Date(hoverPt.t * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )}
    </div>
  );
}
