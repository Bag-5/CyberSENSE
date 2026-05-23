import { NextResponse } from "next/server";

import { getReportSessionUser, getUserReportContext, buildQuizReportPdfInput } from "@/lib/reports/report-data";
import { generateQuizReportPdf } from "@/lib/pdf/report-generator";

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

export async function POST() {
  try {
    const session = await getReportSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const context = await getUserReportContext(session.user.id);
    const pdfInput = buildQuizReportPdfInput(context, session.user.username);
    const pdfBuffer = await generateQuizReportPdf(pdfInput);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cybersense-quiz-report-${slugify(session.user.username)}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate quiz report.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
