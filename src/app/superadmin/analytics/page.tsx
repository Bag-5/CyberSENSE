import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { AnalyticsDashboard } from "@/components/admin/analytics/analytics-dashboard";
import { getCurrentSessionUser } from "@/lib/auth/context";
import { getAnalyticsSnapshot } from "@/lib/analytics/store";
import { getPlatformSettings } from "@/lib/superadmin/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Superadmin analytics dashboard for CyberSENSE platform activity and learning trends.",
};

export default async function SuperAdminAnalyticsPage() {
  const user = await getCurrentSessionUser("superadmin");

  if (!user) {
    redirect("/auth?returnTo=%2Fsuperadmin%2Fanalytics");
  }

  if (user.role !== "superadmin") {
    redirect("/");
  }

  const [snapshot, platformSettings] = await Promise.all([
    getAnalyticsSnapshot(),
    getPlatformSettings(),
  ]);

  return (
    <>
      <AnalyticsBeacon
        eventType="page_view"
        module="superadmin"
        slug="analytics-dashboard"
        category="Superadmin Analytics"
        portal="superadmin"
        dedupeKey="superadmin-analytics"
      />
      <AnalyticsDashboard snapshot={snapshot} platformSettings={platformSettings} />
    </>
  );
}
