import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
    serverSourceMaps: false,
    preloadEntriesOnStart: false,
  },
};

export default nextConfig;
