import { NextResponse } from "next/server";

import { recordCertificateIssue } from "@/lib/certificates/store";
import { buildCertificatePdfInput, getReportSessionUser, getUserReportContext } from "@/lib/reports/report-data";
import { generateCertificatePdf } from "@/lib/pdf/report-generator";

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

export async function POST(request: Request) {
  try {
    const session = await getReportSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      fullName?: string;
      certificateType?: "quiz" | "milestone" | "training";
      subjectKey?: string;
    };

    if (typeof body.fullName !== "string" || !body.fullName.trim()) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    if (
      body.certificateType !== "quiz" &&
      body.certificateType !== "milestone" &&
      body.certificateType !== "training"
    ) {
      return NextResponse.json({ error: "certificateType is required." }, { status: 400 });
    }

    const context = await getUserReportContext(session.user.id);
    const pdfInput = await buildCertificatePdfInput(
      context,
      body.fullName,
      body.certificateType,
      body.subjectKey,
    );
    await recordCertificateIssue({
      userId: session.user.id,
      username: session.user.username,
      email: session.user.email,
      fullName: body.fullName,
      certificateType: body.certificateType,
      subjectKey: body.subjectKey,
      subjectTitle: pdfInput.achievementTitle,
    });
    const pdfBuffer = await generateCertificatePdf(pdfInput);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cybersense-certificate-${slugify(body.fullName)}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate certificate.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
