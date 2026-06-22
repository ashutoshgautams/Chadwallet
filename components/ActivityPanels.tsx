"use client";

import { useEffect, useState } from "react";
import type { Trade, Holder, Token } from "@/lib/types";
import { usd, ago, tokenAmt, shortAddr } from "@/lib/format";

export function ActivityPanels({
  token,
  initialTrades,
  initialHolders,
}: {
  token: Token;
  initialTrades: Trade[];
  initialHolders: Holder[];
}) {
  const [trades, setTrades] = useState(initialTrades);
  const [holders, setHolders] = useState(initialHolders);
  const [tab, setTab] = useState<"trades" | "holders">("trades");

  // Poll the per-token endpoint for fresh trades/holders.
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(`/api/token/${token.mint}`)
        .then((r) => r.json())
        .then((d) => {
          if (!alive) return;
          if (d?.trades?.length) setTrades(d.trades);
          if (d?.holders?.length) setHolders(d.holders);
        })
        .catch(() => {});
    const id = setInterval(load, 15_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [token.mint]);

  return (
    <div className="rounded-2xl border border-hairline bg-surface">
      <div className="flex border-b border-hairline">
        {(["trades", "holders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${
              tab === t
                ? "border-b-2 border-green text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {t === "trades" ? "Live trades" : "Top holders"}
          </button>
        ))}
      </div>

      {tab === "trades" ? (
        <div className="max-h-[320px] divide-y divide-hairline overflow-y-auto no-scrollbar">
          {trades.map((t, i) => (
            <div
              key={`${t.txHash}-${i}`}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    t.side === "buy"
                      ? "bg-green/15 text-green"
                      : "bg-red/15 text-red"
                  }`}
                >
                  {t.side}
                </span>
                <span className="tnum text-[11px] text-faint">
                  {shortAddr(t.wallet)}
                </span>
              </div>
              <div className="text-right">
                <div className="tnum text-xs font-semibold">
                  {usd(t.amountUsd)}
                </div>
                <div className="tnum text-[10px] text-faint">{ago(t.unixTime)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-h-[320px] divide-y divide-hairline overflow-y-auto no-scrollbar">
          {holders.map((h) => (
            <div
              key={h.rank}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="tnum w-4 text-[11px] text-faint">
                  {h.rank}
                </span>
                <span className="tnum text-xs">{shortAddr(h.wallet)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-bg sm:block">
                  <div
                    className="h-full bg-green"
                    style={{ width: `${Math.min(100, h.percent * 5)}%` }}
                  />
                </div>
                <span className="tnum text-xs font-semibold">{h.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
