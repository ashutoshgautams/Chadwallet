import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TokenBanner } from "@/components/TokenBanner";
import { TradeShell } from "@/components/TradeShell";
import { TrendingList } from "@/components/TrendingList";
import { TokenHeader } from "@/components/TokenHeader";
import { PriceChart } from "@/components/PriceChart";
import { ActivityPanels } from "@/components/ActivityPanels";
import { TradePanel } from "@/components/TradePanel";
import {
  getTrending,
  getToken,
  getChart,
  getTrades,
  getHolders,
} from "@/lib/birdeye";

export const revalidate = 15;

export default async function TradePage({
  params,
}: {
  params: { mint: string };
}) {
  const { mint } = params;
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint)) notFound();

  const [trending, token, chart, trades, holders] = await Promise.all([
    getTrending(24),
    getToken(mint),
    getChart(mint),
    getTrades(mint),
    getHolders(mint),
  ]);

  const isDemo = token.source === "demo";

  return (
    <main className="min-h-screen bg-bg text-ink">
      <SiteHeader compact />
      <TokenBanner tokens={trending.data} speed={46} />

      <div className="mx-auto max-w-7xl px-4 py-5">
        {isDemo && (
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface px-3 py-1 font-mono text-[11px] text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            preview data · add BirdEye + Jupiter keys for live markets
          </div>
        )}

        <TradeShell
          left={
            <TrendingList tokens={trending.data} activeMint={mint} />
          }
          middle={
            <div className="space-y-4">
              <TokenHeader token={token.data} />
              <div className="rounded-2xl border border-hairline bg-surface p-5">
                <PriceChart points={chart.data} />
              </div>
              <ActivityPanels
                token={token.data}
                initialTrades={trades.data}
                initialHolders={holders.data}
              />
            </div>
          }
          right={<TradePanel token={token.data} />}
        />
      </div>
      <SiteFooter />
    </main>
  );
}
