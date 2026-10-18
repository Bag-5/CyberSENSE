import type { NextConfig } from "next";

/**
 * The stock deviceSizes ladder tops out at 3840px. Our generated art is around
 * 2220px on the long edge, so a 3840 candidate can only ever be an upscale, and
 * lazy-loaded images in a multi-column grid will occasionally pre-fetch it and
 * then stall waiting on a very large optimizer response. Capping the ladder at
 * 1920 keeps every request a genuine downscale.
 */
const imageLadder = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
  imageSizes: [256, 384, 512, 640, 750],
};

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    // WebP only. AVIF encoding is several times slower and stalls first-request
    // latency badly; the source art is already WebP so re-encoding to a slower
    // codec gains nothing.
    formats: ["image/webp"],
    deviceSizes: imageLadder.deviceSizes,
    imageSizes: imageLadder.imageSizes,
  },
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