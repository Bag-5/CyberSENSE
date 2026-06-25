import type { Metadata } from "next";

import { FeatureGrid } from "@/components/home/feature-grid";
import { Hero } from "@/components/home/hero";
import { CyberCTA } from "@/components/home/cyber-cta";
import { siteDescription, siteName } from "@/data/site";
import { getCurrentSessionUser } from "@/lib/auth/context";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
};

export default async function Home() {
  const currentUser = await getCurrentSessionUser().catch(() => null);

  return (
    <>
      <Hero initialAuthenticated={Boolean(currentUser)} />
      <FeatureGrid />
      <CyberCTA initialAuthenticated={Boolean(currentUser)} />
    </>
  );
}
