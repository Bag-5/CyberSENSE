import type { Metadata } from "next";
import Link from "next/link";

import { FeatureGrid } from "@/components/home/feature-grid";
import { Hero } from "@/components/home/hero";
import { AnimatedSection } from "@/components/animated-section";
import { CyberCTA } from "@/components/home/cyber-cta";
import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { siteDescription, siteName } from "@/data/site";
import { galleryImages } from "@/data/gallery";
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

      <AnimatedSection id="gallery">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/gallery"
            className={cyberPanelClasses(
              "group flex items-center justify-between gap-6 border-cyan-300/15 bg-gradient-to-br from-cyan-400/8 via-slate-900 to-fuchsia-500/8 p-6 transition duration-300 hover:border-cyan-300/30 hover:bg-white/5 sm:p-8",
            )}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                Awareness Gallery
              </p>
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl">
                See our campus campaign in action.
              </h2>
              <p className="max-w-md text-sm leading-6 text-slate-300">
                We took CyberSENSE to campus — talking phishing, safe browsing, and
                why cybersecurity matters to everyday students.
              </p>
            </div>
            <div className="hidden shrink-0 sm:flex -space-x-3">
              {galleryImages.slice(0, 4).map((img, i) => (
                <div
                  key={img.src}
                  className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-[0_0_20px_rgba(15,23,42,0.3)]"
                  style={{ zIndex: 4 - i }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950 text-xs font-semibold text-cyan-100 shadow-[0_0_20px_rgba(15,23,42,0.3)]">
                +{galleryImages.length - 4}
              </div>
            </div>
            <span className={cyberButtonClasses("primary", "sm", "shrink-0")}>
              Explore Gallery
            </span>
          </Link>
        </div>
      </AnimatedSection>

      <CyberCTA initialAuthenticated={Boolean(currentUser)} />
    </>
  );
}
