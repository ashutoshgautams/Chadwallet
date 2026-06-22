import type { Token, Trade, Holder, PricePoint } from "./types";

/**
 * Demo dataset.
 *
 * Used only when API keys are absent, or when a live call fails, so the
 * live preview always renders a believable product instead of empty states.
 * Real mints are used so that, the moment a BirdEye key is added, the same
 * tokens light up with live numbers.
 */
export const DEMO_TOKENS: Token[] = [
  {
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    price: 0.00002471,
    priceChange24h: 12.4,
    volume24h: 48_200_000,
    marketCap: 1_840_000_000,
    liquidity: 12_400_000,
    holders: 742_000,
  },
  {
    mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    symbol: "WIF",
    name: "dogwifhat",
    price: 1.84,
    priceChange24h: -3.1,
    volume24h: 92_000_000,
    marketCap: 1_830_000_000,
    liquidity: 18_900_000,
    holders: 221_000,
  },
  {
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    symbol: "JUP",
    name: "Jupiter",
    price: 0.62,
    priceChange24h: 5.8,
    volume24h: 41_000_000,
    marketCap: 1_680_000_000,
    liquidity: 22_300_000,
    holders: 540_000,
  },
  {
    mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    symbol: "POPCAT",
    name: "Popcat",
    price: 0.41,
    priceChange24h: 8.0,
    volume24h: 16_700_000,
    marketCap: 402_000_000,
    liquidity: 7_100_000,
    holders: 96_400,
  },
  {
    mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
    symbol: "MEW",
    name: "cat in a dogs world",
    price: 0.0088,
    priceChange24h: -1.4,
    volume24h: 9_300_000,
    marketCap: 78_000_000,
    liquidity: 3_900_000,
    holders: 64_200,
  },
  {
    mint: "ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY",
    symbol: "MOODENG",
    name: "Moo Deng",
    price: 0.137,
    priceChange24h: 22.9,
    volume24h: 31_500_000,
    marketCap: 137_000_000,
    liquidity: 5_200_000,
    holders: 88_100,
  },
  {
    mint: "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
    symbol: "BODEN",
    name: "jeo boden",
    price: 0.021,
    priceChange24h: -8.7,
    volume24h: 2_100_000,
    marketCap: 21_000_000,
    liquidity: 980_000,
    holders: 41_300,
  },
  {
    mint: "A8C3xuqscfmyLrte3VmTqrAq8kgMASF6psc4S4WojakX",
    symbol: "WOJAK",
    name: "Wojak",
    price: 0.00041,
    priceChange24h: 4.1,
    volume24h: 1_400_000,
    marketCap: 14_100_000,
    liquidity: 610_000,
    holders: 29_900,
  },
];

/** Deterministic pseudo-random so charts are stable across renders/SSR. */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Build a plausible intraday price series around a token's current price. */
export function demoChart(token: Token, points = 96): PricePoint[] {
  const rand = seeded(
    token.symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  );
  const now = Math.floor(Date.now() / 1000);
  const step = (24 * 3600) / points;
  const drift = token.priceChange24h / 100;
  const start = token.price / (1 + drift);
  const out: PricePoint[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const trend = start * (1 + drift * t);
    const vol = (rand() - 0.5) * start * 0.06;
    const spike = rand() > 0.94 ? (rand() - 0.5) * start * 0.18 : 0;
    out.push({
      unixTime: now - (points - i) * step,
      value: Math.max(trend + vol + spike, start * 0.4),
    });
  }
  out[out.length - 1].value = token.price;
  return out;
}

const WALLETS = [
  "7xKXq4k4", "9aBcm1Zz", "3kFz8Qp2", "Hn2YaG4t", "BXAWg4Lp",
  "ACtfUW9r", "4BdKax7m", "TyMWVK2s", "6NcHNGab", "zC3yqYde",
];

export function demoTrades(token: Token, n = 14): Trade[] {
  const rand = seeded(token.price * 1e6 + token.symbol.length);
  const now = Math.floor(Date.now() / 1000);
  const out: Trade[] = [];
  for (let i = 0; i < n; i++) {
    const side = rand() > 0.42 ? "buy" : "sell";
    const usd = Math.round((50 + rand() * 4800) * 100) / 100;
    out.push({
      txHash: `demo${i}${Math.floor(rand() * 1e6)}`,
      side,
      amountUsd: usd,
      tokenAmount: usd / token.price,
      priceUsd: token.price * (1 + (rand() - 0.5) * 0.01),
      wallet: WALLETS[Math.floor(rand() * WALLETS.length)],
      unixTime: now - i * Math.floor(8 + rand() * 90),
    });
  }
  return out;
}

export function demoHolders(token: Token, n = 8): Holder[] {
  const rand = seeded(token.symbol.length * 7 + 13);
  let remaining = 38;
  const out: Holder[] = [];
  for (let i = 0; i < n; i++) {
    const pct = Math.max(0.4, (remaining / (n - i)) * (0.6 + rand() * 0.8));
    remaining -= pct;
    out.push({
      wallet: WALLETS[i % WALLETS.length],
      amount: (token.marketCap ?? 1e7) * (pct / 100) / token.price,
      percent: Math.round(pct * 10) / 10,
      rank: i + 1,
    });
  }
  return out.sort((a, b) => b.percent - a.percent).map((h, i) => ({ ...h, rank: i + 1 }));
}

export const findDemoToken = (mint: string) =>
  DEMO_TOKENS.find((t) => t.mint === mint) ?? DEMO_TOKENS[0];
