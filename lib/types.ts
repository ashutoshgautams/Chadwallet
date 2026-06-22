/** Core domain types shared across the app. */

export interface Token {
  mint: string;
  symbol: string;
  name: string;
  logoURI?: string;
  price: number;
  priceChange24h: number; // percent
  volume24h?: number;
  marketCap?: number;
  liquidity?: number;
  holders?: number;
}

export interface Trade {
  txHash: string;
  side: "buy" | "sell";
  amountUsd: number;
  tokenAmount: number;
  priceUsd: number;
  wallet: string;
  unixTime: number;
}

export interface Holder {
  wallet: string;
  amount: number;
  percent: number;
  rank: number;
}

export interface PricePoint {
  unixTime: number;
  value: number;
}

export interface Quote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  outAmountUi: number;
  priceImpactPct: number;
  routePlan?: unknown[];
  /** True when this is a real Jupiter quote; false when synthesized for demo. */
  live: boolean;
}

/** Whether a data payload came from a live API or the demo fallback. */
export type DataSource = "live" | "demo";

export interface Sourced<T> {
  data: T;
  source: DataSource;
}
