import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SuperAdminDashboard } from "@/components/superadmin/superadmin-dashboard";
import { getCurrentSessionUser } from "@/lib/auth/context";
import { getPlatformSettings } from "@/lib/superadmin/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Super Admin",
  description: "CyberSENSE superadmin control room for access, content, and security governance.",
};

export default async function SuperAdminPage() {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/auth?returnTo=%2Fsuperadmin");
  }

  if (user.role !== "superadmin") {
    redirect("/");
  }

  const initialSettings = await getPlatformSettings();

  return <SuperAdminDashboard user={user} initialSettings={initialSettings} />;
}
