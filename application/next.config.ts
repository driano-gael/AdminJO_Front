import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: {
      preload: true,
      mergeStylesheets: true,
      external: false
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
