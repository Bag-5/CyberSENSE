import type { Metadata } from "next";

import { GalleryClient } from "@/components/gallery/gallery-client";
import { SectionHeader } from "@/components/ui/cyber";
import { galleryImages } from "@/data/gallery";
import { siteName } from "@/data/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Gallery | ${siteName}`,
  description: "Photos from our campus cybersecurity awareness campaign.",
};

export default function GalleryPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Awareness Gallery"
        title="We took CyberSENSE to campus."
        description="Photos from our awareness campaign — introducing students to cyber threats, safe browsing, and the CyberSENSE platform."
      />

      <GalleryClient images={galleryImages} />
    </section>
  );
}
