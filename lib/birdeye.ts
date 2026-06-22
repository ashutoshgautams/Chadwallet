import "server-only";
import type { Token, Trade, Holder, PricePoint, Sourced } from "./types";
import {
  DEMO_TOKENS,
  demoChart,
  demoTrades,
  demoHolders,
  findDemoToken,
} from "./demo-data";

/**
 * BirdEye data layer (server-only).
 *
 * The API key lives exclusively in this module via process.env and is never
 * shipped to the client — the browser only ever talks to our own /api routes.
 * Every function degrades to the demo dataset if the key is missing or a call
 * fails, so the live preview always renders.
 */

const BIRDEYE_BASE = "https://public-api.birdeye.so";
const KEY = process.env.BIRDEYE_API_KEY;
const CHAIN = "solana";

function headers() {
  return {
    "X-API-KEY": KEY ?? "",
    "x-chain": CHAIN,
    accept: "application/json",
  };
}

async function be<T>(path: string, revalidate = 30): Promise<T | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(`${BIRDEYE_BASE}${path}`, {
      headers: headers(),
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success === false ? null : (json.data as T);
  } catch {
    return null;
  }
}

/** Trending / top tokens for the banners and the trade page left rail. */
export async function getTrending(limit = 20): Promise<Sourced<Token[]>> {
  const data = await be<{ tokens?: any[] }>(
    `/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=${limit}`,
  );
  const list = data?.tokens;
  if (!list?.length) return { data: DEMO_TOKENS, source: "demo" };
  const mapped: Token[] = list.map((t) => ({
    mint: t.address,
    symbol: t.symbol ?? "—",
    name: t.name ?? t.symbol ?? "Unknown",
    logoURI: t.logoURI,
    price: t.price ?? 0,
    priceChange24h: t.price24hChangePercent ?? 0,
    volume24h: t.volume24hUSD,
    liquidity: t.liquidity,
    marketCap: t.marketcap ?? t.mc,
  }));
  return { data: mapped, source: "live" };
}

export async function getToken(mint: string): Promise<Sourced<Token>> {
  const data = await be<any>(`/defi/token_overview?address=${mint}`);
  if (!data) return { data: findDemoToken(mint), source: "demo" };
  return {
    data: {
      mint,
      symbol: data.symbol ?? "—",
      name: data.name ?? data.symbol ?? "Unknown",
      logoURI: data.logoURI,
      price: data.price ?? 0,
      priceChange24h: data.priceChange24hPercent ?? 0,
      volume24h: data.v24hUSD,
      marketCap: data.mc ?? data.marketCap,
      liquidity: data.liquidity,
      holders: data.holder,
    },
    source: "live",
  };
}

export async function getChart(
  mint: string,
  type = "15m",
): Promise<Sourced<PricePoint[]>> {
  const now = Math.floor(Date.now() / 1000);
  const from = now - 24 * 3600;
  const data = await be<{ items?: any[] }>(
    `/defi/history_price?address=${mint}&address_type=token&type=${type}&time_from=${from}&time_to=${now}`,
  );
  const items = data?.items;
  if (!items?.length) {
    return { data: demoChart(findDemoToken(mint)), source: "demo" };
  }
  return {
    data: items.map((i) => ({ unixTime: i.unixTime, value: i.value })),
    source: "live",
  };
}

export async function getTrades(
  mint: string,
  limit = 14,
): Promise<Sourced<Trade[]>> {
  const data = await be<{ items?: any[] }>(
    `/defi/txs/token?address=${mint}&tx_type=swap&sort_type=desc&offset=0&limit=${limit}`,
    10,
  );
  const items = data?.items;
  if (!items?.length) {
    return { data: demoTrades(findDemoToken(mint), limit), source: "demo" };
  }
  const mapped: Trade[] = items.map((t) => {
    const isBuy = t.side === "buy" || t.from?.symbol !== undefined;
    return {
      txHash: t.txHash ?? t.tx_hash ?? "",
      side: (t.side as "buy" | "sell") ?? (isBuy ? "buy" : "sell"),
      amountUsd: t.volumeUSD ?? t.volume_usd ?? 0,
      tokenAmount: t.to?.uiAmount ?? 0,
      priceUsd: t.pricePair ?? 0,
      wallet: (t.owner ?? "").slice(0, 8),
      unixTime: t.blockUnixTime ?? t.block_unix_time ?? 0,
    };
  });
  return { data: mapped, source: "live" };
}

export async function getHolders(
  mint: string,
  limit = 8,
): Promise<Sourced<Holder[]>> {
  const data = await be<{ items?: any[] }>(
    `/defi/v3/token/holder?address=${mint}&offset=0&limit=${limit}`,
  );
  const items = data?.items;
  if (!items?.length) {
    return { data: demoHolders(findDemoToken(mint), limit), source: "demo" };
  }
  const mapped: Holder[] = items.map((h, i) => ({
    wallet: (h.owner ?? "").slice(0, 8),
    amount: h.ui_amount ?? h.uiAmount ?? 0,
    percent: Math.round((h.percentage ?? 0) * 10) / 10,
    rank: i + 1,
  }));
  return { data: mapped, source: "live" };
}

export const isLiveDataConfigured = () => Boolean(KEY);
