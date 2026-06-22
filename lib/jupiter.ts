import "server-only";
import type { Quote } from "./types";
import { SOL_MINT } from "./brand";
import { findDemoToken } from "./demo-data";

/**
 * Jupiter quote layer (server-only).
 *
 * Builds a real swap quote against live Solana liquidity. We deliberately stop
 * at the quote + (optional) unsigned transaction: the MVP simulates the trade
 * and never signs or broadcasts, so no custody of funds is involved. Flipping
 * to live execution is a single signing step behind a feature flag.
 */

const JUP_BASE = "https://quote-api.jup.ag/v6";

interface QuoteArgs {
  inputMint: string;
  outputMint: string;
  amount: string; // base units of inputMint
  slippageBps?: number;
}

export async function getQuote({
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
}: QuoteArgs): Promise<Quote> {
  try {
    const url =
      `${JUP_BASE}/quote?inputMint=${inputMint}&outputMint=${outputMint}` +
      `&amount=${amount}&slippageBps=${slippageBps}&onlyDirectRoutes=false`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (res.ok) {
      const q = await res.json();
      if (q?.outAmount) {
        return {
          inputMint,
          outputMint,
          inAmount: q.inAmount,
          outAmount: q.outAmount,
          outAmountUi: Number(q.outAmount),
          priceImpactPct: Number(q.priceImpactPct ?? 0),
          routePlan: q.routePlan,
          live: true,
        };
      }
    }
  } catch {
    /* fall through to synthesized quote */
  }
  return synthQuote({ inputMint, outputMint, amount });
}

/** Believable quote when Jupiter is unreachable, so the panel always responds. */
function synthQuote({ inputMint, outputMint, amount }: QuoteArgs): Quote {
  const buying = inputMint === SOL_MINT;
  const token = findDemoToken(buying ? outputMint : inputMint);
  const SOL_USD = 152;
  const inUi = Number(amount) / (buying ? 1e9 : 10 ** 6);
  const usd = buying ? inUi * SOL_USD : inUi * token.price;
  const outUi = buying ? usd / token.price : usd / SOL_USD;
  return {
    inputMint,
    outputMint,
    inAmount: amount,
    outAmount: String(Math.round(outUi * (buying ? 1e6 : 1e9))),
    outAmountUi: outUi,
    priceImpactPct: 0.08 + Math.random() * 0.15,
    live: false,
  };
}
