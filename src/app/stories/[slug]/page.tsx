import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { StoryReader } from "@/components/stories/story-reader";
import { stories, getStoryBySlug } from "@/data/stories";
import { siteName } from "@/data/site";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return { title: `Story not found | ${siteName}` };
  }

  return {
    title: `${story.title} | ${siteName}`,
    description: story.logline,
    openGraph: {
      title: story.title,
      description: story.logline,
      images: [story.cover],
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <>
      <AnalyticsBeacon
        eventType="story_viewed"
        module="stories"
        slug={story.slug}
        category="Story Missions"
        portal="user"
        dedupeKey={`story-${story.slug}`}
        metadata={{
          threatSlug: story.threatSlug,
          minutes: story.minutes,
        }}
      />
      <StoryReader story={story} />
    </>
  );
}