import type { Metadata } from "next";

import { AssistantPage } from "@/components/assistant/assistant-page";
import { getCurrentSessionUser } from "@/lib/auth/context";

export const metadata: Metadata = {
  title: "CyberSENSE Assistant",
  description:
    "An educational AI assistant for cybersecurity awareness, scam interpretation, and safe learning guidance.",
  openGraph: {
    title: "CyberSENSE Assistant",
    description:
      "A cyber-themed AI learning assistant that explains phishing, scams, ransomware, and password safety in simple language.",
    type: "website",
  },
};

export default async function AssistantPageRoute() {
  const currentUser = await getCurrentSessionUser().catch(() => null);

  return (
    <AssistantPage
      currentName={currentUser?.username ?? null}
      currentEmail={currentUser?.email ?? null}
      currentRole={currentUser?.role ?? null}
    />
  );
}
