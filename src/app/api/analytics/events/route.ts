import { NextResponse } from "next/server";

import { recordAnalyticsEvent } from "@/lib/analytics/store";
import type { AnalyticsEventPayload } from "@/lib/analytics/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyticsEventPayload>;

    if (
      typeof body.eventType !== "string" ||
      typeof body.module !== "string"
    ) {
      return NextResponse.json(
        { error: "eventType and module are required." },
        { status: 400 },
      );
    }

    await recordAnalyticsEvent({
      eventType: body.eventType as AnalyticsEventPayload["eventType"],
      module: body.module as AnalyticsEventPayload["module"],
      slug: typeof body.slug === "string" ? body.slug : undefined,
      category: typeof body.category === "string" ? body.category : undefined,
      portal: body.portal === "superadmin" ? "superadmin" : "user",
      metadata:
        body.metadata && typeof body.metadata === "object"
          ? body.metadata
          : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not record analytics event.",
      },
      { status: 500 },
    );
  }
}
