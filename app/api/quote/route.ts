import { NextResponse } from "next/server";
import { getQuote } from "@/lib/jupiter";
import { SOL_MINT } from "@/lib/brand";

export const dynamic = "force-dynamic";

/** Basic guards so we never forward junk to the upstream quote API. */
function isMint(s: unknown): s is string {
  return typeof s === "string" && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s);
}

export async function POST(req: Request) {
  let body: { side?: unknown; mint?: unknown; amount?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { side, mint, amount } = body ?? {};
  if (side !== "buy" && side !== "sell") {
    return NextResponse.json({ error: "side must be buy or sell" }, { status: 400 });
  }
  if (!isMint(mint)) {
    return NextResponse.json({ error: "invalid mint" }, { status: 400 });
  }
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    return NextResponse.json({ error: "invalid amount" }, { status: 400 });
  }

  // Buy: pay SOL (lamports). Sell: pay token (assume 6 decimals for demo mints).
  const inputMint = side === "buy" ? SOL_MINT : mint;
  const outputMint = side === "buy" ? mint : SOL_MINT;
  const baseUnits =
    side === "buy"
      ? String(Math.round(amt * 1e9))
      : String(Math.round(amt * 1e6));

  const quote = await getQuote({ inputMint, outputMint, amount: baseUnits });
  return NextResponse.json({ quote });
}
