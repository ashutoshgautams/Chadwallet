import { NextResponse } from "next/server";
import { getToken, getChart, getTrades, getHolders } from "@/lib/birdeye";

export const revalidate = 15;

export async function GET(
  req: Request,
  { params }: { params: { mint: string } },
) {
  const { mint } = params;
  const { searchParams } = new URL(req.url);
  const interval = searchParams.get("interval") ?? "15m";

  const [token, chart, trades, holders] = await Promise.all([
    getToken(mint),
    getChart(mint, interval),
    getTrades(mint),
    getHolders(mint),
  ]);

  return NextResponse.json({
    token: token.data,
    chart: chart.data,
    trades: trades.data,
    holders: holders.data,
    source: token.source,
  });
}
