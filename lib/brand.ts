/**
 * ChadWallet brand tokens — single source of truth.
 *
 * Provenance: these hex values were sampled programmatically from the
 * official app screenshots and logo files provided by the client, so the
 * web product matches the native app exactly rather than approximately.
 *
 *   --bg      #020817   in-app canvas (deep blue-black)
 *   --green   #26ED80   buy / positive / primary CTA / active nav
 *   --red     #F44034   sell / negative
 *   --blue    #2696FF   links + promo gradient start
 *   --mint    #8EE1D1   promo gradient end
 */
export const BRAND = {
  name: "ChadWallet",
  tagline: "Find the next 100x memecoins.",
  appStore: "https://apps.apple.com/us/app/chadwallet/id6757367474",
  playStore:
    "https://play.google.com/store/apps/details?id=xyz.chadwallet.www",
  site: "https://www.chadwallet.xyz",
  twitter: "https://x.com/chadwallet",
  colors: {
    bg: "#020817",
    surface: "#0F1729",
    green: "#26ED80",
    red: "#F44034",
    blue: "#2696FF",
    mint: "#8EE1D1",
  },
} as const;

/** SOL mint — the canonical address used across Jupiter/BirdEye for native SOL. */
export const SOL_MINT = "So11111111111111111111111111111111111111112";
