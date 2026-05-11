import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash — kategori + story karti gorselleri (CC0).
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      // SEO endeks aliases — match high-intent search queries like
      // "istanbul kira endeksi 2026" without forking the page tree.
      // Canonical stays on the original URL via metadata so Google
      // collapses both into a single result.
      { source: "/:city-kira-endeksi", destination: "/kira/sehir/:city" },
      { source: "/:city-maas-endeksi", destination: "/maaslar/sehir/:city" },
      { source: "/:city-aidat-endeksi", destination: "/aidat/sehir/:city" },
      { source: "/:city-fatura-endeksi", destination: "/fatura/sehir/:city" },
      { source: "/:city-internet-endeksi", destination: "/internet/sehir/:city" },
      { source: "/:city-tekstil-endeksi", destination: "/tekstil/sehir/:city" },
    ];
  },
};

export default nextConfig;
