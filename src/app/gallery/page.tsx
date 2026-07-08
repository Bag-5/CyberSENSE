import type { Metadata } from "next";

import { GallerySlideshow } from "@/components/gallery/gallery-slideshow";
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
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Awareness Gallery"
          title="We took CyberSENSE to campus."
          description="Photos from our awareness campaign — introducing students to cyber threats, safe browsing, and the CyberSENSE platform."
        />

        <div className="mt-10">
          <GallerySlideshow images={galleryImages} />
        </div>
      </div>
    </section>
  );
}
