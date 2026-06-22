/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Token logos come from BirdEye / Solana token list CDNs.
      { protocol: 'https', hostname: '**.birdeye.so' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: '**.coingecko.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};
module.exports = nextConfig;
