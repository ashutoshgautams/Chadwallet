import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { BRAND } from "@/lib/brand";
import { Providers } from "@/components/Providers";
import "@/styles/globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://chadwallet.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Trade trending Solana memecoins in seconds. Follow top traders, track live charts, and never miss the next breakout. Self-custodial — you own your crypto.",
  keywords: [
    "Solana",
    "memecoin",
    "trading",
    "crypto",
    "DEX",
    "Jupiter",
    "BONK",
    "wallet",
    "defi",
  ],
  authors: [{ name: BRAND.name, url: BRAND.site }],
  creator: BRAND.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "Trade trending Solana memecoins in seconds. Never miss the next breakout.",
    url: SITE_URL,
    siteName: BRAND.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "Trade trending Solana memecoins in seconds. Never miss the next breakout.",
    creator: "@chadwallet",
    site: "@chadwallet",
  },
  icons: {
    icon: [
      { url: "/brand/chad-mark-dark.png", type: "image/png" },
    ],
    apple: [
      { url: "/brand/chad-mark-dark.png", type: "image/png" },
    ],
    shortcut: "/brand/chad-mark-dark.png",
  },
  manifest: undefined,
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#020817",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
