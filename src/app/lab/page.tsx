import type { Metadata } from "next";

import { LabPageShell } from "@/components/lab/lab-page-shell";

export const metadata: Metadata = {
  title: "Simulated Attack Lab",
  description:
    "Explore CyberSENSE's safe educational simulation lab with phishing, fake login, password, ransomware, Wi-Fi, and app permission demos.",
};

export default function LabPage() {
  return <LabPageShell />;
}
