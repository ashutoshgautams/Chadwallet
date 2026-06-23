"use client";

import { useEffect, useRef, useState } from "react";
import type { PricePoint } from "@/lib/types";

const TIMEFRAMES = ["5m", "15m", "1h", "4h", "1D"] as const;
type TF = (typeof TIMEFRAMES)[number];

export function PriceChart({
  points,
  height = 260,
}: {
  points: PricePoint[];
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState<TF>("15m");

  const up =
    points.length > 1 &&
    points[points.length - 1].value >= points[0].value;
  const stroke = up ? "#26ED80" : "#F44034";

  useEffect(() => {
    if (!containerRef.current || points.length < 2) return;

    let chart: import("lightweight-charts").IChartApi;
    let observer: ResizeObserver;

    import("lightweight-charts").then(({ createChart, ColorType, AreaSeries }) => {
      if (!containerRef.current) return;

      chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#5A6379",
        },
        grid: {
          vertLines: { color: "rgba(255,255,255,0.04)" },
          horzLines: { color: "rgba(255,255,255,0.04)" },
        },
        crosshair: { mode: 1 },
        rightPriceScale: {
          borderVisible: false,
          textColor: "#5A6379",
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
        },
        width: containerRef.current.clientWidth,
        height,
      });

      const series = chart.addSeries(AreaSeries, {
        lineColor: stroke,
        topColor: `${stroke}33`,
        bottomColor: `${stroke}00`,
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        crosshairMarkerBorderColor: stroke,
        crosshairMarkerBackgroundColor: stroke,
        priceFormat: { type: "price", precision: 8, minMove: 0.00000001 },
      });

      const sorted = [...points].sort((a, b) => a.unixTime - b.unixTime);
      series.setData(
        sorted.map((p) => ({
          time: p.unixTime as import("lightweight-charts").Time,
          value: p.value,
        })),
      );

      chart.timeScale().fitContent();

      observer = new ResizeObserver((entries) => {
        if (entries[0] && chart) {
          chart.resize(entries[0].contentRect.width, height);
        }
      });
      observer.observe(containerRef.current!);
    });

    return () => {
      observer?.disconnect();
      chart?.remove();
    };
  }, [points, height, stroke]);

  return (
    <div className="relative w-full">
      {/* Timeframe tabs */}
      <div className="mb-4 flex items-center gap-1">
        {TIMEFRAMES.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTf(t)}
            className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors ${
              tf === t
                ? "bg-green/15 text-green"
                : "text-faint hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-faint">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-green" />
          Live
        </div>
      </div>

      <div ref={containerRef} className="w-full" />
    </div>
  );
}
