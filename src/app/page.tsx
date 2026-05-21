import type { Metadata } from "next";

import { FeatureGrid } from "@/components/home/feature-grid";
import { Hero } from "@/components/home/hero";
import { CyberCTA } from "@/components/home/cyber-cta";
import { siteDescription, siteName } from "@/data/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <CyberCTA />
    </>
  );
}
