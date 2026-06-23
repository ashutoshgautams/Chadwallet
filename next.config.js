/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.birdeye.so" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "**.coingecko.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  webpack: (config) => {
    // Privy imports optional peer deps that may not be installed.
    // Mark them as empty modules so the bundle resolves cleanly.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@farcaster/mini-app-solana": false,
    };
    return config;
  },
};
module.exports = nextConfig;
