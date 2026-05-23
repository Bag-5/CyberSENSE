import type { Metadata } from "next";

import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { LabPageShell } from "@/components/lab/lab-page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Simulated Attack Lab",
  description:
    "Explore CyberSENSE's safe educational simulation lab with phishing, fake login, password, ransomware, Wi-Fi, and app permission demos.",
};

export default function LabPage() {
  return (
    <>
      <AnalyticsBeacon
        eventType="page_view"
        module="lab"
        slug="attack-lab"
        category="Simulated Attack Lab"
        portal="user"
        dedupeKey="lab-page"
      />
      <LabPageShell />
    </>
  );
}
