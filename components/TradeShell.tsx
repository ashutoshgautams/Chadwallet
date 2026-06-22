"use client";

import { useState, type ReactNode } from "react";

/**
 * Responsive shell for the trade terminal.
 * Desktop (lg+): three columns side by side.
 * Mobile: a tab bar switches between Chart, Trade, and Activity.
 */
export function TradeShell({
  left,
  middle,
  right,
}: {
  left: ReactNode;
  middle: ReactNode;
  right: ReactNode;
}) {
  const [tab, setTab] = useState<"chart" | "trade" | "list">("chart");

  return (
    <>
      {/* Desktop: 3-column grid */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[280px_1fr_320px]">
        <div>{left}</div>
        <div>{middle}</div>
        <div>{right}</div>
      </div>

      {/* Mobile: tabbed */}
      <div className="lg:hidden">
        <div className="mb-4 flex gap-1.5 rounded-pill bg-surface p-1">
          {([
            ["chart", "Chart"],
            ["trade", "Trade"],
            ["list", "Markets"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 rounded-pill py-2 text-sm font-semibold transition-colors ${
                tab === k ? "bg-green text-bg" : "text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "chart" && middle}
        {tab === "trade" && right}
        {tab === "list" && left}
      </div>
    </>
  );
}
