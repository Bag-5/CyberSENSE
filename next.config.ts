import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  outputFileTracingIncludes: {
    "/api/reports/certificate": [
      "./Logo/**/*",
      "./src/lib/pdf/fonts/**/*",
      "./node_modules/pdfkit/js/data/**/*",
    ],
    "/api/reports/quiz": [
      "./Logo/**/*",
      "./src/lib/pdf/fonts/**/*",
      "./node_modules/pdfkit/js/data/**/*",
    ],
    "/api/reports/progress": [
      "./Logo/**/*",
      "./src/lib/pdf/fonts/**/*",
      "./node_modules/pdfkit/js/data/**/*",
    ],
  },
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
