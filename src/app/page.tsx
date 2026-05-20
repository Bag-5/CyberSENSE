import { FeatureGrid } from "@/components/home/feature-grid";
import { Hero } from "@/components/home/hero";
import { CyberCTA } from "@/components/home/cyber-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <CyberCTA />
    </>
  );
}
