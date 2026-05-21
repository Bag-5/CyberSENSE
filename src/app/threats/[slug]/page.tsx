import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ThreatDetailView } from "@/components/threats/threat-detail-view";
import { threatsBySlug } from "@/data/threats";
import type { ThreatDetail } from "@/types/site";

export const dynamic = "force-dynamic";

type ThreatPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ThreatPageProps): Promise<Metadata> {
  const { slug } = await params;
  const threat = threatsBySlug[slug];

  if (!threat) {
    return {
      title: "Threat not found",
    };
  }

  return {
    title: threat.name,
    description: threat.summary,
  };
}

export default async function ThreatPage({ params }: ThreatPageProps) {
  const { slug } = await params;
  const threat = threatsBySlug[slug];

  if (!threat) {
    notFound();
  }

  const relatedThreats = threat.relatedSlugs
    .map((relatedSlug) => threatsBySlug[relatedSlug])
    .filter((relatedThreat): relatedThreat is ThreatDetail => Boolean(relatedThreat));

  return <ThreatDetailView threat={threat} relatedThreats={relatedThreats} />;
}
