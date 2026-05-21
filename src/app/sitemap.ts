import type { MetadataRoute } from "next";

import { quizCategories } from "@/data/quizzes";
import { threats } from "@/data/threats";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/auth",
    "/threats",
    "/threats/analyzer",
    "/lab",
    "/quizzes",
    "/games/red-flags",
  ];

  const threatRoutes = threats.map((threat) => `/threats/${threat.slug}`);
  const quizRoutes = quizCategories.map((quiz) => `/quizzes/${quiz.slug}`);

  return [...staticRoutes, ...threatRoutes, ...quizRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
