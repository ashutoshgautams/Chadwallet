# ChadWallet — Web

The landing page and trading terminal for ChadWallet, the #1 meme coin trading app on Solana.

Built with Next.js (App Router) + TypeScript + Tailwind. Powered by real data from BirdEye and Jupiter, with sign-in through Privy. Runs out of the box with realistic preview data, and switches to live markets the moment you add API keys.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```


### Turn on live data (all free tiers)

```bash
cp .env.example .env.local
# fill in the keys (see .env.example for exact links), then:
npm run dev
```

| Variable | Service | What it powers | Where to get it |
|---|---|---|---|
| `BIRDEYE_API_KEY` | BirdEye | trending, prices, charts, trades, holders | birdeye.so/data-api |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy | Apple/Google sign-in, embedded wallet | dashboard.privy.io |
| `ALCHEMY_RPC_URL` | Alchemy | balances + tx simulation | alchemy.com |
| — | Jupiter | swap quotes | no key needed |

---

## What's here

```
app/
  page.tsx                 landing: dark hero, top+bottom token banners, promo section, features
  trade/[mint]/page.tsx    trading terminal (3-column desktop, tabbed mobile)
  api/
    trending/              top tokens for the banners + left rail
    token/[mint]/          overview + chart + trades + holders for one token
    quote/                 Jupiter quote for the buy/sell panel
components/                UI: banners, chart, trade panel, activity, auth, ...
lib/
  birdeye.ts               server-only market data (key never leaves the server)
  jupiter.ts               server-only swap quotes
  demo-data.ts             realistic fallback so the preview is never empty
  brand.ts / format.ts     brand tokens + number formatting
```

---

## Design

Every brand value (canvas `#020817`, signal green `#26ED80`, sell red `#F44034`, the promo blue→mint gradient) was sampled directly from the official app assets, so the web product matches the native app exactly. The Chad logo is vectorized to SVG and themes via `currentColor`. Market numbers use tabular monospace figures so prices don't jitter as digits tick — a small trader-tool detail.

The landing opens on the dark in-app canvas (credible to a trader), then breaks into the bright promo gradient for the download moment. The terminal is a real three-column layout — trending list, chart + activity, trade panel — that collapses to tabs on mobile.

---

## Architecture notes (the decisions worth explaining)

**Keys never reach the browser.** BirdEye and Alchemy keys live only in server-side modules (`lib/birdeye.ts`, `lib/jupiter.ts`, both marked `server-only`). The client only ever calls our own `/api/*` routes, which proxy upstream. This is the core security property.

**Quote + simulate, no custody.** The buy/sell panel builds a real Jupiter quote against live mainnet liquidity and shows real expected output, price impact, and route — but deliberately stops before signing or broadcasting. The MVP proves the integration is correct without taking custody of funds. Flipping to live execution is one signing step behind a feature flag.

**Graceful degradation.** Every data path falls back to a curated demo dataset if a key is missing or an upstream call fails, so a live demo never shows broken empty states. The demo tokens use real mints, so the same tokens light up with live numbers the instant a key is added.

**Quality floor.** Responsive to mobile, visible keyboard focus, `prefers-reduced-motion` respected, security headers set in `vercel.json`, input validation on the quote route, and Next pinned to a patched release.

---

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```
