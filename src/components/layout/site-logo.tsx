import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import logoImage from "../../../Logo/CyberSENSE-logo.png";
import { cn } from "@/utils/cn";

type SiteLogoProps = {
  href?: string;
  className?: string;
};

export function SiteLogo({ href = "/", className }: SiteLogoProps) {
  return (
    <Link
      href={href}
      aria-label="CyberSENSE home"
      className={cn("group inline-flex", className)}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative h-full w-full overflow-hidden rounded-[1.35rem] border border-amber-300/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.12),rgba(234,179,8,0.12),rgba(16,185,129,0.12))] shadow-[0_0_24px_rgba(234,179,8,0.12)]"
      >
        <Image
          src={logoImage as StaticImageData}
          alt="CyberSENSE logo"
          priority
          fill
          sizes="(max-width: 640px) 140px, 160px"
          className="object-contain p-1.5"
        />
      </motion.div>
    </Link>
  );
}
