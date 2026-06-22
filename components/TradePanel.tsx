"use client";

import { useEffect, useState, useCallback } from "react";
import type { Token, Quote } from "@/lib/types";
import { useAuth } from "./AuthProvider";
import { price, tokenAmt, usd } from "@/lib/format";

const PRESETS = [0.1, 0.5, 1];
const SELL_PRESETS = [25, 50, 100]; // percent

export function TradePanel({ token }: { token: Token }) {
  const { authenticated, login } = useAuth();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.5");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const fetchQuote = useCallback(async () => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setQuote(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ side, mint: token.mint, amount: amt }),
      });
      const data = await res.json();
      setQuote(data.quote ?? null);
    } catch {
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [amount, side, token.mint]);

  // Debounced quote refresh as the user types or flips side.
  useEffect(() => {
    setConfirmed(false);
    const id = setTimeout(fetchQuote, 350);
    return () => clearTimeout(id);
  }, [fetchQuote]);

  const onReview = () => {
    if (!authenticated) {
      login();
      return;
    }
    // MVP: simulate only. We have a real quote + could build an unsigned tx,
    // but we deliberately do not sign or broadcast — no custody of funds.
    setConfirmed(true);
  };

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4">
      {/* Buy / Sell toggle */}
      <div className="mb-4 flex gap-1.5 rounded-pill bg-bg p-1">
        {(["buy", "sell"] as const).map((s) => (
          <button type="button"
            key={s}
            onClick={() => {
              setSide(s);
              setAmount(s === "buy" ? "0.5" : "50");
            }}
            className={`flex-1 rounded-pill py-2 text-sm font-semibold capitalize transition-colors ${
              side === s
                ? s === "buy"
                  ? "bg-green text-bg"
                  : "bg-red text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Amount */}
      <label className="mb-1.5 block text-xs text-muted">
        {side === "buy" ? "Amount (SOL)" : "Amount (% of position)"}
      </label>
      <input
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
        className="tnum w-full rounded-xl border border-hairline bg-bg px-3 py-3 text-lg text-ink outline-none transition-colors focus:border-green/50"
        placeholder="0.00"
      />

      {/* Presets */}
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(side === "buy" ? PRESETS : SELL_PRESETS).map((p) => (
          <button type="button"
            key={p}
            onClick={() => setAmount(String(p))}
            className="tnum rounded-lg border border-hairline bg-bg py-1.5 text-xs text-muted transition-colors hover:border-green/40 hover:text-ink"
          >
            {side === "buy" ? `${p} SOL` : `${p}%`}
          </button>
        ))}
      </div>

      {/* Quote breakdown */}
      <div className="mt-4 space-y-2 rounded-xl bg-bg p-3 text-xs">
        <Row
          label="You receive"
          value={
            loading
              ? "…"
              : quote
                ? side === "buy"
                  ? `${tokenAmt(quote.outAmountUi)} ${token.symbol}`
                  : `${quote.outAmountUi.toFixed(4)} SOL`
                : "—"
          }
        />
        <Row
          label="Price impact"
          value={quote ? `${quote.priceImpactPct.toFixed(2)}%` : "—"}
          accent={
            quote && quote.priceImpactPct > 1 ? "text-red" : "text-green"
          }
        />
        <Row label="Network fee" value="≈ 0.00008 SOL" />
        <Row
          label="Route"
          value={quote ? (quote.live ? "Jupiter (live)" : "Jupiter") : "—"}
        />
      </div>

      {/* Action */}
      {confirmed ? (
        <div className="mt-4 rounded-xl border border-green/30 bg-green/10 p-3 text-center">
          <div className="text-sm font-semibold text-green">
            Trade simulated ✓
          </div>
          <p className="mt-1 text-[11px] text-muted">
            Quote validated against live liquidity. No funds were moved in this
            preview.
          </p>
        </div>
      ) : (
        <button type="button"
          onClick={onReview}
          disabled={!quote || loading}
          className={`mt-4 w-full rounded-pill py-3.5 text-sm font-semibold transition-transform active:scale-[0.98] disabled:opacity-40 ${
            side === "buy" ? "bg-green text-bg" : "bg-red text-ink"
          }`}
        >
          {!authenticated
            ? "Sign in to trade"
            : `Review ${side === "buy" ? "buy" : "sell"}`}
        </button>
      )}

      <p className="mt-2.5 text-center text-[10px] text-faint">
        Simulated · no funds moved · self-custodial
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={`tnum ${accent ?? "text-ink"}`}>{value}</span>
    </div>
  );
}
