/** Display formatters for prices, market caps, and percentages. */

/** Compact USD: $1.84M, $402K, $7.10. */
export function usd(n: number | undefined | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  if (abs >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toPrecision(2)}`;
}

/**
 * Price with sub-cent handling. Memecoins often have many leading zeros,
 * so very small numbers render with significant digits, not a flat $0.00.
 */
export function price(n: number | undefined | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  // Count leading zeros after the decimal for a tidy representation.
  const str = n.toFixed(12);
  const match = str.match(/0\.(0*)(\d+)/);
  if (!match) return `$${n}`;
  const zeros = match[1].length;
  const sig = match[2].slice(0, 4);
  return `$0.0${subscript(zeros)}${sig}`;
}

function subscript(n: number): string {
  const map = "₀₁₂₃₄₅₆₇₈₉";
  return String(n)
    .split("")
    .map((d) => map[Number(d)])
    .join("");
}

/** Signed percent: +12.4%, -3.1%. */
export function pct(n: number | undefined | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

/** Short relative time: 8s, 3m, 2h. */
export function ago(unix: number): string {
  const s = Math.max(0, Math.floor(Date.now() / 1000 - unix));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

/** Token amount: 2.1M, 387.7K, 1,204. */
export function tokenAmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export const shortAddr = (a: string) =>
  a.length > 8 ? `${a.slice(0, 4)}…${a.slice(-2)}` : a;
