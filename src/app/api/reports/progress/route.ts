import { NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/context";
import {
  buildProgressReportPdfInput,
  type ProgressReportKind,
} from "@/lib/reports/report-data";
import { generateProgressReportPdf } from "@/lib/pdf/report-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "cybersense";
}

function isProgressKind(value: unknown): value is ProgressReportKind {
  return value === "progress" || value === "engagement" || value === "leaderboard";
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSessionUser("superadmin");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { kind?: unknown };
    if (!isProgressKind(body.kind)) {
      return NextResponse.json({ error: "kind is required." }, { status: 400 });
    }

    const pdfInput = await buildProgressReportPdfInput(body.kind);
    const pdfBuffer = await generateProgressReportPdf(pdfInput);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cybersense-${body.kind}-report-${slugify(session.username)}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate progress report.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
